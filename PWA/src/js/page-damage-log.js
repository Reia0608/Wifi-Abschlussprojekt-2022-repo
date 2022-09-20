import "./app.js";
import Helper from "./helper.js";

export default class PageDamageLog
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-damage-log.html', args.app.Main, () => 
		{
			// Intilialisierung
			const damageListBody = document.querySelector('#damageListBody');
			const buttonSchadenAdd = document.querySelector('#buttonSchadenAdd');
			const dialogSchaden = new bootstrap.Modal(modalSchadenBody);
			const buttonModalSchadenSpeichern = args.app.Main.querySelector('#buttonModalSchadenSpeichern');

			// Logic
			this.loadData();

			// Event listeners
			buttonSchadenAdd.addEventListener('click', () =>
			{

			});

			//---------------------------
			buttonSchadenNeu.addEventListener( 'click', (e) => 
			{
				labelAnfallendeKosten.value = '';
				selectSchadenArt.value = '0';
				labelBeschreibung.value = '';
				this.schaden = null;
				labelAnfallendeKosten.classList.remove('is-invalid', 'is-valid');
				selectSchadenArt.classList.remove('is-invalid', 'is-valid');

				dialogSchaden.show();
			});

			//---------------------------
			buttonModalSchadenSpeichern.addEventListener('click', (e) => 
			{
				let schadensArtText = "Unbekannt";
				let saveOk = true;
				labelAnfallendeKosten.classList.remove('is-invalid', 'is-valid');
				selectSchadenArt.classList.remove('is-invalid', 'is-valid');

				if (!labelAnfallendeKosten.value || (labelAnfallendeKosten.value && isNaN(labelAnfallendeKosten.value))) 
				{
					saveOk = false;
					labelAnfallendeKosten.classList.add('is-invalid');
				}
				else labelAnfallendeKosten.classList.add('is-valid');

				if (selectSchadenArt.value == '0') 
				{
					saveOk = false;
					selectSchadenArt.classList.add('is-invalid');
				}
				else selectSchadenArt.classList.add('is-valid');

				if (saveOk) 
				{
					if (!this.schaden) 
					{
						this.schaden = 
						{
							schaden_id: null,
							schaden_datum: new Date()
						};
					}
					schadensArtText = selectSchadenArt.options[selectSchadenArt.selectedIndex].text;
					this.schaden.kraftfahrzeug_id = parseInt(args.kid);
					this.schaden.anfallendekosten = (labelAnfallendeKosten.value && !isNaN(labelAnfallendeKosten.value) ? parseInt(labelAnfallendeKosten.value) : 0);
					this.schaden.schadensart = schadensArtText;
					this.schaden.beschreibung = labelBeschreibung.value;

					if(divDateSchaden.value == "")
					{
						this.schaden.schaden_datum = null;
					}
					else
					{
						this.schaden.schaden_datum = divDateSchaden.value;
					}
					
					if(!this.kraftfahrzeug)
					{
						this.kraftfahrzeug = null;
						if (!this.kraftfahrzeug.schadenlist)
						{
							this.kraftfahrzeug.schadenlist = [];
						} 
					}
					
					this.kraftfahrzeug.schadenlist.push(this.schaden);
					

					// Update the database.
					this.app.ApiSchadenSet(() => 
					{
						console.log("database was updated!");
						if (this.bild) 
						{
							this.bild.schaden_id = this.schaden.schaden_id;
							this.app.ApiSchadenSetBild(() => 
							{
								this.datenLaden(this.kraftfahrzeug.kraftfahrzeug_id);
							}, (ex) => 
							{
								alert(ex);
							}, this.bild);
						}
						else
						{
							this.datenLaden(this.kraftfahrzeug.kraftfahrzeug_id);
						}
					}, (ex) => 
					{
						alert(ex);
					}, this.schaden);

					dialogSchaden.hide();
				}
			});
		});
	}

    // functions
	loadData()
	{
		// Initialisierung
		var kraftfahrzeug_id = localStorage.getItem("kid");
		const dateFormatter = new Intl.DateTimeFormat('de-AT', 
        {
            dateStyle: 'short'
        });

		// logic
		this.app.ApiSchadenGetKfzList((response) =>
		{
			let html = '';
			let iterator = 1;
			if(response == null)
			{
				damageListBody.innerHTML = `<p>Es gibt keine Schäden am Fahrzeug!</p>`;
			}
			else
			{
				damageListBody.innerHTML = '';
				for (let schaden of response) 
				{
					html += 
					`<div class="card cards mt-3" style="width: 18rem;">
						<img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-schaden-id="${schaden.schaden_id}" id="imgBild_${iterator}">
						<div class="card-body" data-schaden-id="${schaden.schaden_id}">
							<h5 class="card-title">Schaden Nummer ${iterator}</h5>
							<p class="card-text">
								Schadensart: ${schaden.schadensart}<br>
								Beschreibung: ${schaden.beschreibung}<br>
								Anfallende Kosten: €${schaden.anfallendekosten},-<br>
								Datum des entstandenen Schadens: ${dateFormatter.format(new Date(schaden.schaden_datum))}<br>
							</p>
						</div>
					</div>
					`;
					iterator++;
					damageListBody.innerHTML += html;
				}
				this.app.ApiBilderGetAllSchadenListFromKfz((response) =>
                {
					if(response.length > 0)
					{
						let jiterator = 1;
						for(let iterator = 0; iterator < response.length; iterator++)
						{
							for (let schadenBild of response)
							{
								if(jiterator <= response.length)
								{
									var imgIdentifier = "imgBild_" + jiterator.toString();
									var imgBild = document.getElementById(imgIdentifier);
			
									if(schadenBild.kraftfahrzeug_id == imgBild.dataset.kraftfahrzeugId)
									{
										imgBild.src = "data:image/jpeg;base64," + schadenBild.bild_bytes;
										jiterator++;
									}	
								}
							}
						}
					}
                }, (ex) => 
                {
                    alert(ex);
                }, kraftfahrzeug_id);
			}
		}, (ex) =>
		{
			alert(ex);
		}, kraftfahrzeug_id);
	}
}