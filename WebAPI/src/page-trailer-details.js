import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import Helper from "./helper.js";

export default class PageTrailerDetails 
{
	constructor(args) 
	{
		this.app = args.app;

		args.app.Body.style.paddingBottom = '60px';
		args.app.LoadHTML('./page-trailer-details.html', args.app.Main, () => 
		{
			const imgContainer = args.app.Main.querySelector('#imgContainer');
			const buttonAnhaengerSpeichern = args.app.Main.querySelector('#buttonAnhaengerSpeichern');
			const buttonAnhaengerAbbrechen = args.app.Main.querySelector('#buttonAnhaengerAbbrechen');
			const modalSchadenBody = args.app.Main.querySelector('#modalSchadenBody');
			const buttonSchadenNeu = args.app.Main.querySelector('#buttonSchadenNeu');
			const dialogSchaden = new bootstrap.Modal(modalSchadenBody);
			const buttonModalSchadenSpeichern = args.app.Main.querySelector('#buttonModalSchadenSpeichern');
			const labelAnfallendeKosten = args.app.Main.querySelector('#labelAnfallendeKosten');
			const selectSchadenArt = args.app.Main.querySelector('#selectSchadenArt');
			const labelBeschreibung = args.app.Main.querySelector('#labelBeschreibung');	
			const divDateSchaden = args.app.Main.querySelector('#divDateSchaden');
			const imgBild = this.app.Main.querySelector('#imgBild');
			
			// Initialisierung
			var anhaengerbild = {};

			if(args.aid)
			{
				let anhaenger_id = parseInt(args.aid);
				this.datenLaden(anhaenger_id);
			}
			else
			{
				this.schadenListAnzeigen(); 
			}

			//-------------------------------------------------------------
			// drag & drop Bild
			imgContainer.addEventListener('dragover', (event) => 
			{
				event.stopPropagation();
				event.preventDefault();
				event.dataTransfer.dropEffect = 'copy';
		 	});

			imgContainer.addEventListener('drop', (event) => 
			{
				event.stopPropagation();
				event.preventDefault();
				const fileList = event.dataTransfer.files;
				this.bild = fileList[0];
				const reader = new FileReader();
				reader.addEventListener('load', (event) => 
				{
					// convert the image into a base64 string that can be saved as Byte[].
					let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
					anhaengerbild.bild_bytes = base64String;

					imgBild.src = event.target.result;	
				});
				reader.readAsDataURL(fileList[0]);
			});

			imgContainer.addEventListener('click', (event) =>
			{

			});
			
			//-------------------------------------------------------------
			// speichern
			buttonAnhaengerSpeichern.addEventListener('click', (e) => 
			{
				const inputMarke = this.app.Main.querySelector('#inputMarke');
				const inputModell = this.app.Main.querySelector('#inputModell');
				const inputKennzeichen = this.app.Main.querySelector('#inputKennzeichen');
				const inputMietpreis = this.app.Main.querySelector('#inputMietpreis');

				if (inputMarke.value && inputModell.value) 
				{
					if(args.aid)
					{
						this.anhaenger.anhaenger_id = parseInt(args.aid);
					}
					else
					{
						this.anhaenger = {};
					}
					this.anhaenger.marke = inputMarke.value;
					this.anhaenger.modell = inputModell.value;
					this.anhaenger.kennzeichen = inputKennzeichen.value;
					this.anhaenger.mietpreis = inputMietpreis.value && !isNaN(inputMietpreis.value) ? parseFloat(inputMietpreis.value) : null;

					this.app.ApiAnhaengerSet(() => 
					{
						if (anhaengerbild.bild_bytes) 
						{
							anhaengerbild.anhaenger_id = this.anhaenger.anhaenger_id;
							this.app.ApiBilderSet(() => 
							{

							}, (ex) => 
							{
								alert(ex);
							}, anhaengerbild);
						}
					}, (ex) => 
					{
						alert(ex);
					}, this.anhaenger);
				}
				else 
				{
					alert('Marke und Modell sind Pflicht!');
				}
				location.hash = '#trailerlist';
			});

			//-------------------------------------------------------------
			// Vorgang abbrechen
			buttonAnhaengerAbbrechen.addEventListener('click', (e) =>
			{
				location.hash = '#trailerlist';
			});

			//------------------------------------------------------------------------------------------
			// alles rund um den Schaden


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
					this.schaden.anhaenger_id = parseInt(args.aid);
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
					
					// WIP causes error when schaden is made without an existing trailer.
					if(!this.anhaenger)
					{
						this.anhaenger = null;
						if (!this.anhaenger.schadenlist)
						{
							this.anhaenger.schadenlist = [];
						} 
					}
					
					this.anhaenger.schadenlist.push(this.schaden);
					

					// Update the database.
					this.app.ApiSchadenSet(() => 
					{
						console.log("database was updated!");
						if (this.bild) 
						{
							this.bild.schaden_id = this.schaden.schaden_id;
							this.app.ApiSchadenSetBild(() => 
							{
								this.datenLaden(this.anhaenger.anhaenger_id);
							}, (ex) => 
							{
								alert(ex);
							}, this.bild);
						}
						else
						{
							this.datenLaden(this.anhaenger.anhaenger_id);
						}
					}, (ex) => 
					{
						alert(ex);
					}, this.schaden);

					dialogSchaden.hide();
				}
			});

			//---------------------------
			tableSchadenList.addEventListener('click', (e) => 
			{
				let btn = null;
				if (e.target.nodeName.toUpperCase() == 'PATH' && e.target.parentElement.nodeName.toUpperCase() == 'SVG' && e.target.parentElement.parentElement.nodeName == 'BUTTON')
				{
					btn = e.target.parentElement.parentElement;
				} 
				else if (e.target.nodeName.toUpperCase() == 'SVG' && e.target.parentElement.nodeName == 'BUTTON')
				{
					btn = e.target.parentElement;
				} 
				else if (e.target.nodeName == 'BUTTON') 
				{
					btn = e.target;
				}

				if (btn) 
				{
					if (confirm('Wollen Sie den Schadenseintrag wirklich löschen?')) 
					{
						let id = parseInt(btn.id.split('_')[1], 10);
			
						this.app.ApiSchadenDelete(() => 
						{
							console.log("entry was deleted!");
							this.datenLaden(this.anhaenger.anhaenger_id);
						}, (ex) => 
						{
							alert(ex);
						}, id);
					}	
				}
				else if (e.target.nodeName == 'TD') 
				{
					let idx = parseInt(e.target.parentElement.dataset.idx);
					this.schaden = this.anhaenger.schadenlist[idx];
					labelAnfallendeKosten.value = this.schaden.anfallendekosten;
					selectSchadenArt.value =  new Helper().SchadensArtConverter(this.schaden.schadensart);
					labelBeschreibung.value = this.schaden.beschreibung;
					divDateSchaden.Value = new Date(this.schaden.schaden_datum); // WIP: does not show the date in the Modal!

					dialogSchaden.show();
				}
			});
		}); // LoadHTML
	} // constructor

	datenLaden(anhaenger_id) 
	{
		this.app.ApiAnhaengerGet((response) => 
		{
			this.anhaenger = response;

			//const bildliste = response.bildliste;

			inputMarke.value = this.anhaenger.marke;
			inputModell.value = this.anhaenger.modell;
			inputKennzeichen.value = this.anhaenger.kennzeichen;
			inputMietpreis.value = this.anhaenger.mietpreis;

			// Anhänger Bild anzeigen
			this.app.ApiBilderGetAnhaengerList((response) =>
			{
				if(response != null && response.length > 0)
				{
					let bildliste = response;
					imgBild.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
				}
				this.schadenListAnzeigen();
			}, (ex) => 
			{
				alert(ex);
			}, this.anhaenger.anhaenger_id);
		}, (ex) => 
		{
			alert(ex);
		}, anhaenger_id);
	}

	//----------------------------------------------------------------------------------------
	// Anzeige

	// schaden anzeigen
	schadenListAnzeigen() 
	{
		const tableSchadenList = this.app.Main.querySelector('#tableSchadenList');
		const trSchadenHeader = this.app.Main.querySelector('#trSchadenHeader');
		const dateFormatter = new Intl.DateTimeFormat('de-AT', 
		{
			dateStyle: 'medium'
		});
		let html = '';

		if(typeof this.anhaenger != "undefined")
		{
			this.app.ApiSchadenGetAnhaengerList((response) => 
			{
				this.anhaenger.schadenlist = response;
				let iterator = 0;
				for (let schadenitem of this.anhaenger.schadenlist) 
				{
					html += 
					`
					<tr data-idx="${iterator}">
						<th scope="row">
							<button type="button" class="btn btn-outline-dark btn-sm" id="buttonSchadenDel_${schadenitem.schaden_id}"><span class="iconify" data-icon="mdi-delete"></span></button>
						</th>
						<td>${(schadenitem.schaden_datum ? dateFormatter.format(new Date(schadenitem.schaden_datum)) : '&nbsp;')}</td>
						<td>${(schadenitem.schadensart ? schadenitem.schadensart : '&nbsp;')}</td>
						<td>${(schadenitem.beschreibung? schadenitem.beschreibung : '&nbsp;')}</td>
						<td>${(schadenitem.anfallendekosten ? schadenitem.anfallendekosten : '&nbsp;')}</td>
					</tr>
					`;
					iterator++;
				}
				tableSchadenList.innerHTML = html;
			}, (ex) => 
			{
				alert(ex);
			}, this.anhaenger.anhaenger_id);
		}
		else
		{
			html = 
			`
			<td>Erzeugen Sie bitte ein Fahrzeug um den Schaden eintragen zu können!</td>
			`
			trSchadenHeader.innerHTML = html;
		}		
	}
}