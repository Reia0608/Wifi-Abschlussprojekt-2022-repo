import Helper from "./helper.js";

export default class PageTransactionDetails 
{
	constructor(args) 
	{
		this.app = args.app;

		args.app.Body.style.paddingBottom = '60px';
		args.app.LoadHTML('./page-transaction-details.html', args.app.Main, () => 
		{
			const imgContainer = args.app.Main.querySelector('#imgContainer');
			const imgBild = this.app.Main.querySelector('#imgBild');
			const divKraftfahrzeugJahre = this.app.Main.querySelector('#divKraftfahrzeugJahre');
            const divTermin = document.querySelector('#divTermin');
            const divOrt = document.querySelector('#divOrt');
            const divBeschreibung = document.querySelector('#divBeschreibung');
            const divGesamtpreis = document.querySelector('#divGesamtpreis');
            const divAuftragsende = document.querySelector('#divAuftragsende');
            const divAbstellort = document.querySelector('#divAbstellort');
            const divVorname = document.querySelector('#divVorname');
            const divNachname = document.querySelector('#divNachname');
            const divMarkeKraftfahrzeug = document.querySelector('#divMarkeKraftfahrzeug');
            const divModellKraftfahrzeug = document.querySelector('#divModellKraftfahrzeug');
            const divKennzeichenKraftfahrzeug = document.querySelector('#divKennzeichenKraftfahrzeug');
            const divMietpreisKraftfahrzeug = document.querySelector('#divMietpreisKraftfahrzeug');
            const divKlasseKraftfahrzeug = document.querySelector('#divKlasseKraftfahrzeug');
            const divKategorieKraftfahrzeug = document.querySelector('#divKategorieKraftfahrzeug');
            const divMarkeAnhaenger = document.querySelector('#divMarkeAnhaenger');
            const divModellAnhaenger = document.querySelector('#divModellAnhaenger');
            const divKennzeichenAnhaenger = document.querySelector('#divKennzeichenAnhaenger');
            const divMietpreisAnhaenger = document.querySelector('#divMietpreisAnhaenger');
            const divKlasseAnhaenger = document.querySelector('#divKlasseAnhaenger');
            const divKategorieAnhaenger = document.querySelector('#divKategorieAnhaenger');
            const imgKunde = document.querySelector('#imgKunde');
            const imgKraftfahrzeug = document.querySelector('#imgKraftfahrzeug');
            const imgAnhaenger = document.querySelector('#imgAnhaenger');
            const tableSchadenList = document.querySelector('#tableSchadenList');
            const divKraftfahrzeug = document.querySelector('#divKraftfahrzeug');
            const divAnhaenger = document.querySelector('#divAnhaenger');
            const buttonTerminStart = document.querySelector('#buttonTerminStart');

			// Initialisierung
			var kfzbild = {};

			if(args.bid)
			{
				let bewegung_id = parseInt(args.bid);
				this.datenLaden(bewegung_id);
			}

            // Event Listeners
            buttonTerminStart.addEventListener('click', () =>
            {
                if(args.bid)
                {
                    let bewegung_id = parseInt(args.bid);
                    window.open('#terminstart?bid=' + bewegung_id, '_self');
                }
                
            });
		}); // LoadHTML
	} // constructor

	//----------------------------------------------------------------------------------------
	// Anzeige

    datenLaden(bewegung_id) 
	{
		this.app.ApiRentObjectGet((response) => 
		{
            const dateFormatter = new Intl.DateTimeFormat('de-AT', 
            {
                dateStyle: 'short'
            });

			this.bewegung = response;

            // Auftragsdaten auffüllen
			divTermin.innerHTML = dateFormatter.format(new Date(this.bewegung.abholdatum)) + ' ' + this.bewegung.abholzeit + ' Uhr';
			divOrt.innerHTML = this.bewegung.abholort;
			divBeschreibung.innerHTML = this.bewegung.beschreibung;
			divGesamtpreis.innerHTML = this.bewegung.preis_gesamt;
			divAuftragsende.innerHTML = dateFormatter.format(new Date(this.bewegung.rueckgabedatum)) + ' ' + this.bewegung.rueckgabezeit + ' Uhr';
			divAbstellort.innerHTML = this.bewegung.rueckgabeort;

            this.app.ApiBenutzerGetById((response) => 
            {
                divVorname.innerHTML = response.benutzer.vorname;
                divNachname.innerHTML = response.benutzer.nachname;
                
                // Kunden Bild anzeigen
                this.app.ApiBilderGetBenutzerList((response) =>
                {
                    if(response != null && response.length > 0)
                    {
                        let bildliste = response;
                        imgKunde.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
                    }
                    
                    // Kraftfahrzeug Daten anzeigen
                    if(this.bewegung.kraftfahrzeug_id != null)
                    {
                        this.app.ApiKraftfahrzeugGet((response) =>
                        {
                            divMarkeKraftfahrzeug.innerHTML = response.marke;
                            divModellKraftfahrzeug.innerHTML = response.modell;
                            divKennzeichenKraftfahrzeug.innerHTML = response.kennzeichen;
                            divMietpreisKraftfahrzeug.innerHTML = response.mietpreis;
                            divKlasseKraftfahrzeug.innerHTML = response.klasse;
                            divKategorieKraftfahrzeug.innerHTML = response.kategorie;

                            // Kraftfahrzeug Bild laden
                            this.app.ApiBilderGetKfzList((response) =>
                            {
                                if(response != null && response.length > 0)
                                {
                                    let bildliste = response;
                                    imgKraftfahrzeug.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
                                }

                                // Schadenliste anzeigen
                                this.schadenListAnzeigen();
                            }, (ex) => 
                            {
                                alert(ex);
                            }, this.bewegung.kraftfahrzeug_id);
                        }, (ex) => 
                        {
                            alert(ex);
                        }, this.bewegung.kraftfahrzeug_id);
                    }
                    else
                    {
                        divKraftfahrzeug.innerHTML = `<h3>KundIn hatte kein Kraftfahrzeug bestellt.</h3>`;

                        // continue with anhaenger daten here
                        this.anhaengerLaden();
                    }
                }, (ex) => 
                {
                    alert(ex);
                }, this.bewegung.users_id);
            }, (ex) => 
            {
                alert(ex);
            }, this.bewegung.users_id);
		}, (ex) => 
		{
			alert(ex);
		}, bewegung_id);
	}

    // schaden anzeigen
    schadenListAnzeigen() 
    {
        const tableSchadenList = document.querySelector('#tableSchadenList');
        const trSchadenHeader = document.querySelector('#trSchadenHeader');
        const dateFormatter = new Intl.DateTimeFormat('de-AT', 
        {
            dateStyle: 'medium'
        });
        let html = '';

        this.app.ApiSchadenGetKfzList((response) => 
        {
            let iterator = 1;
            for (let schadenitem of response) 
            {
                html += 
                `
                <tr data-schaden-idx="${iterator}">
                    <th scope="row">
                        ${iterator}
                    </th>
                    <td scope="col">${(schadenitem.schaden_datum ? dateFormatter.format(new Date(schadenitem.schaden_datum)) : '&nbsp;')}</td>
                    <td scope="col">${(schadenitem.schadensart ? schadenitem.schadensart : '&nbsp;')}</td>
                    <td scope="col">${(schadenitem.beschreibung? schadenitem.beschreibung : '&nbsp;')}</td>
                </tr>
                `;
                iterator++;
            }
            tableSchadenList.innerHTML = html;

            // Anhaenger daten laden
            this.anhaengerLaden();
        }, (ex) => 
        {
            alert(ex);
        }, this.bewegung.kraftfahrzeug_id);	
    }

    anhaengerLaden()
    {
        if(this.bewegung.anhaenger_id != null)
        {
            this.app.ApiAnhaengerGet((response) => 
            {
                divMarkeAnhaenger.innerHTML = response.marke;
                divModellAnhaenger.innerHTML = response.modell;
                divKennzeichenAnhaenger.innerHTML = response.kennzeichen;
                divMietpreisAnhaenger.innerHTML = response.mietpreis;
                divKategorieAnhaenger.innerHTML = response.kategorie;
                
                // Kfz Bild anzeigen
                this.app.ApiBilderGetAnhaenger((response) =>
                {
                    if(response != null && response.length > 0)
                    {
                        let bildliste = response;
                        imgAnhaenger.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
                    }
                }, (ex) => 
                {
                    alert(ex);
                }, this.bewegung.anhaenger_id);
            }, (ex) => 
            {
                alert(ex);
            }, this.bewegung.anhaenger_id);
        }
        else
        {
            divAnhaenger.innerHTML = `<h3>KundIn hatte keinen Anhänger bestellt.</h3>`;
        }
    }
}