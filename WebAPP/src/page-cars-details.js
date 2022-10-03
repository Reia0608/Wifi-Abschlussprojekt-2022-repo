import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import Helper from "./helper.js";

export default class PageCarsDetails 
{
	constructor(args) 
	{
		this.app = args.app;

		args.app.Body.style.paddingBottom = '60px';
		args.app.LoadHTML('./page-cars-details.html', args.app.Main, () => 
		{
			const imgContainer = args.app.Main.querySelector('#imgContainer');
			const buttonKfzSpeichern = args.app.Main.querySelector('#buttonKfzSpeichern');
			const buttonKfzAbbrechen = args.app.Main.querySelector('#buttonKfzAbbrechen');
			const modalSchadenBody = args.app.Main.querySelector('#modalSchadenBody');
			const buttonSchadenNeu = args.app.Main.querySelector('#buttonSchadenNeu');
			const dialogSchaden = new bootstrap.Modal(modalSchadenBody);
			const buttonModalSchadenSpeichern = args.app.Main.querySelector('#buttonModalSchadenSpeichern');
			const labelAnfallendeKosten = args.app.Main.querySelector('#labelAnfallendeKosten');
			const selectSchadenArt = args.app.Main.querySelector('#selectSchadenArt');
			const labelBeschreibung = args.app.Main.querySelector('#labelBeschreibung');	
			const divDateSchaden = args.app.Main.querySelector('#divDateSchaden');
			const imgBild = this.app.Main.querySelector('#imgBild');
			const spanKraftfahrzeugJahre = this.app.Main.querySelector('#spanKraftfahrzeugJahre');
			const selectAusgabenstelle = this.app.Main.querySelector('#selectAusgabenstelle');
			const divAusgabenstelleBody = this.app.Main.querySelector('#divAusgabenstelleBody');
			
			// Hiding the ID for security
			history.replaceState({}, null, "./index.html#carsdetails");

			// Initialisierung
			var kfzbild = {};

			if(args.kid)
			{
				let kraftfahrzeug_id = parseInt(args.kid);
				this.datenLaden(kraftfahrzeug_id);
			}
			else
			{
				this.loadOptions();
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
					kfzbild.bild_bytes = base64String;

					imgBild.src = event.target.result;	
				});
				reader.readAsDataURL(fileList[0]);
			});

			imgContainer.addEventListener('click', (event) =>
			{

			});
			
			//-------------------------------------------------------------
			// speichern
			buttonKfzSpeichern.addEventListener('click', (e) => 
			{
				const inputMarke = this.app.Main.querySelector('#inputMarke');
				const inputModell = this.app.Main.querySelector('#inputModell');
				const inputKennzeichen = this.app.Main.querySelector('#inputKennzeichen');
				const inputMietpreis = this.app.Main.querySelector('#inputMietpreis');
				const inputBaujahr = this.app.Main.querySelector('#inputBaujahr');
				const selectKlasse = this.app.Main.querySelector('#selectKlasse');
				const selectKategorie = this.app.Main.querySelector('#selectKategorie');
				const selectAusgabenstelle = this.app.Main.querySelector('#selectAusgabenstelle');

				if (inputMarke.value && inputModell.value) 
				{
					if(args.kid)
					{
						this.kraftfahrzeug.kraftfahrzeug_id = parseInt(args.kid);
					}
					else
					{
						this.kraftfahrzeug = {};
					}
					this.kraftfahrzeug.marke = inputMarke.value;
					this.kraftfahrzeug.modell = inputModell.value;
					this.kraftfahrzeug.kennzeichen = inputKennzeichen.value;
					this.kraftfahrzeug.mietpreis = inputMietpreis.value && !isNaN(inputMietpreis.value) ? parseFloat(inputMietpreis.value) : null;
					this.kraftfahrzeug.baujahr = parseInt(inputBaujahr.value);
					this.kraftfahrzeug.klasse = selectKlasse.options[selectKlasse.selectedIndex].text;
					this.kraftfahrzeug.kategorie = selectKategorie.options[selectKategorie.selectedIndex].text;
					
					if(selectAusgabenstelle.options[selectAusgabenstelle.selectedIndex].text != "Bitte wählen")
					{
						// Get Ausgabenstelle ID
						this.app.ApiAusgabenstelleGetIdByName((response) =>
						{
							this.kraftfahrzeug.ausgabenstelle_id = response;

							// Save Kraftfahrzeug
							this.app.ApiKraftfahrzeugSet(() => 
							{
								if (kfzbild.bild_bytes) 
								{
									kfzbild.kraftfahrzeug_id = this.kraftfahrzeug.kraftfahrzeug_id;
									this.app.ApiBilderSet(() => 
									{
										location.hash = '#carlist';
									}, (ex) => 
									{
										alert(ex);
									}, kfzbild);
								}
								else
								{
									location.hash = '#carlist';
								}
							}, (ex) => 
							{
								alert(ex);
							}, this.kraftfahrzeug);
						}, (ex) =>
						{
							alert(ex);
						}, selectAusgabenstelle.options[selectAusgabenstelle.selectedIndex].text);
					}
					else
					{
						// Save Kraftfahrzeug
						this.app.ApiKraftfahrzeugSet(() => 
						{
							if (kfzbild.bild_bytes) 
							{
								kfzbild.kraftfahrzeug_id = this.kraftfahrzeug.kraftfahrzeug_id;
								this.app.ApiBilderSet(() => 
								{
									location.hash = '#carlist';
								}, (ex) => 
								{
									alert(ex);
								}, kfzbild);
							}
							else
							{
								location.hash = '#carlist';
							}
						}, (ex) => 
						{
							alert(ex);
						}, this.kraftfahrzeug);
					}
				}
				else 
				{
					alert('Marke und Modell sind Pflicht!');
				}
			});

			//-------------------------------------------------------------
			// Vorgang abbrechen
			buttonKfzAbbrechen.addEventListener('click', (e) =>
			{
				location.hash = '#carlist';
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
							this.datenLaden(this.kraftfahrzeug.kraftfahrzeug_id);
						}, (ex) => 
						{
							alert(ex);
						}, id);
					}	
				}
				else if (e.target.nodeName == 'TD') 
				{
					let idx = parseInt(e.target.parentElement.dataset.schadenIdx);
					this.schaden = this.kraftfahrzeug.schadenlist[idx];
					labelAnfallendeKosten.value = this.schaden.anfallendekosten;
					selectSchadenArt.value =  new Helper().SchadensArtConverter(this.schaden.schadensart);
					labelBeschreibung.value = this.schaden.beschreibung;
					divDateSchaden.Value = new Date(this.schaden.schaden_datum); // WIP: does not show the date in the Modal!

					dialogSchaden.show();
				}
			});
		}); // LoadHTML
	} // constructor

	datenLaden(kraftfahrzeug_id) 
	{
		this.app.ApiAusgabenstelleAllNames((response) =>
		{
			let html = `<select class="form-select col-6" aria-label="Rueckgabe Ort" id="selectAusgabenstelle"><option>Bitte wählen</option>`;

			for(let ausgabenstellename of response)
			{
				html += 
				`
				<option value="${ausgabenstellename}">${ausgabenstellename}</option>
				`;
			}

			html += `</select>`;
			divAusgabenstelleBody.innerHTML = html;

			// Load Data
			this.app.ApiKraftfahrzeugGet((response) => 
			{
				let currentYear = new Date().getFullYear();
				this.kraftfahrzeug = response;

				//const bildliste = response.bildliste;

				inputMarke.value = this.kraftfahrzeug.marke;
				inputModell.value = this.kraftfahrzeug.modell;
				inputKennzeichen.value = this.kraftfahrzeug.kennzeichen;
				inputMietpreis.value = this.kraftfahrzeug.mietpreis;
				inputBaujahr.value = this.kraftfahrzeug.baujahr;
				spanKraftfahrzeugJahre.textContent = (currentYear - inputBaujahr.value).toString();
				if(this.kraftfahrzeug.klasse == null)
				{
					selectKlasse.value = '0';
				}
				else
				{
					selectKlasse.options[selectKlasse.selectedIndex].text = this.kraftfahrzeug.klasse;
				}
				
				if(this.kraftfahrzeug.kategorie == null)
				{
					selectKategorie.value = '0';
				}
				else
				{
					selectKategorie.options[selectKategorie.selectedIndex].text = this.kraftfahrzeug.kategorie;
				}
				
				if(this.kraftfahrzeug.ausgabenstelle_id == null)
				{
					selectAusgabenstelle.value = '0';

					// Kfz Bild anzeigen
					this.app.ApiBilderGetKfzList((response) =>
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
					}, this.kraftfahrzeug.kraftfahrzeug_id);
				}
				else
				{
					this.app.ApiAusgabenstelleGetName((response) =>
					{
						selectAusgabenstelle.value = response;

						// Kfz Bild anzeigen
						this.app.ApiBilderGetKfzList((response) =>
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
						}, this.kraftfahrzeug.kraftfahrzeug_id);
					}, (ex) =>
					{
						alert(ex);
					}, this.kraftfahrzeug.ausgabenstelle_id);
				}

				// if (bildliste != null)
				// {

				// 	for(var iterator=0 ; iterator< bildliste.length ; iterator++) 
				// 	{
				// 		$('<div class="item"><img src="'+bildliste.Bild_Url[iterator]+'"><div class="carousel-caption"></div>   </div>').appendTo('.carousel-inner');
				// 		$('<li data-target="#carouselControlImages" data-slide-to="'+iterator+'"></li>').appendTo('.carousel-indicators')
				// 	}
				// 	$('.item').first().addClass('active'); 
				// 	$('.carousel-indicators > li').first().addClass('active');
				// 	$('#carouselControlImages').carousel(); 
				// }

				// if (this.kraftfahrzeug.bildliste) 
				// {
				// 	imgBild.src = this.app.apiBaseUrl + 'kraftfahrzeug/' + this.kraftfahrzeug.kraftfahrzeug_id + '/bild';
				// }

				//this.bilderAnzeigen();
			}, (ex) => 
			{
				alert(ex);
			}, kraftfahrzeug_id);
		}, (ex) =>
		{
			alert(ex);
		});
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

		if(typeof this.kraftfahrzeug != "undefined")
		{
			this.app.ApiSchadenGetKfzList((response) => 
			{
				this.kraftfahrzeug.schadenlist = response;
				let iterator = 0;
				for (let schadenitem of this.kraftfahrzeug.schadenlist) 
				{
					html += 
					`
					<tr data-schaden-idx="${iterator}">
						<th scope="row">
							<button type="button" class="btn btn-sm" id="buttonSchadenDel_${schadenitem.schaden_id}"><span class="iconify" data-icon="mdi-delete"></span></button>
						</th>
						<td scope="col">${(schadenitem.schaden_datum ? dateFormatter.format(new Date(schadenitem.schaden_datum)) : '&nbsp;')}</td>
						<td scope="col">${(schadenitem.schadensart ? schadenitem.schadensart : '&nbsp;')}</td>
						<td scope="col">${(schadenitem.beschreibung? schadenitem.beschreibung : '&nbsp;')}</td>
						<td scope="col">${(schadenitem.anfallendekosten ? schadenitem.anfallendekosten : '&nbsp;')}</td>
					</tr>
					`;
					iterator++;
				}
				tableSchadenList.innerHTML = html;
			}, (ex) => 
			{
				alert(ex);
			}, this.kraftfahrzeug.kraftfahrzeug_id);
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

	// this.app.ApiAusgabenstelleNamesByKfz((response) =>
	// {
	// 	let html = `<select class="form-select col-6" aria-label="Abhol Ort" id="selectAbholort"><option>Bitte wählen</option>`;

	// 	for(let ausgabenstellename of response)
	// 	{
	// 		html += 
	// 		`
	// 		<option value="${ausgabenstellename}">${ausgabenstellename}</option>
	// 		`;
	// 	}

	// 	html += `</select>`;
	// 	divAbholortBody.innerHTML = html;


	// }, (ex) => 
	// {
	// 	alert(ex);
	// }, this.kraftfahrzeug.marke, this.kraftfahrzeug.modell); 

	loadOptions()
	{
		this.app.ApiAusgabenstelleAllNames((response) =>
		{
			let html = `<select class="form-select col-6" aria-label="Rueckgabe Ort" id="selectAusgabenstelle"><option>Bitte wählen</option>`;

			for(let ausgabenstellename of response)
			{
				html += 
				`
				<option value="${ausgabenstellename}">${ausgabenstellename}</option>
				`;
			}

			html += `</select>`;
			divAusgabenstelleBody.innerHTML = html;

			this.schadenListAnzeigen(); 
		}, (ex) =>
		{
			alert(ex);
		});
	}
}