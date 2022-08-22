import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";

export default class PageProfile
{
    constructor(appArgs)
    {
        this.app = appArgs.app;
        const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];

        appArgs.app.LoadHTML('./page-profile.html', appArgs.app.Main, () => 
		{
			const imgContainer = document.querySelector('#imgContainer');
			const imgBild = document.querySelector('#imgBild');
			const buttonBenutzerSpeichern = document.querySelector('#buttonBenutzerSpeichern');
			const buttonBenutzerAbbrechen = document.querySelector('#buttonBenutzerAbbrechen');
			const buttonPasswortAendern = document.querySelector('#buttonPasswortAendern');
			const dialogPasswort = new bootstrap.Modal(modalPasswortBody);
			const buttonModalPasswortSpeichern = document.querySelector('#buttonModalPasswortSpeichern');
			const buttonFSKNeu = document.querySelector('#buttonFSKNeu');
			const dialogFuehrerschein = new bootstrap.Modal(modalFSKBody);
			const buttonModalFSKSpeichern = document.querySelector('#buttonModalFSKSpeichern');
			const checkboxSwitchIstFahrer = document.querySelector('#checkboxSwitchIstFahrer');
			const checkboxSwitchHatZugfahrzeug = document.querySelector('#checkboxSwitchHatZugfahrzeug');
			const inputMarke = document.querySelector('#inputMarke');
			const inputModell = document.querySelector('#inputModell');
			const inputKennzeichen = document.querySelector('#inputKennzeichen');

			this.checkboxAll = document.querySelector('#checkboxAll');

			// Initialisierung
			var benutzerBild = {};

			var bm = localStorage.getItem("bm");

			this.benutzer = {};

			if(bm)
			{
				this.datenLaden(bm);
			}
			else
			{
				alert('Kein Benutzer angemeldet!');
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
					benutzerBild.bild_bytes = base64String;

					imgBild.src = event.target.result;	
				});
				reader.readAsDataURL(fileList[0]);
			});

			//-------------------------------------------------------------
			// Passwort ändern-click

			buttonPasswortAendern.addEventListener('click', (e) => 
			{
				labelAltesPasswort.classList.remove('is-invalid', 'is-valid');
				labelNeuesPasswort1.classList.remove('is-invalid', 'is-valid');
				labelNeuesPasswort2.classList.remove('is-invalid', 'is-valid');
				labelAltesPasswort.value = "";
				labelNeuesPasswort1.value = "";
				labelNeuesPasswort2.value = "";

				dialogPasswort.show();
			});

			//---------------------------
			buttonModalPasswortSpeichern.addEventListener('click', (e) => 
			{
				let saveOk = true;
				labelAltesPasswort.classList.remove('is-invalid', 'is-valid');
				labelNeuesPasswort1.classList.remove('is-invalid', 'is-valid');
				labelNeuesPasswort2.classList.remove('is-invalid', 'is-valid');

				if (!labelAltesPasswort.value) 
					{
						saveOk = false;
						labelAltesPasswort.classList.add('is-invalid');
					}
					else
					{
						labelAltesPasswort.classList.add('is-valid');
					} 

					if(!labelNeuesPasswort1.value || labelAltesPasswort.value == labelNeuesPasswort1.value)
					{
						saveOk = false;
						labelNeuesPasswort1.classList.add('is-invalid');
					}
					else
					{
						labelNeuesPasswort1.classList.add('is-valid');
					} 

					if (labelNeuesPasswort1.value != labelNeuesPasswort2.value) 
					{
						saveOk = false;
						labelNeuesPasswort2.classList.add('is-invalid');
					}
					else
					{
						labelNeuesPasswort2.classList.add('is-valid');
					} 

					this.app.ApiBenutzerCheck((response) => 
					{
						if(response.success == false)
						{
							saveOk = false;
							alert("falsches Passwort!");
						}
						else
						{
							if (saveOk) 
							{
								this.benutzer.passwort = labelNeuesPasswort1.value;

								// Update the database.
								this.app.ApiBenutzerSet(() => 
								{
									console.log("database was updated!");
								}, (ex) => 
								{
									alert(ex);
								}, this.benutzer);

								dialogPasswort.hide();
							}
						}
					}, (ex) => 
					{
						alert(ex);
					}, bm);
			});

			//-------------------------------------------------------------
			// Button-Führerscheinklassen-Hinzufügen/Entfernen-click

			buttonFSKNeu.addEventListener( 'click', (e) => 
			{
				this.app.ApiBenutzerGetFSKObject((response) => 
				{
					this.fuehrerscheinklassenlist = response;

					// WIP check/ uncheck boxes in Modal
				}, (ex) => 
				{
					alert(ex);
				}, this.benutzer.userid);

				dialogFuehrerschein.show();
			});

			// Button Modal Führerscheinklassen checkboxAll-click

			this.checkboxAll.addEventListener('click', ()=>
			{
				let checkboxCollection = document.querySelectorAll('#checkboxSelect');
				let selected = this.checkboxAll.checked;
				for(let checkbox of checkboxCollection) 
				{    
					checkbox.checked = selected; 
				}
			});


			//-------------------------------------------------------------
			// Button-Modal-Führerscheinklassen-speichern-click

			buttonModalFSKSpeichern.addEventListener( 'click', (e) => 
			{
				let selectedFSKList = [];
				let checkboxCollection = document.querySelectorAll('#checkboxSelect');
				for(let checkbox of checkboxCollection) 
				{    
					if(checkbox.checked)
					{
						selectedFSKList.push(true);
					} 
					else
					{
						selectedFSKList.push(false);
					}
				}

				this.app.ApiBenutzerFSKAdd(() =>
				{
					this.datenLaden(bm);
				}, (ex) =>
				{
					alert(ex);
				}, this.benutzer.userid ,selectedFSKList);

				dialogFuehrerschein.hide();
			});

			//-------------------------------------------------------------
			// Checkbox-Switch-Ist-Fahrer-click
			checkboxSwitchIstFahrer.addEventListener('click', (e) =>
			{
				if(checkboxSwitchIstFahrer.checked == true)
				{
					this.benutzer.istfahrer = true;
					collapseFuehrerschein.classList.add("show");
				}
				else
				{
					this.benutzer.istfahrer = false;
					collapseFuehrerschein.classList.remove("show");
				}
			});

			//-------------------------------------------------------------
			// Checkbox-Switch-Hat-Zugfahrzeug-click
			checkboxSwitchHatZugfahrzeug.addEventListener('click', (e) =>
			{
				if(checkboxSwitchHatZugfahrzeug.checked == true)
				{
					this.benutzer.hatzugfahrzeug = true;
					collapseZugfahrzeug.classList.add("show");
				}
				else
				{
					this.benutzer.hatzugfahrzeug = false;
					collapseZugfahrzeug.classList.remove("show");
				}
			});

			//-------------------------------------------------------------
			// speichern

			buttonBenutzerSpeichern.addEventListener('click', (e) => 
			{
				const inputBenutzername = document.querySelector('#inputBenutzername');
				const inputVorname = document.querySelector('#inputVorname');
				const inputNachname = document.querySelector('#inputNachname');
				const inputDateGeburtsdatum = document.querySelector('#inputDateGeburtsdatum');
				const inputGeburtsort = document.querySelector('#inputGeburtsort');

				if (inputBenutzername.value && inputVorname.value && inputNachname.value) 
				{
					let saveOk = true;
					if(bm)
					{
						this.benutzer.username = inputBenutzername.value;
						this.benutzer.vorname = inputVorname.value;
						this.benutzer.nachname = inputNachname.value;
						if(inputDateGeburtsdatum.value)
						{
							this.benutzer.geburtsdatum = inputDateGeburtsdatum.value;
						}
						this.benutzer.geburtsort = inputGeburtsort.value;
						
						if(checkboxSwitchIstFahrer.checked)
						{
							this.benutzer.istfahrer = true;

							if(!inputDateAusstellung.value)
							{
								saveOk = false;
								inputDateAusstellung.classList.add('is-invalid');
								inputDateAusstellung.classList.remove('is-valid');
							}
							else
							{
								inputDateAusstellung.classList.add('is-valid');
								inputDateAusstellung.classList.remove('is-invalid');
							}

							if(!inputDateAblauf.value)
							{
								saveOk = false;
								inputDateAblauf.classList.add('is-invalid');
								inputDateAblauf.classList.remove('is-valid');
							}
							else
							{
								inputDateAblauf.classList.add('is-valid');
								inputDateAblauf.classList.remove('is-invalid');
							}

							if(!inputFuehrerscheinnummer.value)
							{
								saveOk = false;
								inputFuehrerscheinnummer.classList.add('is-invalid');
								inputFuehrerscheinnummer.classList.remove('is-valid');
							}
							else
							{
								inputFuehrerscheinnummer.classList.add('is-valid');
								inputFuehrerscheinnummer.classList.remove('is-invalid');
							}

							if(saveOk)
							{
								if(inputDateAusstellung.value)
								{
									this.benutzer.fuehrerscheinausstellungsdatum = inputDateAusstellung.value;
								}
								if(inputDateAblauf.value)
								{
									this.benutzer.fuehrerscheinablaufdatum = inputDateAblauf.value;
								}
								this.benutzer.fuehrerscheinnummer = inputFuehrerscheinnummer.value;
							}
						}

						if(checkboxSwitchHatZugfahrzeug.checked)
						{
							this.benutzer.hatzugfahrzeug = true;

							if (!inputMarke.value) 
							{
								saveOk = false;
								inputMarke.classList.add('is-invalid');
								inputMarke.classList.remove('is-valid');
							}
							else 
							{
								inputMarke.classList.add('is-valid');
								inputMarke.classList.remove('is-invalid');
								this.benutzer.eigeneszugfahrzeugmarke = inputMarke.value;
							}

							if (!inputModell.value) 
							{
								saveOk = false;
								inputModell.classList.add('is-invalid');
								inputModell.classList.remove('is-valid');
							}
							else 
							{
								inputModell.classList.add('is-valid');
								inputModell.classList.remove('is-invalid');
								this.benutzer.eigeneszugfahrzeugmodell = inputModell.value;
							}

							if (!inputKennzeichen.value) 
							{
								saveOk = false;
								inputKennzeichen.classList.add('is-invalid');
								inputKennzeichen.classList.remove('is-valid');
							}
							else 
							{
								inputKennzeichen.classList.add('is-valid');
								inputKennzeichen.classList.remove('is-invalid');
								this.benutzer.eigeneszugfahrzeugkennzeichen = inputKennzeichen.value;
							}
						}

						if(saveOk)
						{
							this.app.ApiBenutzerSetWOP(() => 
							{
								if (benutzerBild.bild_bytes) 
								{
									benutzerBild.users_id = this.benutzer.userid;
									this.app.ApiBilderSet(() => 
									{

									}, (ex) => 
									{
										alert(ex);
									}, benutzerBild);
								}
							}, (ex) => 
							{
								alert(ex);
							}, this.benutzer);
							window.open('http://localhost:5500/src/index.html', '_self');
						}
					}
				}
				else 
				{
					alert('Vorname, Nachname und Benutzername sind Pflicht!');
				}
			});

			//-------------------------------------------------------------
			// Vorgang abbrechen

			buttonBenutzerAbbrechen.addEventListener('click', (e) =>
			{
				location.hash = '#home';
			});
		});
	}
			
	//-------------------------------------------------------------
	// Daten Laden

	datenLaden(benutzerMerkmal)
	{
		this.app.ApiBenutzerGet((response) =>
		{
			if(response.success)
			{
				this.benutzer = response.benutzer;
				this.benutzer.userid = response.benutzer.userid;

				// Hauptdaten ausfüllen
				inputBenutzername.value = this.benutzer.username;
				inputVorname.value = this.benutzer.vorname;
				inputNachname.value = this.benutzer.nachname;
				inputDateGeburtsdatum.value = new Date(this.benutzer.geburtsdatum).toLocaleDateString('en-CA');
				inputGeburtsort.value = this.benutzer.geburtsort;

				// Führerscheindaten ausfüllen
				if(this.benutzer.istfahrer)
				{
					checkboxSwitchIstFahrer.checked = true;
					collapseFuehrerschein.classList.add("show");
					inputDateAusstellung.value = new Date(this.benutzer.fuehrerscheinausstellungsdatum).toLocaleDateString('en-CA');
					inputDateAblauf.value = new Date(this.benutzer.fuehrerscheinablaufdatum).toLocaleDateString('en-CA');
					inputFuehrerscheinnummer.value = this.benutzer.fuehrerscheinnummer;
				}

				// Daten für eigenes Zugfarhzeug ausfüllen
				if(this.benutzer.hatzugfahrzeug)
				{
					checkboxSwitchHatZugfahrzeug.checked = true;
					collapseZugfahrzeug.classList.add("show");
					inputMarke.value = this.benutzer.eigeneszugfahrzeugmarke;
					inputModell.value = this.benutzer.eigeneszugfahrzeugmodell;
					inputKennzeichen.value = this.benutzer.eigeneszugfahrzeugkennzeichen;
				}

				//  Profilbild anzeigen
				this.app.ApiBilderGetBenutzerList((response) =>
				{
					if(response != null && response.length > 0)
					{
						let bildliste = response;
						imgBild.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
					}
					// Führerscheinklassenlist anzeigen
					this.FSKListAnzeigen(this.benutzer.userid);
				}, (ex) => 
				{
					alert(ex);
				}, this.benutzer.userid);
			}
			else
			{
				alert(response.message);
			}
		}, (ex) => 
		{
			alert(ex);
		},  benutzerMerkmal);
	}

	// Führerscheinklassen anzeigen
	FSKListAnzeigen(benutzer_id) 
	{
		const tableFSKList = document.querySelector('#tableFSKList');
		const trFSKHeader = document.querySelector('#trFSKHeader');

		let html = '';

		if(typeof this.benutzer != "undefined")
		{
			this.app.ApiBenutzerGetFSKList((response) => 
			{
				if(response != null)
				{
					this.fuehrerscheinklassenlist = response;
					let iterator = 0;
					for (let fskitem of this.fuehrerscheinklassenlist) 
					{
						html += 
						`
						<tr data-fsk-idx="${iterator}">
							<th scope="row">
							</th><th>
							<td scope="col">${(fskitem ? fskitem : '&nbsp;')}</td>
						</tr>
						`;
						iterator++;
					}
					tableFSKList.innerHTML = html;
				}
			}, (ex) => 
			{
				alert(ex);
			}, benutzer_id);
		}
		else
		{
			html = 
			`
			<td>Erzeugen Sie bitte einen Benutzer um die Führerscheinklassen eintragen zu können!</td>
			`
			trFSKHeader.innerHTML = html;
		}		
	}	
}