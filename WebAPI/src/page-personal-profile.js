import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";

export default class PagePersonalProfile
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

            // Initialisierung
			var benutzerBild = {};

            if(benutzerMerkmal)
            {
                this.datenLaden(benutzerMerkmal);
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
			// speichern
			buttonBenutzerSpeichern.addEventListener('click', (e) => 
			{
				const inputRolle = appArgs.app.Main.querySelector('#inputRolle');
                const inputBenutzername = this.app.Main.querySelector('#inputBenutzername');
                const inputVorname = this.app.Main.querySelector('#inputVorname');
                const inputNachname = this.app.Main.querySelector('#inputNachname');
                const inputDateGeburtsdatum = this.app.Main.querySelector('#inputDateGeburtsdatum');
                const inputGeburtsort = this.app.Main.querySelector('#inputGeburtsort');
                const inputPasswortAendern = this.app.Main.querySelector('#inputPasswortAendern');
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
						location.hash = '#main';
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
				location.hash = '#main';
			});
		});
    }

    datenLaden(benutzerMerkmal)
    {
        this.app.ApiBenutzerGet((response) =>
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
        },  benutzerMerkmal);
    }
}