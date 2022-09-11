
import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";
import Helper from "./helper.js";

export default class PageRentStepTwo
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-two.html', appArgs.app.Main, () => 
		{
            // Initialisierung

            const inputButtonZurueck1 = document.querySelector('#inputButtonZurueck1');
            const inputButtonZurueck2 = document.querySelector('#inputButtonZurueck2');
            const inputButtonWeiter1 = document.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = document.querySelector('#inputButtonWeiter2');

            const labelGesamtpreis = document.querySelector('#labelGesamtpreis');

            const inputRadioBasisSchutzpaket = document.querySelector('#inputRadioBasisSchutzpaket');
            const inputRadioMediumSchutzpaket = document.querySelector('#inputRadioMediumSchutzpaket');
            const inputRadioPremiumSchutzpaket = document.querySelector('#inputRadioPremiumSchutzpaket');
            const selectAnhaenger = document.getElementById('selectAnhaenger');

            this.loadOptions();
            
            // Event Listeners

            inputButtonZurueck1.addEventListener('click', () =>
            {
                this.saveData();
                location.hash = '#rentstepone';
            });

            inputButtonZurueck2.addEventListener('click', () =>
            {
                this.saveData();
                location.hash = '#rentstepone';
            });            

            inputButtonWeiter1.addEventListener('click', () =>
            {
                this.saveData();
                location.hash = '#rentstepthree';
            });

            inputButtonWeiter2.addEventListener('click', () =>
            {
                this.saveData();
                location.hash = '#rentstepthree';
            });

            inputRadioBasisSchutzpaket.addEventListener('change', () =>
            {
                inputRadioMediumSchutzpaket.checked = false;
                inputRadioPremiumSchutzpaket.checked = false;
                labelGesamtpreis.innerText = this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger).toString() + ",- €";
            });

            inputRadioMediumSchutzpaket.addEventListener('change', () =>
            {
                inputRadioBasisSchutzpaket.checked = false;
                inputRadioPremiumSchutzpaket.checked = false;
                labelGesamtpreis.innerText = this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger).toString() + ",- €";
            });

            inputRadioPremiumSchutzpaket.addEventListener('change', () =>
            {
                inputRadioBasisSchutzpaket.checked = false;
                inputRadioMediumSchutzpaket.checked = false;
                labelGesamtpreis.innerText = this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger).toString() + ",- €";
            });
        });
    }

    //=================================
    // Functions

    saveData()
    {
        const inputRadioBasisSchutzpaket = document.querySelector('#inputRadioBasisSchutzpaket');
        const inputRadioMediumSchutzpaket = document.querySelector('#inputRadioMediumSchutzpaket');
        const inputRadioPremiumSchutzpaket = document.querySelector('#inputRadioPremiumSchutzpaket');
        const selectAnhaenger = document.querySelector('#selectAnhaenger');

        var kid = localStorage.getItem("kid");

        if(inputRadioBasisSchutzpaket.checked)
        {
            this.rentObject.schutzpaket = "Basisschutzpaket";
        }
        else if(inputRadioMediumSchutzpaket.checked)
        {
            this.rentObject.schutzpaket = "Mediumschutzpaket";
        }
        else if(inputRadioPremiumSchutzpaket.checked)
        {
            this.rentObject.schutzpaket = "Premiumschutzpaket";
        }
        
        if(!this.rentObject.mietgegenstandliste.includes(parseInt(selectAnhaenger.options[selectAnhaenger.selectedIndex].value)))
        {
            let newValue = parseInt(selectAnhaenger.options[selectAnhaenger.selectedIndex].value);
            this.rentObject.mietgegenstandliste[1] = newValue;
        }
        
        // WIP: add price!

        // Saving rentOBject to the local storage
        localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
    }

    loadData()
    {
        // Retrieving rentObject from the local storage
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        if(this.rentObject != {})
        {
            switch(this.rentObject.schutzpaket)
            {
                case 'Basisschutzpaket': inputRadioBasisSchutzpaket.checked = true;
                                            break;
                case 'Mediumschutzpaket': inputRadioMediumSchutzpaket.checked = true;
                                            break;
                case 'Premiumschutzpaket': inputRadioPremiumSchutzpaket.checked = true;
                                            break;
                default: break;
            }

            // WIP not the best way of doing things...
            if(this.rentObject.mietgegenstandliste[1] != null)
            {
                selectAnhaenger.value = this.rentObject.mietgegenstandliste[1].toString();
            }
        }
    }

    loadOptions()
    {
        const divAnhaengerBody = document.querySelector('#divAnhaengerBody');

        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        this.app.ApiAusgabenstelleGetId((response) =>
        {
            let ausgabenstelle_id = response;
            this.app.ApiAnhaengerGetByAusgabenstelle((response) =>
            {
                let html = `<select class="form-select col-6" aria-label="Anhaengerliste" id="selectAnhaenger"><option>Bitte wählen</option><option value="0">Keinen Anhänger</option>`;

                for(let anhaenger of response)
                {
                    html += 
                    `
                    <option value="${anhaenger.anhaenger_id}">${anhaenger.marke} ${anhaenger.modell}</option>
                    `;
                }

                html += `</select>`;
                divAnhaengerBody.innerHTML = html;

                if(localStorage.getItem('rentObject'))
                {
                    this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
                    this.loadData();
                }

                // adding EventListener to selectAnhaenger
                selectAnhaenger.addEventListener('change', () =>
                {
                    let result = this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger);
                });
            }, (ex) => 
            {
                alert(ex);
            }, ausgabenstelle_id);
        }, (ex) => 
        {
            alert(ex);
        }, this.rentObject.abholort);

        if(this.rentObject.preis_gesamt != 0)
        {
            labelGesamtpreis.innerText = this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger).toString() + ",- €";
        }
    }

    calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger)
    {
        // Initialization
        this.Helper = new Helper();
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        // logic

        // WIP: Using a very quick and dirty solution. All the prices should be in the database for manipulation!
        if(inputRadioBasisSchutzpaket.checked == true)
        {
            this.rentObject.preis_zusatzpaket = parseInt(inputRadioBasisSchutzpaket.name);
        }else if(inputRadioMediumSchutzpaket.checked == true)
        {
            this.rentObject.preis_zusatzpaket = parseInt(inputRadioMediumSchutzpaket.name);
        }
        else
        {
            this.rentObject.preis_zusatzpaket = parseInt(inputRadioPremiumSchutzpaket.name);
        }
        
        // WIP: Bad solution!!! What if the anhaenger_id = 0 or 1???
        if(selectAnhaenger.options[selectAnhaenger.selectedIndex].value != "Bitte wählen" && selectAnhaenger.options[selectAnhaenger.selectedIndex].value != "Keinen Anhänger" && selectAnhaenger.options[selectAnhaenger.selectedIndex].value != "0") 
        {
            this.app.ApiAnhaengerGet((response) =>
            {
                this.rentObject.preis_anhaenger = response.mietpreis;
                this.rentObject.preis_gesamt = this.Helper.PriceCalculator(this.rentObject.abholdatum, this.rentObject.rueckgabedatum, this.rentObject.preis_kfz, this.rentObject.preis_zusatzpaket, this.rentObject.preis_anhaenger, this.rentObject.preis_fahrer);
                localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
                console.log(this.rentObject.preis_gesamt);
                labelGesamtpreis.innerText = this.rentObject.preis_gesamt.toString() + ",- €";
                return this.rentObject.preis_gesamt;
            }, (ex) => 
            {
                alert(ex);
            }, selectAnhaenger.options[selectAnhaenger.selectedIndex].value);
        }
        else
        {
            this.rentObject.preis_anhaenger = 0;
            this.rentObject.preis_gesamt = this.Helper.PriceCalculator(this.rentObject.abholdatum, this.rentObject.rueckgabedatum, this.rentObject.preis_kfz, this.rentObject.preis_zusatzpaket, this.rentObject.preis_anhaenger, this.rentObject.preis_fahrer);
            localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
            console.log(this.rentObject.preis_gesamt);
            labelGesamtpreis.innerText = this.rentObject.preis_gesamt.toString() + ",- €";
            return this.rentObject.preis_gesamt;
        }   
    }
}
