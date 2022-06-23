import "./app.js";

export default class PageProfile
{
    constructor(appArgs)
    {
        this.app = appArgs.app;
        const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];

        appArgs.app.LoadHTML('./page-profile.html', appArgs.app.Main, () => 
		{
            const inputRolle = document.getElementById('inputRolle');
            const inputBenutzername = document.getElementById('inputBenutzername');
            const inputVorname = document.getElementById('inputVorname');
            const inputNachname = document.getElementById('inputNachname');
            const inputGeburtsdatum = document.getElementById('inputGeburtsdatum');
            const inputGeburtsort = document.getElementById('inputGeburtsort');
            const inputPasswortAendern = document.getElementById('inputPasswortAendern');
            const divProfile = document.getElementById('divProfile');

            if(benutzerMerkmal)
            {
                this.app.ApiBenutzerGet((response) =>
                {
                    if(response.success)
                    {
                        this.benutzer = response.benutzer;

                        inputRolle.Value = this.benutzer.rolle;
                        inputBenutzername.Value = this.benutzer.username;
                        inputVorname.Value = this.benutzer.vorname;
                        inputNachname.Value = this.benutzer.nachname;
                        inputGeburtsdatum.Value = this.benutzer.geburtsdatum;
                        inputGeburtsort.Value = this.benutzer.geburtsort;
                        inputPasswortAendern.Value = this.benutzer.passwort;

                        // let html = 
                        // `
                        //     <div class="row">
                        //         <div class="col-4 text-end">Rolle</div>
                        //         <div class="col-6"><input type="text" class="form-control form-control-sm" id="inputRolle" />${inputRolle.Value}</div>
                        //     </div>
                        //     <div class="row mt-3">
                        //         <div class="col-4 text-end">Benutzername</div>
                        //         <div class="col-6"><input type="text" class="form-control form-control-sm" id="inputBenutzername" />${inputBenutzername.Value}</div>
                        //     </div>
                        //     <div class="row mt-3">
                        //         <div class="col-4 text-end">Vorname</div>
                        //         <div class="col-8"><input type="text" class="form-control form-control-sm" id="inputVorname" />${inputVorname.Value}</div>
                        //     </div>
                        //     <div class="row mt-3">
                        //         <div class="col-4 text-end">Nachname</div>
                        //         <div class="col-8"><input type="text" class="form-control form-control-sm" id="inputNachname" />${inputNachname.Value}</div>
                        //     </div>
                        //     <div class="row mt-3">
                        //         <div class="col-4 text-end">Geburtsdatum</div>
                        //         <div class="col-8"><input type="text" class="form-control form-control-sm" id="inputGeburtsdatum" />${inputGeburtsdatum.Value}</div>
                        //     </div>
                        //     <div class="row mt-3">
                        //         <div class="col-4 text-end">Geburtsort</div>
                        //         <div class="col-8"><input type="text" class="form-control form-control-sm" id="inputGeburtsort" />${inputGeburtsort.Value}</div>
                        //     </div>
                        //     <div class="row mt-3">
                        //         <div class="col-4 text-end">Passwort ändern</div>
                        //         <div class="col-8"><input type="text" class="form-control form-control-sm" id="inputPasswortAendern" />${inputPasswortAendern.Value}</div>
                        //     </div>
                        // `;
                        
                        // divProfile.innerHTML = html;

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