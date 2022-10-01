import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";
import Helper from "./helper.js";

export default class PageProfile
{
    constructor(appArgs)
    {
        this.app = appArgs.app;
        const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];

        appArgs.app.LoadHTML('./page-profile.html', appArgs.app.Main, () => 
		{
            const imgContainer = appArgs.app.Main.querySelector('#imgContainer');
            const imgBild = this.app.Main.querySelector('#imgBild');
            const buttonBenutzerSpeichern = this.app.Main.querySelector('#buttonBenutzerSpeichern');
            const buttonBenutzerAbbrechen = this.app.Main.querySelector('#buttonBenutzerAbbrechen');
			const buttonPasswortAendern = this.app.Main.querySelector('#buttonPasswortAendern');
			const buttonModalPasswortSpeichern = this.app.Main.querySelector('#buttonModalPasswortSpeichern');
			const dialogPasswort = new bootstrap.Modal(modalPasswortBody);
			const buttonFSKNeu = this.app.Main.querySelector('#buttonFSKNeu');
			const dialogFuehrerschein = new bootstrap.Modal(modalFSKBody);
			const buttonModalFSKSpeichern = this.app.Main.querySelector('#buttonModalFSKSpeichern');
			const selectStatus = this.app.Main.querySelector('#selectStatus');
			const inputDateAusstellung = this.app.Main.querySelector('#inputDateAusstellung');
			const inputDateAblauf = this.app.Main.querySelector('#inputDateAblauf');
			const inputFuehrerscheinnummer = this.app.Main.querySelector('#inputFuehrerscheinnummer');
			const collapseFuehrerschein = this.app.Main.querySelector('#collapseFuehrerschein');
			const checkboxSwitchHatZugfahrzeug = document.querySelector('#checkboxSwitchHatZugfahrzeug');
			const inputMietpreis = this.app.Main.querySelector('#inputMietpreis');
			const inputMarke = document.querySelector('#inputMarke');
			const inputModell = document.querySelector('#inputModell');
			const inputKennzeichen = document.querySelector('#inputKennzeichen');
			
			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			 
			// Hiding the ID for security
			history.replaceState({}, null, "./index.html#pageprofile");

            // Initialisierung
			var benutzerBild = {};

            if(appArgs.pid)
            {
                this.datenLaden(appArgs.pid);
            }
            else
            {
				this.benutzer = {};
                //alert('Benutzer existiert nicht!'); 
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
					}, benutzerMerkmal);
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
				}, appArgs.pid);

				dialogFuehrerschein.show();
			});

			// Button Modal Führerscheinklassen checkboxAll-click

			this.checkboxAll.addEventListener('click', ()=>
			{
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
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
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
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
					this.datenLaden(appArgs.pid);
				}, (ex) =>
				{
					alert(ex);
				},appArgs.pid ,selectedFSKList);
			
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
				const inputRolle = appArgs.app.Main.querySelector('#inputRolle');
                const inputBenutzername = this.app.Main.querySelector('#inputBenutzername');
                const inputVorname = this.app.Main.querySelector('#inputVorname');
                const inputNachname = this.app.Main.querySelector('#inputNachname');
                const inputDateGeburtsdatum = this.app.Main.querySelector('#inputDateGeburtsdatum');
                const inputGeburtsort = this.app.Main.querySelector('#inputGeburtsort');
                const divProfile = this.app.Main.querySelector('#divProfile');
				const checkboxSwitchIstFahrer = this.app.Main.querySelector('#checkboxSwitchIstFahrer');

				if (inputBenutzername.value && inputVorname.value && inputNachname.value) 
				{
					let saveOk = true;
					if(benutzerMerkmal)
					{
						if(typeof parseInt(inputRolle.value) === 'number')
						{
							this.benutzer.rolle = parseInt(inputRolle.value);
						}
						else
						{
							this.benutzer.rolle = new Helper().RolleConverter(parseInt(inputRolle.value));
						}
						
						this.benutzer.username = inputBenutzername.value;
						this.benutzer.vorname = inputVorname.value;
						this.benutzer.nachname = inputNachname.value;
						if(inputDateGeburtsdatum.value)
						{
							this.benutzer.geburtsdatum = inputDateGeburtsdatum.value;
						}
						this.benutzer.geburtsort = inputGeburtsort.value;

						if(inputMietpreis.value === NaN)
						{
							this.benutzer.mietpreis = 0;
						}
						else if(inputMietpreis.value == "")
						{
							this.benutzer.mietpreis = 0;
						}
						else
						{
							this.benutzer.mietpreis = parseInt(inputMietpreis.value);
						}
						
						if(checkboxSwitchIstFahrer.checked)
						{
							this.benutzer.istfahrer = true;

							if (selectStatus.value == '0') 
							{
								saveOk = false;
								selectStatus.classList.add('is-invalid');
								selectStatus.classList.remove('is-valid')
							}
							else 
							{
								selectStatus.classList.add('is-valid');
								selectStatus.classList.remove('is-invalid')
							}

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
								this.benutzer.status = parseInt(selectStatus.value);
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
						 
						if(saveOk)
						{
							this.app.ApiBenutzerSet((response) => 
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
						
						switch (this.benutzer.rolle)
						{
							case 0: location.hash = '#clientlist';
									break;
							case 1: location.hash = '#stafflist';
									break;
							case 2: location.hash = '#stafflist';
									break;
							default: location.hash = '#clientlist';
									break;
						}
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
				switch (this.benutzer.rolle)
				{
					case 0: location.hash = '#clientlist';
							break;
					case 1: location.hash = '#stafflist';
							break;
					case 2: location.hash = '#stafflist';
							break;
					default: location.hash = '#clientlist';
							break;
				}
			});
		});
    }

    datenLaden(benutzer_id)
    {
        this.app.ApiBenutzerGetById((response) =>
        {
            if(response.success)
            {
                this.benutzer = response.benutzer;

                inputRolle.value = new Helper().RolleConverter(this.benutzer.rolle);
                inputBenutzername.value = this.benutzer.username;
                inputVorname.value = this.benutzer.vorname;
                inputNachname.value = this.benutzer.nachname;
                inputDateGeburtsdatum.value = new Date(this.benutzer.geburtsdatum).toLocaleDateString('en-CA');
                inputGeburtsort.value = this.benutzer.geburtsort;
				inputMietpreis.value = this.benutzer.mietpreis;

				if(this.benutzer.istfahrer)
				{
					checkboxSwitchIstFahrer.checked = true;
					collapseFuehrerschein.classList.add("show");
					selectStatus.value = this.benutzer.status;
					inputDateAusstellung.value = new Date(this.benutzer.fuehrerscheinausstellungsdatum).toLocaleDateString('en-CA');
					inputDateAblauf.value = new Date(this.benutzer.fuehrerscheinablaufdatum).toLocaleDateString('en-CA');
					inputFuehrerscheinnummer.value = this.benutzer.fuehrerscheinnummer;
				}

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
                    // Führerscheinklassen anzeigen
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
        },  benutzer_id);
    }

	// Führerscheinklassen anzeigen
	FSKListAnzeigen(benutzer_id) 
	{
		const tableFSKList = this.app.Main.querySelector('#tableFSKList');
		const trFSKHeader = this.app.Main.querySelector('#trFSKHeader');

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