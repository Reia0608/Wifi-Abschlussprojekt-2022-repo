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

            const divRowFahrer = document.querySelector('#divRowFahrer');
            // const divRowKfz = document.querySelector('#divRowKfz');

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
        labelAbholdatum.innerText = this.rentObject.abholdatum;
        labelAbholzeit.innerText = this.rentObject.abholzeit;
        labelRueckgabedatum.innerText = this.rentObject.rueckgabedatum;
        labelRueckgabezeit.innerText = this.rentObject.rueckgabezeit;
        labelSchutzpaket.innerText = this.rentObject.schutzpaket;
        // car goes here
        labelAnhaenger.innerText = this.rentObject.mietgegenstandliste[1];
        // fahrer goes here
        // payment method goes here
        labelGesamtpreis.innerText = this.rentObject.preis_gesamt.toString() + ",- €";
    }

    loadFahrer(selection)
    {
        this.app.ApiBenutzerGetById((response) =>
        {
            let benutzer = response.benutzer;
            let html = 
            `
            <div class="card cards mt-3" style="width: 18rem;">
                <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-fahrer-id="${benutzer.userid}" id="imgBild">
                <div class="card-body" data-fahrer-id="${benutzer.userid}">
                    <h5 class="card-title">${benutzer.vorname} ${benutzer.nachname}</h5>
                    <p class="card-text">
                        <p id="pFuehrerscheinklassen" data-fahrer-id="${benutzer.userid}">Führerscheinklassen:</p><br>
                        Mietpreis: €${benutzer.mietpreis},-<br>
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
                    var imgBild = document.getElementById("imgBild");

                    let fahrerBild = response;
                    
                    if(imgBild != null)
                    {
                        if(fahrerBild.users_id == imgBild.dataset.fahrerId)
                        {
                            imgBild.src = "data:image/jpeg;base64," + fahrerBild.bild_bytes;
                        }
                    }
                }, (ex) => 
                {
                    alert(ex);
                }, fahrerList);
            }); 
        }, (ex) => 
        {
            alert(ex);
        }, selection)
    }

    finalizeOrder()
    {

    }
}