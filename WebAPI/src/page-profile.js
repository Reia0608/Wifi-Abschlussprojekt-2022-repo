import "./app.js";

export default class PageProfile
{
    constructor(appArgs)
    {
        this.app = appArgs.app;
        const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];

        appArgs.app.LoadHTML('./page-profile.html', appArgs.app.Main, () => 
		{
            const labelRolle = document.getElementById('labelRolle');
            const labelBenutzername = document.getElementById('labelBenutzername');
            const labelVorname = document.getElementById('labelVorname');
            const labelNachname = document.getElementById('labelNachname');
            const labelGeburtsdatum = document.getElementById('labelGeburtsdatum');
            const labelGeburtsort = document.getElementById('labelGeburtsort');
            const labelPasswortAendern = document.getElementById('labelPasswortAendern');
            const divProfile = document.getElementById('divProfile');

            if(benutzerMerkmal)
            {
                this.app.ApiBenutzerGet((response) =>
                {
                    if(response.success)
                    {
                        labelRolle.Value = response.benutzer.rolle;
                        labelBenutzername.Value = response.benutzer.username;
                        labelVorname.Value = response.benutzer.vorname;
                        labelNachname.Value = response.benutzer.nachname;
                        labelGeburtsdatum.Value = response.benutzer.geburtsdatum;
                        labelGeburtsort.Value = response.benutzer.geburtsort;
                        labelPasswortAendern.Value = response.benutzer.passwort;

                        let html = 
                        `<div class="input-group mb-3">
                            <span class="input-group-text" >Rolle</span>
                            <label type="text" id="labelRolle">${labelRolle.Value}</label>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" >Benutzername</span>
                            <label type="text" id="labelBenutzername">${labelBenutzername.Value}</label>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" >Vorname</span>
                            <label type="text" id="labelVorname">${labelVorname.Value}</label>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" >Nachname</span>
                            <label type="text" id="labelNachname">${labelNachname.Value}</label>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" >Geburtsdatum</span>
                            <label type="text" id="labelGeburtsdatum">${labelGeburtsdatum.Value}</label>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" >Geburtsort</span>
                            <label type="text" id="labelGeburtsort">${labelGeburtsort.Value}</label>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" >Passwort ändern</span>
                            <label type="password" id="labelPasswortAendern">${labelPasswortAendern.Value}</label>
                        </div>`;
                        
                        divProfile.innerHTML = html;

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
            else
            {
                alert('Kein Benutzer angemeldet!');
            }
            
		});
    }
}