import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";
import Helper from "./helper.js";


export default class PageRentStepOne
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-one.html', appArgs.app.Main, () => 
		{
            //=================================
            // Konstanten

            const inputButtonAbbrechen1 = document.querySelector('#inputButtonAbbrechen1');
            const inputButtonAbbrechen2 = document.querySelector('#inputButtonAbbrechen2');
            const inputButtonWeiter1 = document.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = document.querySelector('#inputButtonWeiter2');

            const inputDateAbholdatum = document.querySelector('#inputDateAbholdatum');
            const inputDateRueckgabedatum = document.querySelector('#inputDateRueckgabedatum');
            const labelGesamtpreis = document.querySelector('#labelGesamtpreis');

            const inputCheckboxGleicherRueckgabeort = document.querySelector('#inputCheckboxGleicherRueckgabeort');
            const divRowRueckgabeort = document.querySelector('#divRowRueckgabeort');

            //=================================
            // Variablen
            var bid = localStorage.getItem("bid");
            var kid = localStorage.getItem("kid");

            //=================================
            // Initialisierung
            this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
            this.createRentObject();
            
            this.kraftfahrzeug = {};

            this.loadOptions();

            //=================================
            // Event Listeners

            inputButtonAbbrechen1.addEventListener('click', ()=>
            {
                location.hash = '#cars';
            });

            inputButtonAbbrechen2.addEventListener('click', ()=>
            {
                location.hash = '#cars';
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                this.saveData();
                location.hash = '#rentsteptwo';
            });

            inputButtonWeiter2.addEventListener('click', ()=>
            {
                this.saveData();
                location.hash = '#rentsteptwo';
            });

            inputCheckboxGleicherRueckgabeort.addEventListener('click', (e) =>
            {
                if(inputCheckboxGleicherRueckgabeort.checked == true)
                {
                    this.rentObject.gleicherRueckgabeort = true;
                    divRowRueckgabeort.classList.add("d-none");
                }
                else
                {
                    this.rentObject.gleicherRueckgabeort = false;
                    divRowRueckgabeort.classList.remove("d-none");
                }
            });

            inputDateAbholdatum.addEventListener('change', (e) =>
            {
                if(inputDateRueckgabedatum.value != "")
                {
                    labelGesamtpreis.innerText = this.calculatePrice(inputDateAbholdatum.value, inputDateRueckgabedatum.value).toString() + ",- €";
                }
            });

            inputDateRueckgabedatum.addEventListener('change', (e) =>
            {
                if(inputDateAbholdatum.value != "")
                {
                    labelGesamtpreis.innerText = this.calculatePrice(inputDateAbholdatum.value, inputDateRueckgabedatum.value).toString() + ",- €";
                }
            });
        });
    }

    //=================================
    // Functions

    saveData()
    {
        const selectAbholort = document.querySelector('#selectAbholort');
        const selectRueckgabeort = document.querySelector('#selectRueckgabeort');
        const inputDateAbholdatum = document.querySelector('#inputDateAbholdatum');
        const inputTimeAbholzeit = document.querySelector('#inputTimeAbholzeit');
        const inputDateRueckgabedatum = document.querySelector('#inputDateRueckgabedatum');
        const inputTimeRueckgabezeit = document.querySelector('#inputTimeRueckgabezeit');

        var kid = localStorage.getItem("kid");

        this.rentObject.abholort = selectAbholort.options[selectAbholort.selectedIndex].text;
        if(this.rentObject.gleicherRueckgabeort == true)
        {
            this.rentObject.rueckgabeort = selectAbholort.options[selectAbholort.selectedIndex].text;
        }
        else
        {
            this.rentObject.rueckgabeort = selectRueckgabeort.options[selectRueckgabeort.selectedIndex].text;
        }
        this.rentObject.abholdatum = inputDateAbholdatum.value;
        this.rentObject.abholzeit = inputTimeAbholzeit.value;
        this.rentObject.rueckgabedatum = inputDateRueckgabedatum.value;
        this.rentObject.rueckgabezeit = inputTimeRueckgabezeit.value;

        if(!this.rentObject.kraftfahrzeug_id == parseInt(kid) || this.rentObject.kraftfahrzeug_id == null)
        {
            let newValue = parseInt(kid);
            this.rentObject.kraftfahrzeug_id = newValue;
        }

        this.rentObject.grund = "Mietung eines KfZ";

        // WIP: add price!

        // Saving rentOBject to the local storage
        localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
    }

    loadData()
    {
        const selectAbholort = document.querySelector('#selectAbholort');
        const selectRueckgabeort = document.getElementById('selectRueckgabeort');
        const inputDateAbholdatum = document.getElementById('inputDateAbholdatum');
        const inputTimeAbholzeit = document.querySelector('#inputTimeAbholzeit');
        const inputDateRueckgabedatum = document.querySelector('#inputDateRueckgabedatum');
        const inputTimeRueckgabezeit = document.querySelector('#inputTimeRueckgabezeit');

        // Retrieving rentObject from the local storage
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        if(this.rentObject != {})
        {
            if(this.rentObject.abholort != null)
            {
                selectAbholort.value = this.rentObject.abholort;
            }
            
            if(this.rentObject.gleicherRueckgabeort == false)
            {
                if(this.rentObject.rueckgabeort != null)
                {
                    selectRueckgabeort.value = this.rentObject.rueckgabeort;
                }
                if(this.rentObject.abholort != null)
                {
                    selectAbholort.value = this.rentObject.abholort;
                }
            }
            else
            {
                if(this.rentObject.abholort != null)
                {
                    inputCheckboxGleicherRueckgabeort.checked = true;
                    divRowRueckgabeort.classList.add("d-none");
                    selectRueckgabeort.value = this.rentObject.abholort;
                    selectAbholort.value = this.rentObject.abholort;
                }          
            }

            if(this.rentObject.abholdatum != null)
            {
                inputDateAbholdatum.value = this.rentObject.abholdatum; 
            }
            if(this.rentObject.abholzeit != null)
            {
                inputTimeAbholzeit.value = this.rentObject.abholzeit;
            }
            if(this.rentObject.rueckgabedatum != null)
            {
                inputDateRueckgabedatum.value = this.rentObject.rueckgabedatum;
            }
            if(this.rentObject.rueckgabezeit != null)
            {
                inputTimeRueckgabezeit.value = this.rentObject.rueckgabezeit;
            }
            if(this.rentObject.preis_gesamt != 0)
            {
                labelGesamtpreis.innerText = this.calculatePrice(inputDateAbholdatum.value, inputDateRueckgabedatum.value).toString() + ",- €";
            }    
        }
    }

    loadOptions()
    {
        const divAbholortBody = document.querySelector('#divAbholortBody');
        const divRueckgabeortBody = document.querySelector('#divRueckgabeortBody');

        // Initialization
        var kid = localStorage.getItem("kid");

        // Retrieving rentObject from the local storage
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        this.app.ApiKraftfahrzeugGet((response) => 
        {
            this.kraftfahrzeug = response;
            this.createRentObject();
            this.rentObject.preis_kfz = this.kraftfahrzeug.mietpreis;
            localStorage.setItem('rentObject', JSON.stringify(this.rentObject));

            this.app.ApiAusgabenstelleNamesByKfz((response) =>
            {
                let html = `<select class="form-select col-6" aria-label="Abhol Ort" id="selectAbholort"><option>Bitte wählen</option>`;

                for(let ausgabenstellename of response)
                {
                    html += 
                    `
                    <option value="${ausgabenstellename}">${ausgabenstellename}</option>
                    `;
                }

                html += `</select>`;
                divAbholortBody.innerHTML = html;

                this.app.ApiAusgabenstelleAllNames((response) =>
                {
                    html = `<select class="form-select col-6" aria-label="Rueckgabe Ort" id="selectRueckgabeort"><option>Bitte wählen</option>`;

                    for(let ausgabenstellename of response)
                    {
                        html += 
                        `
                        <option value="${ausgabenstellename}">${ausgabenstellename}</option>
                        `;
                    }

                    html += `</select>`;
                    divRueckgabeortBody.innerHTML = html;

                    // Load Data
                    if(localStorage.getItem('rentObject'))
                    {
                        this.loadData();
                    }
                });
            }, (ex) => 
            {
                alert(ex);
            }, this.kraftfahrzeug.marke, this.kraftfahrzeug.modell);            
        }, (ex) => 
        {
            alert(ex);
        }, kid);
    }

    calculatePrice(firstDate, lastDate)
    {
        // Initialization
        this.Helper = new Helper();
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        // logic
        this.rentObject.abholdatum = firstDate;
        this.rentObject.rueckgabedatum = lastDate;
        this.rentObject.preis_gesamt = this.Helper.PriceCalculator(this.rentObject.abholdatum, this.rentObject.rueckgabedatum, this.rentObject.preis_kfz, this.rentObject.preis_zusatzpaket, this.rentObject.preis_anhaenger, this.rentObject.preis_fahrer);
        localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
        console.log(this.rentObject.preis_gesamt);
        return this.rentObject.preis_gesamt;
    }

    createRentObject()
    {
        if(this.rentObject == null)
        {
            this.rentObject = // variable that constitutes the current order of the client. It gets completed throughout the rent steps, and finally gets sent to the backend part
            {
                bewegung_id: null,
                users_id: null,
                abholort: null,
                gleicherRueckgabeort: false,
                rueckgabeort: null,
                abholdatum: null,
                rueckgabedatum: null,
                abholzeit: null,
                rueckgabezeit: null,
                kraftfahrzeug_id: null,
                anhaenger_id: null,
                grund: "Initalisierung...",
                schutzpaket: null,
                braucht_fahrer: false,
                fahrer_id: null,
                preis_gesamt: 0,
                preis_kfz: 0,
                preis_anhaenger: 0,
                preis_fahrer: 0,
                preis_zusatzpaket: 0,
                allow_reload: true, // variable to check if the aAendernButton on page-rent-step-three.js is active or not, so the data can be loaded anew
                transaction_finished: false,
                bewegung_finished: false,
            };
        }
    }
}
