
import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";


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

            this.loadOptions();
            
            // Event Listeners

            inputButtonZurueck1.addEventListener('click', ()=>
            {
                this.saveData();
                location.hash = '#rentstepone';
            });

            inputButtonZurueck2.addEventListener('click', ()=>
            {
                this.saveData();
                location.hash = '#rentstepone';
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                this.saveData();
                location.hash = '#rentstepthree';
            });

            inputButtonWeiter2.addEventListener('click', ()=>
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
            this.rentObject.mietgegenstandliste.push(newValue);
        }
        
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
            }, (ex) => 
            {
                alert(ex);
            }, ausgabenstelle_id);
        }, (ex) => 
        {
            alert(ex);
        }, this.rentObject.abholort);
    }
}
