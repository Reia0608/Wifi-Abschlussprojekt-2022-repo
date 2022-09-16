
import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
//import "./../node_modules/jquery/dist/jquery.min.js";
import "./app.js";
import Helper from "./helper.js";


export default class PageRentStepThree
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-three.html', appArgs.app.Main, () => 
		{
            // Initialisierung

            const inputButtonZurueck1 = document.querySelector('#inputButtonZurueck1');
            const inputButtonZurueck2 = document.querySelector('#inputButtonZurueck2');
            const inputButtonWeiter1 = document.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = document.querySelector('#inputButtonWeiter2');

            const inputCheckboxFahrer = document.querySelector('#inputCheckboxFahrer');
            const divRowFahrer = document.querySelector('#divRowFahrer');

            const labelGesamtpreis = document.querySelector('#labelGesamtpreis');

            this.loadData();

            // Event Listeners

            inputButtonZurueck1.addEventListener('click', ()=>
            {
                this.saveData();
                location.hash = '#rentsteptwo';
            });

            inputButtonZurueck2.addEventListener('click', ()=>
            {
                this.saveData();
                location.hash = '#rentsteptwo';
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                this.saveData();
                location.hash = '#rentstepfour';
            });

            inputButtonWeiter2.addEventListener('click', ()=>
            {
                this.saveData();
                location.hash = '#rentstepfour';
            });

            inputCheckboxFahrer.addEventListener('click', (e) =>
            {
                if(inputCheckboxFahrer.checked == true)
                {
                    this.rentObject.braucht_fahrer = true;
                    divRowFahrer.classList.remove("d-none");
                    localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
                    this.loadData();
                }
                else
                {
                    this.rentObject.braucht_fahrer = false;
                    divRowFahrer.classList.add("d-none");
                    localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
                }
            });
        });
    }

    //=================================
    // Functions

    saveData()
    {
        const inputCheckboxFahrer = document.querySelector('#inputCheckboxFahrer');

        var kid = localStorage.getItem("kid");

        if(inputCheckboxFahrer.checked)
        {
            this.rentObject.braucht_fahrer = true;
        }
        else
        {
            this.rentObject.braucht_fahrer = false;
        }
        
        // Saving rentOBject to the local storage
        localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
    }

    loadData()
    {
        const divRowFahrer = document.querySelector('#divRowFahrer');

        // variable
        let fahrerList = ''; 

        // Retrieving rentObject from the local storage
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
        if(localStorage.getItem('fahrerList'))
        {
            fahrerList = localStorage.getItem('fahrerList');
        }
        
        divRowFahrer.classList.add("d-none");

        if(this.rentObject != {} && this.rentObject.braucht_fahrer == true)
        {
            inputCheckboxFahrer.checked = true;

            if(this.rentObject.fahrer_id == null || this.rentObject.allow_reload == true)
            {
                this.app.ApiBenutzerGetFahrer((response) => 
                {
                    let html = '';
                    let iterator = 1;
                    fahrerList = '';

                    divRowFahrer.classList.remove("d-none");

                    for (let fahrer of response) 
                    {
                        html += 
                        `
                        <div class="card cards mt-3" style="width: 18rem;">
                            <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-fahrer-id="${fahrer.userid}" id="imgBild_${iterator}">
                            <div class="card-body" data-fahrer-id="${fahrer.userid}">
                                <h5 class="card-title">${fahrer.vorname} ${fahrer.nachname}</h5>
                                <p class="card-text">
                                    <p id="pFuehrerscheinklassen_${iterator}" data-fahrer-id="${fahrer.userid}">Führerscheinklassen:</p><br>
                                    Mietpreis: €${fahrer.mietpreis},-<br>
                                </p>
                                <a class="btn btn-primary" id="aMietenButton" data-fahrer-id="${fahrer.userid}" >Mieten</a>
                            </div>
                        </div>
                        `;

                        iterator++;
                        fahrerList += fahrer.userid.toString() + '_';
                        localStorage.setItem('fahrerList', fahrerList);                    
                    }

                    divRowFahrer.innerHTML = html;

                    // prepare the Fahrer Mieten buttons
                    
                    let aMietenButtonCollection = this.app.Main.querySelectorAll('#aMietenButton');
                    
                    for(let button of aMietenButtonCollection)
                    {
                        button.addEventListener('click', (e) =>
                        {
                            this.rentObject.fahrer_id = button.dataset.fahrerId;
                            // WIP: add price!
                            this.rentObject.allow_reload = false;
                            localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
                            this.loadSelection(button.dataset.fahrerId, fahrerList);
                        });
                    }

                    // load fuehrerscheinklassen info into cards
                    this.app.ApiBenutzerGetFSKList((response) => 
                    {
                        let jiterator = 1;
                        for(let element of response)
                        {
                            if(jiterator <= response.length)
                            {
                                let pFuehrerscheinklassenIdentifier = "pFuehrerscheinklassen_" + jiterator.toString();
                                let pFuehrerscheinklassen = document.getElementById(pFuehrerscheinklassenIdentifier);
                
                                if(element.fahrer_id == pFuehrerscheinklassen.dataset.fahrerId)
                                {
                                    pFuehrerscheinklassen.innerHTML = "Führerscheinklassen: " + element.fuehrerscheinstring;
                                    jiterator++;
                                }
                            }
                        }

                        // load images into cards
                        this.app.ApiBilderGetAvailableFahrerList((response) =>
                        {
                            let jiterator = 1;
                            for(let i = 0; i < response.length; i++)
                            {
                                for (let fahrerBild of response)
                                {
                                    if(jiterator <= response.length)
                                    {
                                        var imgIdentifier = "imgBild_" + jiterator.toString();
                                        var imgBild = document.getElementById(imgIdentifier);
                
                                        if(fahrerBild.users_id == imgBild.dataset.fahrerId)
                                        {
                                            imgBild.src = "data:image/jpeg;base64," + fahrerBild.bild_bytes;
                                            jiterator++;
                                        }	
                                    }
                                }
                            }
                        }, (ex) => 
                        {
                            alert(ex);
                        }, fahrerList);        
                    }, (ex) => 
                    {
                        alert(ex);
                    });
                }, (ex) => 
                {
                    alert(ex);
                });
            }  
            else
            {
                divRowFahrer.classList.remove("d-none");
                this.loadSelection(parseInt(this.rentObject.fahrer_id), fahrerList);
            }   
        }
    }

    loadSelection(selection, fahrerList)
    {
        this.app.ApiBenutzerGetById((response) =>
        {
            let benutzer = response.benutzer;
            let html = 
            `
            <div class="card cards mt-3" style="width: 18rem;">
                <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-fahrer-id="${benutzer.userid}" id="imgBild_1">
                <div class="card-body" data-fahrer-id="${benutzer.userid}">
                    <h5 class="card-title">${benutzer.vorname} ${benutzer.nachname}</h5>
                    <p class="card-text">
                        <p id="pFuehrerscheinklassen" data-fahrer-id="${benutzer.userid}">Führerscheinklassen:</p><br>
                        Mietpreis: €${benutzer.mietpreis},-<br>
                    </p>
                    <a class="btn btn-primary" id="aAendernButton" data-fahrer-id="${benutzer.userid}" >Ändern</a>
                </div>
            </div>
            `;

            this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
            this.rentObject.preis_fahrer = benutzer.mietpreis;
            this.Helper = new Helper();
            this.rentObject.preis_gesamt = this.Helper.PriceCalculator(this.rentObject.abholdatum, this.rentObject.rueckgabedatum, this.rentObject.preis_kfz, this.rentObject.preis_schutzpaket, this.rentObject.preis_anhaenger, this.rentObject.preis_fahrer);
            labelGesamtpreis.innerText = this.rentObject.preis_gesamt.toString() + ",- €";
            localStorage.setItem('rentObject', JSON.stringify(this.rentObject));

            divRowFahrer.innerHTML = html;

            // Preparing the Aendern Button
            const aAendernButton = document.querySelector('#aAendernButton');

            aAendernButton.addEventListener('click', (e) =>
            {
                this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
                this.rentObject.allow_reload = true;
                this.rentObject.preis_fahrer = 0;
                this.rentObject.preis_gesamt = this.Helper.PriceCalculator(this.rentObject.abholdatum, this.rentObject.rueckgabedatum, this.rentObject.preis_kfz, this.rentObject.preis_schutzpaket, this.rentObject.preis_anhaenger, this.rentObject.preis_fahrer);
                labelGesamtpreis.innerText = this.rentObject.preis_gesamt.toString() + ",- €";
                localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
                this.loadData();
            })

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
                this.app.ApiBilderGetAvailableFahrerList((response) =>
                {
                    let jiterator = 1;
                    for(let i = 0; i < response.length; i++)
                    {
                        for (let fahrerBild of response)
                        {
                            if(jiterator <= response.length)
                            {
                                var imgIdentifier = "imgBild_" + jiterator.toString();
                                var imgBild = document.getElementById(imgIdentifier);

                                if(imgBild != null)
                                {
                                    if(fahrerBild.users_id == imgBild.dataset.fahrerId)
                                    {
                                        imgBild.src = "data:image/jpeg;base64," + fahrerBild.bild_bytes;
                                        jiterator++;
                                    }
                                }
                            }
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
}