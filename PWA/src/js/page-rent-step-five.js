import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";


export default class PageRentStepFive
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-five.html', appArgs.app.Main, () => 
		{
            // Initialisierung

            const inputButtonZurueck1 = document.querySelector('#inputButtonZurueck1');
            const inputButtonZurueck2 = document.querySelector('#inputButtonZurueck2');
            const inputButtonMieten1 = document.querySelector('#inputButtonMieten1');
            const inputButtonMieten2 = document.querySelector('#inputButtonMieten2');

            const labelAbholort = document.querySelector('#labelAbholort');
            const labelRueckgabeort = document.querySelector('#labelRueckgabeort');
            const labelAbholdatum = document.querySelector('#labelAbholdatum');
            const labelAbholzeit = document.querySelector('#labelAbholzeit');
            const labelSchutzpaket = document.querySelector('#labelSchutzpaket');
            const labelRueckgabedatum = document.querySelector('#labelRueckgabedatum');
            const labelRueckgabezeit = document.querySelector('#labelRueckgabezeit');
            const labelAnhaenger = document.querySelector('#labelAnhaenger');
            const labelGesamtpreis = document.querySelector('#labelGesamtpreis');

            const divRowFahrzeug = document.querySelector('#divRowFahrzeug');
            const divRowAnhaenger = document.querySelector('#divRowAnhaenger');
            const divRowFahrer = document.querySelector('#divRowFahrer');

            this.loadData();

            // Event Listeners

            inputButtonZurueck1.addEventListener('click', ()=>
            {
                location.hash = '#rentstepfour';
            });

            inputButtonZurueck2.addEventListener('click', ()=>
            {
                location.hash = '#rentstepfour';
            });

            inputButtonMieten1.addEventListener('click', ()=>
            {
                this.finalizeOrder();
                location.hash = '#rentdone';
            });

            inputButtonMieten2.addEventListener('click', ()=>
            {
                this.finalizeOrder();
                location.hash = '#rentdone';
            });
        });
    }

    loadData()
    {
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
        labelAbholort.innerText = this.rentObject.abholort;
        labelRueckgabeort.innerText = this.rentObject.rueckgabeort;
        // WIP: Date needs to be changed to austrian norm
        labelAbholdatum.innerText = this.rentObject.abholdatum.split("-").reverse().join("-");
        labelAbholzeit.innerText = this.rentObject.abholzeit;
        // WIP: Date needs to be changed to austrian norm
        labelRueckgabedatum.innerText = this.rentObject.rueckgabedatum.split("-").reverse().join("-");;
        labelRueckgabezeit.innerText = this.rentObject.rueckgabezeit;
        labelSchutzpaket.innerText = this.rentObject.schutzpaket;
        // WIP: payment method goes here
        labelGesamtpreis.innerText = this.rentObject.preis_gesamt.toString() + ",- €";

        // loading Kraftfahrzeug info into a card
        this.loadKfz();
    }

    loadKfz()
    {
        var kid = localStorage.getItem("kid");
        this.app.ApiKraftfahrzeugGetCard((response) => 
        {
            let html = '';
            let currentYear = new Date().getFullYear();
            let kraftfahrzeug = response;

            html += 
            `<div class="card cards mt-3" style="width: 18rem;">
                <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}" id="imgBildFahrzeug">
                <div class="card-body" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}">
                    <h5 class="card-title">${kraftfahrzeug.marke} ${kraftfahrzeug.modell}</h5>
                    <p class="card-text">
                        Alter: ${currentYear - kraftfahrzeug.baujahr} Jahre<br>
                        Klasse: ${kraftfahrzeug.klasse}<br>
                        Kategorie: ${kraftfahrzeug.kategorie}<br>
                        Mietpreis: €${kraftfahrzeug.mietpreis},-/ Tag<br>
                    </p>
                    <a class="btn btn-primary" id="aEinzelheitenKraftfahrzeug">Einzelheiten</a>
                </div>
            </div>
            `;

            divRowFahrzeug.innerHTML = html;

            this.app.ApiBilderGetKraftfahrzeug((response) =>
            {
                let kfzBild = response;
                if(kfzBild != null)
                {
                    let imgBild = document.getElementById("imgBildFahrzeug");
                    imgBild.src = "data:image/jpeg;base64," + kfzBild.bild_bytes;

                    // loading Anhaenger info into a card
                    if(this.rentObject.anhaenger_id != 0 && this.rentObject.anhaenger_id != null)
                    {
                        this.loadAnhaenger();
                    }
                    else
                    {
                        divRowAnhaenger.innerHTML = "Keinen Anhänger gewählt.";
                        this.loadFahrer();
                    }
                }
            }, (ex) => 
            {
                alert(ex);
            }, kid);
        }, (ex) => 
        {
            alert(ex);
        }, kid);
    }

    loadAnhaenger()
    {
        this.app.ApiAnhaengerGetCard((response) => 
        {
            let html = '';
            let anhaenger = response;

            html += 
            `<div class="card cards mt-3" style="width: 18rem;">
                <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-anhaenger-id="${anhaenger.anhaenger_id}" id="imgBildAnhaenger">
                <div class="card-body" data-anhaenger-id="${anhaenger.anhaenger_id}">
                    <h5 class="card-title">${anhaenger.marke} ${anhaenger.modell}</h5>
                    <p class="card-text">
                        Kategorie: ${anhaenger.kategorie}<br>
                        Mietpreis: €${anhaenger.mietpreis},- / Tag<br>
                    </p>
                    <a class="btn btn-primary" id="aEinzelheitenAnhaenger">Einzelheiten</a>
                </div>
            </div>
            `;

            divRowAnhaenger.innerHTML = html;

            // Anhänger Bild anzeigen
            this.app.ApiBilderGetAnhaenger((response) =>
            {
                if(response != null && response.length > 0)
                {
                    let bildliste = response;
                    let imgBild = document.getElementById("imgBildAnhaenger");
                    imgBild.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;

                    // load Fahrer info into a card
                    if(this.rentObject.fahrer_id != null)
                    {
                        this.loadFahrer();
                    }
                    else
                    {
                        divRowFahrer.innerHTML = "Keine FahrerIn gewählt."
                    }
                }
            }, (ex) => 
            {
                alert(ex);
            }, this.rentObject.anhaenger_id);
        }, (ex) => 
        {
            alert(ex);
        }, this.rentObject.anhaenger_id);
    }

    loadFahrer()
    {
        this.app.ApiBenutzerGetById((response) =>
        {
            let benutzer = response.benutzer;
            let html = 
            `
            <div class="card cards mt-3" style="width: 18rem;">
                <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-fahrer-id="${benutzer.userid}" id="imgBildFahrer">
                <div class="card-body" data-fahrer-id="${benutzer.userid}">
                    <h5 class="card-title">${benutzer.vorname} ${benutzer.nachname}</h5>
                    <p class="card-text">
                        <p id="pFuehrerscheinklassen" data-fahrer-id="${benutzer.userid}">Führerscheinklassen:</p><br>
                        Mietpreis: €${benutzer.mietpreis},-/ Tag<br>
                    </p>
                </div>
            </div>
            `;

            divRowFahrer.innerHTML = html;

            // load fuehrerscheinklassen info into card
            this.app.ApiBenutzerGetFSKList((response) => 
            {
                for(let element of response)
                {
                    let pFuehrerscheinklassen = document.getElementById("pFuehrerscheinklassen");
    
                    if(element.fahrer_id == pFuehrerscheinklassen.dataset.fahrerId)
                    {
                        pFuehrerscheinklassen.innerHTML = "Führerscheinklassen: " + element.fuehrerscheinstring;
                    }
                }

                // load images into card
                this.app.ApiBilderGetBenutzerList((response) =>
                {                    
                    if(response != null && response.length > 0)
                    {
                        let bildliste = response;
                        let imgBild = document.getElementById("imgBildFahrer");
                        imgBild.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
                    }
                }, (ex) => 
                {
                    alert(ex);
                }, this.rentObject.fahrer_id);
            }); 
        }, (ex) => 
        {
            alert(ex);
        }, this.rentObject.fahrer_id)
    }

    finalizeOrder()
    {
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
        const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];
        this.app.ApiBenutzerGetId((response) =>
        {
            this.rentObject.users_id = response;
            this.app.ApiRentObjectSet(() =>
            {

            }, (ex) =>
            {
                alert(ex);
            }, this.rentObject);
        }, (ex) =>
        {
            alert(ex);
        }, benutzerMerkmal);
    }
}