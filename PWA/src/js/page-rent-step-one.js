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

            const inputButtonAbbrechen1 = document.querySelector('#inputButtonAbbrechen1');
            const inputButtonAbbrechen2 = document.querySelector('#inputButtonAbbrechen2');
            const inputButtonWeiter1 = document.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = document.querySelector('#inputButtonWeiter2');

            const inputCheckboxGleicherRueckgabeort = document.querySelector('#inputCheckboxGleicherRueckgabeort');
            const divRowRueckgabeort = document.querySelector('#divRowRueckgabeort');

            //=================================
            // Variablen
            var bid = localStorage.getItem("bid");
            var kid = localStorage.getItem("kid");

            //=================================
            // Initialisierung

            this.rentObject = 
            {
                abholort: null,
                gleicherRueckgabeort: false,
                rueckgabeort: null,
                abholdatum: null,
                rueckgabedatum: null,
                abholzeit: null,
                rueckgabezeit: null,
                mietgegenstandliste: [],
                grund: "Initalisierung..."
            };
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
        if(this.rentObject.gleicherRueckgabeort == false)
        {
            this.rentObject.rueckgabeort = selectRueckgabeort.options[selectRueckgabeort.selectedIndex].text;
        }
        else
        {
            this.rentObject.rueckgabeort = selectAbholort.options[selectAbholort.selectedIndex].text;
        }
        this.rentObject.abholdatum = inputDateAbholdatum.value;
        this.rentObject.abholzeit = inputTimeAbholzeit.value;
        this.rentObject.rueckgabedatum = inputDateRueckgabedatum.value;
        this.rentObject.rueckgabezeit = inputTimeRueckgabezeit.value;
        if(!this.rentObject.mietgegenstandliste.includes(parseInt(kid)))
        {
            var newArray = [parseInt(kid)];
            this.rentObject.mietgegenstandliste.push(newArray);
        }

        this.rentObject.grund = "Mietung eines KfZ";

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

        // Retrieving renObject from the local storage
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
        }
    }

    loadOptions()
    {
        const divAbholortBody = document.querySelector('#divAbholortBody');
        const divRueckgabeortBody = document.querySelector('#divRueckgabeortBody');

        // Initialization
        var kid = localStorage.getItem("kid");

        this.app.ApiKraftfahrzeugGet((response) => 
        {
            this.kraftfahrzeug = response;

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
}
