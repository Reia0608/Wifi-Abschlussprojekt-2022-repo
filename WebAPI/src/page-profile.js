import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";

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
			
			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			 

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
			// Button-Führerscheinklassen-Neu-click

			buttonFSKNeu.addEventListener( 'click', (e) => 
			{
				dialogFuehrerschein.show();
			});

			// Button checkboxAll-click

			this.checkboxAll.addEventListener('click', ()=>
			{
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				let selected = this.checkboxAll.checked;
				for(let checkbox of checkboxCollection) 
				{    
					checkbox.checked = selected; 
				}
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

				this.app.ApiBenutzerDelete(() =>
				{
					this.datenLaden();
				}, (ex) =>
				{
					alert(ex);
				}, FSKList);
			
				dialogFuehrerschein.hide();
			});

			//---------------------------
			// buttonModalFSKSpeichern.addEventListener('click', (e) => 
			// {
			// 	let saveOk = true;
			// 	// labelAltesPasswort.classList.remove('is-invalid', 'is-valid');
			// 	// labelNeuesPasswort1.classList.remove('is-invalid', 'is-valid');
			// 	// labelNeuesPasswort2.classList.remove('is-invalid', 'is-valid');

			// 	if (!labelAltesPasswort.value) 
			// 		{
			// 			saveOk = false;
			// 			labelAltesPasswort.classList.add('is-invalid');
			// 		}
			// 		else
			// 		{
			// 			labelAltesPasswort.classList.add('is-valid');
			// 		} 

			// 		if(!labelNeuesPasswort1.value || labelAltesPasswort.value == labelNeuesPasswort1.value)
			// 		{
			// 			saveOk = false;
			// 			labelNeuesPasswort1.classList.add('is-invalid');
			// 		}
			// 		else
			// 		{
			// 			labelNeuesPasswort1.classList.add('is-valid');
			// 		} 

			// 		if (labelNeuesPasswort1.value != labelNeuesPasswort2.value) 
			// 		{
			// 			saveOk = false;
			// 			labelNeuesPasswort2.classList.add('is-invalid');
			// 		}
			// 		else
			// 		{
			// 			labelNeuesPasswort2.classList.add('is-valid');
			// 		} 

			// 		this.app.ApiBenutzerCheck((response) => 
			// 		{
			// 			if(response.success == false)
			// 			{
			// 				saveOk = false;
			// 				alert("falsches Passwort!");
			// 			}
			// 			else
			// 			{
			// 				if (saveOk) 
			// 				{
			// 					this.benutzer.passwort = labelNeuesPasswort1.value;

			// 					// Update the database.
			// 					this.app.ApiBenutzerSet(() => 
			// 					{
			// 						console.log("database was updated!");
			// 					}, (ex) => 
			// 					{
			// 						alert(ex);
			// 					}, this.benutzer);

			// 					dialogPasswort.hide();
			// 				}
			// 			}
			// 		}, (ex) => 
			// 		{
			// 			alert(ex);
			// 		}, benutzerMerkmal);
			// });

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

				if (inputBenutzername.value && inputVorname.value && inputNachname.value) 
				{
					if(benutzerMerkmal)
					{
						this.benutzer.rolle = parseInt(inputRolle.value);
						this.benutzer.username = inputBenutzername.value;
						this.benutzer.vorname = inputVorname.value;
						this.benutzer.nachname = inputNachname.value;
						if(inputDateGeburtsdatum.value)
						{
							this.benutzer.geburtsdatum = inputDateGeburtsdatum.value;
						}
						this.benutzer.geburtsort = inputGeburtsort.value;
						

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

                inputRolle.value = this.benutzer.rolle;
                inputBenutzername.value = this.benutzer.username;
                inputVorname.value = this.benutzer.vorname;
                inputNachname.value = this.benutzer.nachname;
                inputDateGeburtsdatum.value = new Date(this.benutzer.geburtsdatum).toLocaleDateString('en-CA');
                inputGeburtsort.value = this.benutzer.geburtsort;

                //  Profilbild anzeigen
                this.app.ApiBilderGetBenutzerList((response) =>
                {
                    if(response != null && response.length > 0)
                    {
                        let bildliste = response;
                        imgBild.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
                    }
                    // List Anzeigen API call goes here
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
	FSKListAnzeigen() 
	{
		const tableFSKList = this.app.Main.querySelector('#tableFSKList');
		const trFSKHeader = this.app.Main.querySelector('#trFSKHeader');

		let html = '';

		if(typeof this.kraftfahrzeug != "undefined")
		{
			this.app.ApiFSKGetKfzList((response) => 
			{
				this.kraftfahrzeug.fuehrerscheinklassenlist = response;
				let iterator = 0;
				for (let fskitem of this.kraftfahrzeug.fuehrerscheinklassenlist) 
				{
					html += 
					`
					<tr data-schaden-idx="${iterator}">
						<th scope="row">
							<button type="button" class="btn btn-sm" id="buttonFSKDel_${fskitem}"><span class="iconify" data-icon="mdi-delete"></span></button>
						</th>
						<td scope="col">${(fskitem ? fskitem : '&nbsp;')}</td>
					</tr>
					`;
					iterator++;
				}
				tableFSKList.innerHTML = html;
			}, (ex) => 
			{
				alert(ex);
			}, this.kraftfahrzeug.kraftfahrzeug_id);
		}
		else
		{
			html = 
			`
			<td>Erzeugen Sie bitte einen Benutzer um die FSK eintragen zu können!</td>
			`
			trFSKHeader.innerHTML = html;
		}		
	}
}