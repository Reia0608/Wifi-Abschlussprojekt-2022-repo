
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

            this.anhaengerPreisListe = [];

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

        // WIP: Hard coded solution!
        if(inputRadioBasisSchutzpaket.checked)
        {
            this.rentObject.schutzpaket = "Basisschutzpaket";
            this.rentObject.preis_schutzpaket = 100;
        }
        else if(inputRadioMediumSchutzpaket.checked)
        {
            this.rentObject.schutzpaket = "Mediumschutzpaket";
            this.rentObject.preis_schutzpaket = 150;
        }
        else if(inputRadioPremiumSchutzpaket.checked)
        {
            this.rentObject.schutzpaket = "Premiumschutzpaket";
            this.rentObject.preis_schutzpaket = 250;
        }
        
        if(!this.rentObject.anhaenger_id == parseInt(selectAnhaenger.options[selectAnhaenger.selectedIndex].value) && selectAnhaenger.options[selectAnhaenger.selectedIndex].value != 0)
        {
            let newValue = parseInt(selectAnhaenger.options[selectAnhaenger.selectedIndex].value);
            this.rentObject.anhaenger_id = newValue;
        }
        else
        {
            this.rentObject.anhaenger_id = null;
        }

        // Save the selected anhaenger price to the rentObject
        if(selectAnhaenger.options[selectAnhaenger.selectedIndex].value != 0)
        {
            for(let iterator = 0; iterator < this.anhaengerPreisListe.length; iterator++)
            {
                if(selectAnhaenger.value == iterator)
                {
                    this.rentObject.preis_anhaenger = this.anhaengerPreisListe[iterator];
                }
            }
        }
        
        // Calculate rentObject.preis_gesamt
        this.Helper = new Helper();
        this.rentObject.preis_gesamt = this.Helper.PriceCalculator(this.rentObject.abholdatum, this.rentObject.rueckgabedatum, this.rentObject.preis_kfz, this.rentObject.preis_schutzpaket, this.rentObject.preis_anhaenger, this.rentObject.preis_fahrer);

        // Saving rentOBject to the local storage
        localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
    }

    // Loaded second; updates the values and selections of the page
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

            if(this.rentObject.anhaenger_id != null)
            {
                selectAnhaenger.value = this.rentObject.anhaenger_id.toString();
            }

            if(this.rentObject.preis_gesamt != 0)
            {
                labelGesamtpreis.innerText = this.rentObject.preis_gesamt.toString() + ",- €";
            }
        }
    }

    // Loaded first; loads the available options into the page
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

                    // Save the Prices of the trailers
                    this.anhaengerPreisListe[anhaenger.anhaenger_id] = anhaenger.mietpreis;
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
                    this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger);
                    this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
                    this.rentObject.anhaenger_id = parseInt(selectAnhaenger.value);
                    localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
                });

                // WIP: Putting the EventListeners here means they won't respond when ApiAnhaengerGetByAusgabenstelle fails,
                // but they need to be here so that preis_anhaenger can be calculated correctly
                inputRadioBasisSchutzpaket.addEventListener('change', () =>
                {
                    inputRadioMediumSchutzpaket.checked = false;
                    inputRadioPremiumSchutzpaket.checked = false;
                    this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger);
                });
    
                inputRadioMediumSchutzpaket.addEventListener('change', () =>
                {
                    inputRadioBasisSchutzpaket.checked = false;
                    inputRadioPremiumSchutzpaket.checked = false;
                    this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger);
                });
    
                inputRadioPremiumSchutzpaket.addEventListener('change', () =>
                {
                    inputRadioBasisSchutzpaket.checked = false;
                    inputRadioMediumSchutzpaket.checked = false;
                    this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger);
                });
            }, (ex) => 
            {
                alert(ex);

                // Putting these Eventlisteners in the ErrorCallback as a precaution
                inputRadioBasisSchutzpaket.addEventListener('change', () =>
                {
                    inputRadioMediumSchutzpaket.checked = false;
                    inputRadioPremiumSchutzpaket.checked = false;
                    this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger);
                });
    
                inputRadioMediumSchutzpaket.addEventListener('change', () =>
                {
                    inputRadioBasisSchutzpaket.checked = false;
                    inputRadioPremiumSchutzpaket.checked = false;
                    this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger);
                });
    
                inputRadioPremiumSchutzpaket.addEventListener('change', () =>
                {
                    inputRadioBasisSchutzpaket.checked = false;
                    inputRadioMediumSchutzpaket.checked = false;
                    this.calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger);
                });
            }, ausgabenstelle_id);
        }, (ex) => 
        {
            alert(ex);
        }, this.rentObject.abholort);
    }

    // Calculates and views the preis_gesamt
    calculatePrice(inputRadioBasisSchutzpaket, inputRadioMediumSchutzpaket, inputRadioPremiumSchutzpaket, selectAnhaenger)
    {
        // Initialization
        this.Helper = new Helper();
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        // logic

        // WIP: Using a very quick and dirty solution. All the prices should be in the database for manipulation!
        if(inputRadioBasisSchutzpaket.checked == true)
        {
            this.rentObject.preis_schutzpaket = parseInt(inputRadioBasisSchutzpaket.name);
        }else if(inputRadioMediumSchutzpaket.checked == true)
        {
            this.rentObject.preis_schutzpaket = parseInt(inputRadioMediumSchutzpaket.name);
        }
        else
        {
            this.rentObject.preis_schutzpaket = parseInt(inputRadioPremiumSchutzpaket.name);
        }
        
        // WIP: Bad solution!!! What if the anhaenger_id = 0???
        if(selectAnhaenger.options[selectAnhaenger.selectedIndex].value != "0") 
        {
            // Search the right price for the selected Anhaenger and assign that value to rentObject
            for(let iterator = 0; iterator < this.anhaengerPreisListe.length; iterator++)
            {
                if(iterator == selectAnhaenger.value)
                {
                    this.rentObject.preis_anhaenger = this.anhaengerPreisListe[iterator];
                }
            }
            
            this.rentObject.preis_gesamt = this.Helper.PriceCalculator(this.rentObject.abholdatum, this.rentObject.rueckgabedatum, this.rentObject.preis_kfz, this.rentObject.preis_schutzpaket, this.rentObject.preis_anhaenger, this.rentObject.preis_fahrer);
            
            // Saving rentObject to local storage
            localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
            console.log(this.rentObject.preis_gesamt);
            labelGesamtpreis.innerText = this.rentObject.preis_gesamt.toString() + ",- €";
        }
        else
        {
            this.rentObject.preis_anhaenger = 0;
            this.rentObject.preis_gesamt = this.Helper.PriceCalculator(this.rentObject.abholdatum, this.rentObject.rueckgabedatum, this.rentObject.preis_kfz, this.rentObject.preis_schutzpaket, this.rentObject.preis_anhaenger, this.rentObject.preis_fahrer);
            localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
            console.log(this.rentObject.preis_gesamt);
            labelGesamtpreis.innerText = this.rentObject.preis_gesamt.toString() + ",- €";
        }   
    }
}
