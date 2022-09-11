import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import Helper from "./helper.js";

export default class PageCarDetails 
{
	constructor(args) 
	{
		this.app = args.app;

		args.app.Body.style.paddingBottom = '60px';
		args.app.LoadHTML('./page-car-details.html', args.app.Main, () => 
		{
            const imgContainer = document.querySelector('#imgContainer');
            const buttonKfzMieten = document.querySelector('#buttonKfzMieten');
            const buttonKfzZurueck = document.querySelector('#buttonKfzZurueck');
            const modalSchadenBody = document.querySelector('#modalSchadenBody');
            const buttonModalSchadenSpeichern = document.querySelector('#buttonModalSchadenSpeichern');	
            const imgBild = document.querySelector('#imgBild');
            const spanKraftfahrzeugJahre = document.querySelector('#spanKraftfahrzeugJahre');

            // Initialisierung
            var kfzbild = {};

            var kid = localStorage.getItem("kid");
            
            if(kid)
            {
                let kraftfahrzeug_id = parseInt(kid);
                this.datenLaden(kraftfahrzeug_id);
            }
            else
            {
                this.schadenListAnzeigen(); 
            }

            //-------------------------------------------------------------
            // KfZ Mieten

            buttonKfzMieten.addEventListener('click', (e) => 
            {
                const inputMarke = document.querySelector('#inputMarke');
                const inputModell = document.querySelector('#inputModell');
                const inputKennzeichen = document.querySelector('#inputKennzeichen');
                const inputMietpreis = document.querySelector('#inputMietpreis');
                const inputBaujahr = document.querySelector('#inputBaujahr');
                const inputKlasse = document.querySelector('#inputKlasse');
                const inputKategorie = document.querySelector('#inputKategorie');

                location.hash = '#rentstepone';
            });

            //-------------------------------------------------------------
            // Vorgang abbrechen

            buttonKfzZurueck.addEventListener('click', (e) =>
            {
                location.hash = '#cars';
            });

            //------------------------------------------------------------------------------------------
            // alles rund um den Schaden
        });
    }
            
    //----------------------------------------------------------------------------------------
    // Anzeige

    datenLaden(kraftfahrzeug_id) 
    {
        this.app.ApiKraftfahrzeugGet((response) => 
        {
            let currentYear = new Date().getFullYear();
            this.kraftfahrzeug = response;

            //const bildliste = response.bildliste;

            inputMarke.value = this.kraftfahrzeug.marke;
            inputModell.value = this.kraftfahrzeug.modell;
            inputKennzeichen.value = this.kraftfahrzeug.kennzeichen;
            inputMietpreis.value = this.kraftfahrzeug.mietpreis + "/Tag";
            inputBaujahr.value = this.kraftfahrzeug.baujahr;
            spanKraftfahrzeugJahre.textContent = (currentYear - inputBaujahr.value).toString();
            if(this.kraftfahrzeug.klasse == null)
            {
                inputKlasse.value = 'unbekannt';
            }
            else
            {
                inputKlasse.value = this.kraftfahrzeug.klasse;
            }
            
            if(this.kraftfahrzeug.kategorie == null)
            {
                inputKategorie.value = 'unbekannt';
            }
            else
            {
                inputKategorie.value = this.kraftfahrzeug.kategorie;
            }
            
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
        }, kraftfahrzeug_id);
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

        if(typeof this.kraftfahrzeug != "undefined")
        {
            this.app.ApiSchadenGetKfzList((response) => 
            {
                this.kraftfahrzeug.schadenlist = response;
                let iterator = 1;
                for (let schadenitem of this.kraftfahrzeug.schadenlist) 
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
}