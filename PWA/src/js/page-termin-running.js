import Helper from "./helper.js";

export default class PageTerminRunning
{
	constructor(args) 
	{
		this.app = args.app;

		args.app.Body.style.paddingBottom = '60px';
		args.app.LoadHTML('./page-termin-running.html', args.app.Main, () => 
	    {
			const divKraftfahrzeugJahre = this.app.Main.querySelector('#divKraftfahrzeugJahre');
            const divTermin = document.querySelector('#divTermin');
            const divOrt = document.querySelector('#divOrt');
            const divBeschreibung = document.querySelector('#divBeschreibung');
            const divGesamtpreis = document.querySelector('#divGesamtpreis');
            const divAuftragsende = document.querySelector('#divAuftragsende');
            const divAbstellort = document.querySelector('#divAbstellort');
            const tableSchadenList = document.querySelector('#tableSchadenList');
            const inputKmEnde = document.querySelector('#inputKmEnde');
            const buttonTerminAbschliessen = document.querySelector('#buttonTerminAbschliessen');

            // Hiding the ID for security
            history.replaceState({}, null, "./index.html#terminrunning");

			// Initialisierung
			var kfzbild = {};

			if(args.bid)
			{
				let bewegung_id = parseInt(args.bid);
				this.datenLaden(bewegung_id);
			}

            // Event Listeners
            buttonTerminAbschliessen.addEventListener('click', () =>
            {
                if(inputKmEnde.value)
                {
                    if(confirm('Wollen Sie den Termin abschliessen?'))
                    {
                        if(args.bid)
                        {
                            this.app.ApiRentObjectGet((response) =>
                            {
                                if(response)
                                {
                                    let preisSchaden = 0;
                                    this.Helper = new Helper();
                                    this.rentObject = this.Helper.CreateRentObject();
    
                                    // Preparing rentObject
                                    this.rentObject.bewegung_id = response.bewegung_id;
                                    this.rentObject.users_id = response.users_id;
                                    this.rentObject.beschreibung = response.beschreibung;
                                    this.rentObject.grund = response.grund;
                                    this.rentObject.abholort = response.abholort;
                                    this.rentObject.rueckgabeort = response.rueckgabeort;
                                    this.rentObject.abholdatum = response.abholdatum;
                                    this.rentObject.abholzeit = response.abholzeit;
                                    this.rentObject.rueckgabedatum = response.rueckgabedatum;
                                    this.rentObject.rueckgabezeit = response.rueckgabezeit;
                                    this.rentObject.gleicherRueckgabeort = response.gleicherRueckgabeort;
                                    this.rentObject.schutzpaket = response.schutzpaket;
                                    this.rentObject.braucht_fahrer = response.braucht_fahrer;
                                    this.rentObject.fahrer_id = response.fahrer_id;
                                    this.rentObject.preis_gesamt = this.Helper.KmPriceCalculator(response.preis_kfz, response.preis_schutzpaket, response.preis_anhaenger, response.preis_fahrer, preisSchaden, response.start_km_stand, inputKmEnde.value);
                                    this.rentObject.preis_kfz = response.preis_kfz;
                                    this.rentObject.preis_anhaenger = response.preis_anhaenger;
                                    this.rentObject.preis_fahrer = response.preis_fahrer;
                                    this.rentObject.preis_schutzpaket = response.preis_schutzpaket;
                                    this.rentObject.allow_reload = response.allow_reload // variable to check if the aAendernButton on page-rent-step-three.js is active or not, so the data can be loaded anew
                                    this.rentObject.transaction_finished = response.transaction_finished;
                                    this.rentObject.bewegung_finished = response.bewegung_finished;
                                    this.rentObject.kraftfahrzeug_id = response.kraftfahrzeug_id;
                                    this.rentObject.anhaenger_id = response.anhaenger_id;
                                    this.rentObject.times_rented = response.times_rented;
                                    this.rentObject.kfz_bezeichnung = response.kfz_bezeichnung;
                                    this.rentObject.anhaenger_bezeichnung = response.anhaenger_bezeichnung;
                                    this.rentObject.tage_gemietet = response.tage_gemietet;
                                    this.rentObject.start_km_stand = response.start_km_stand;
                                    this.rentObject.zeit_start = response.zeit_start;
                                    this.rentObject.ende_km_stand = inputKmEnde.value;
                                    this.rentObject.zeit_ende = new Date().toISOString();
                                    
                                    // Updating the database
                                    this.app.ApiRentObjectSet(() =>
                                    {
                                        console.log("database updated!");
                                        window.open('#termindone?bid=' + this.rentObject.bewegung_id, '_self');
                                    }, (ex) =>
                                    {
                                        alert(ex);
                                    }, this.rentObject);
                                }
                            }, (ex) =>
                            {
                                alert(ex);
                            }, args.bid);
                        }
                    } 
                }
                else
                {
                    alert("Bitte zunächst den Abschlusskilometerstand ausfüllen!");
                }
            });
		}); // LoadHTML
	} // constructor

	//----------------------------------------------------------------------------------------
	// Anzeige

    datenLaden(bewegung_id) 
	{
        // Initialisierung
        const divLetzterKm = document.querySelector('#divLetzterKm');
        const divKmStart = document.querySelector('#divKmStart');

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
			divAuftragsende.innerHTML = dateFormatter.format(new Date(this.bewegung.rueckgabedatum)) + ' ' + this.bewegung.rueckgabezeit + ' Uhr';
			divAbstellort.innerHTML = this.bewegung.rueckgabeort;
            divKmStart.innerHTML = this.bewegung.start_km_stand;

            this.app.ApiKraftfahrzeugGet((response) =>
            {
                divLetzterKm.innerHTML = response.km_stand;

                // Schadenliste anzeigen
                this.schadenListAnzeigen();
            }, (ex) =>
            {
                alert(ex);
            }, this.bewegung.kraftfahrzeug_id);                            
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
        }, (ex) => 
        {
            alert(ex);
        }, this.bewegung.kraftfahrzeug_id);	
    }
}