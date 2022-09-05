
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

            // Variablen

            if(localStorage.getItem('rentObject'))
            {
                this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
                this.loadData();
            }
            // Event Listeners

            inputButtonZurueck1.addEventListener('click', ()=>
            {

                location.hash = '#rentstepone';
            });

            inputButtonZurueck2.addEventListener('click', ()=>
            {
                location.hash = '#rentstepone';
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                location.hash = '#rentstepthree';
            });

            inputButtonWeiter2.addEventListener('click', ()=>
            {
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
        
        this.rentObject.mietgegenstand_liste.push(parseInt(kid));
    }

    loadData()
    {
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
            
        }
    }
}
