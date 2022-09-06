
import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
//import "./../node_modules/jquery/dist/jquery.min.js";
import "./app.js";


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
                }
                else
                {
                    this.rentObject.braucht_fahrer = false;
                    divRowFahrer.classList.add("d-none");
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

        // Retrieving rentObject from the local storage
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        if(this.rentObject != {})
        {
            this.app.ApiBenutzerGetFahrer((response) => 
            {
                let html = '';
                let iterator = 1;
                for (let fahrer of response) 
                {
                    html += 
                    `
                    <div class="card cards" style="width: 18rem;">
                        <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-kraftfahrzeug-id="${fahrer.users_id}" id="imgBild_${iterator}">
                        <div class="card-body" data-kraftfahrzeug-id="${fahrer.users_id}">
                            <h5 class="card-title">${fahrer.vorname} ${fahrer.nachname}</h5>
                            <p class="card-text">
                                Führerscheinklassen: ${this.loadFSK(fahrer.users_id)}<br>
                                Mietpreis: €${fahrer.mietpreis},-<br>
                            </p>
                            <a class="btn btn-primary" id="aMieten_${iterator}">Mieten</a>
                        </div>
                    </div>
                    `;
                    iterator++;
                }

                divRowFahrer.innerHTML = html;

                this.app.ApiBilderGetAvailableFahrerList((response) =>
                {
                    let jiterator = 1;
                    for(let i = 0; i < response.length; i++)
                    {
                        for (let kfzBild of response)
                        {
                            if(jiterator <= response.length)
                            {
                                var imgIdentifier = "imgBild_" + jiterator.toString();
                                var imgBild = document.getElementById(imgIdentifier);
        
                                if(kfzBild.kraftfahrzeug_id == imgBild.dataset.kraftfahrzeugId)
                                {
                                    imgBild.src = "data:image/jpeg;base64," + kfzBild.bild_bytes;
                                    jiterator++;
                                }	
                            }
                        }
                    }
                }, (ex) => 
                {
                    alert(ex);
                });
            }, (ex) => 
            {
                alert(ex);
            });
        }
    }

    loadFSK(users_id)
    {
        const tbodyFahrerList = document.querySelector('#tbodyFahrerList');

        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        
    }
}
