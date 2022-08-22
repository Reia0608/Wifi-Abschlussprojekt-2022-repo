import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";


export default class PageRentStepOne
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-one.html', appArgs.app.Main, () => 
		{

            //=================================
            // Konstanten

            const apiBaseUrl = 'http://localhost:59968/api/';

            const inputButtonAbbrechen1 = document.querySelector('#inputButtonAbbrechen1');
            const inputButtonAbbrechen2 = document.querySelector('#inputButtonAbbrechen2');
            const inputButtonWeiter1 = document.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = document.querySelector('#inputButtonWeiter2');

            const inputCheckboxGleicherRueckgabeort = document.querySelector('#inputCheckboxGleicherRueckgabeort');
            const divRowRueckgabeort = document.querySelector('#divRowRueckgabeort');

            //=================================
            // Variablen

            var gleicherRueckgabeort = false;
            var rentObject = {};
            var bid = localStorage.getItem("bid");

            //=================================
            // Initialisierung

            //=================================
            // Event Listeners

            inputButtonAbbrechen1.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/car-list.html', '_self');
            });

            inputButtonAbbrechen2.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/car-list.html', '_self');
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                saveData();
                window.open('http://localhost:5500/src/rent-step-two.html', '_self');
            });

            inputButtonWeiter2.addEventListener('click', ()=>
            {
                saveData();
                window.open('http://localhost:5500/src/rent-step-two.html', '_self');
            });

            inputCheckboxGleicherRueckgabeort.addEventListener('click', (e) =>
            {
                if(inputCheckboxGleicherRueckgabeort.checked == true)
                {
                    gleicherRueckgabeort = true;
                    divRowRueckgabeort.classList.add("d-none");
                }
                else
                {
                    gleicherRueckgabeort = false;
                    divRowRueckgabeort.classList.remove("d-none");
                }
            });
        });
    }

    //=================================
    // Functions

    saveData()
    {
        const inputTextAbholort = document.querySelector('#inputTextAbholort');
        const inputTextRueckgabeort = document.querySelector('#inputTextRueckgabeort');
        const inputDateAbholdatum = document.querySelector('#inputDateAbholdatum');
        const inputTimeAbholzeit = document.querySelector('#inputTimeAbholzeit');
        const inputDateRueckgabedatum = document.querySelector('#inputDateRueckgabedatum');
        const inputTimeRueckgabezeit = document.querySelector('#inputTimeRueckgabezeit');

        var kid = localStorage.getItem("kid");

        rentObject.abholort = inputTextAbholort.ariaValueText;
        if(gleicherRueckgabeort == false)
        {
            rentObject.rueckgabeort = inputTextRueckgabeort.ariaValueText;
        }
        else
        {
            rentObject.rueckgabeort = inputTextAbholort.ariaValueText;
        }
        rentObject.abholdatum = inputDateAbholdatum.value;
        rentObject.abholzeit = inputTimeAbholzeit.value;
        rentObject.rueckgabedatum = inputDateRueckgabedatum.value;
        rentObject.rueckgabezeit = inputTimeRueckgabezeit.value;
        rentObject.mietgegenstand_liste = parseInt(kid);
        rentObject.grund = "Mietung eines KfZ";
    }
}
