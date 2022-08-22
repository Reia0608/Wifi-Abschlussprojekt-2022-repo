import Helper from "./helper.js";

export default class PageCars
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-car-list.html', args.app.Main, () => 
		{
            //--------------------------------------
            // Constants and variables

            const carListBody = this.app.Main.querySelector('#carListBody');

            const buttonFilterAlle = this.app.Main.querySelector('#buttonFilterAlle');
            const buttonFilterAlter = this.app.Main.querySelector('#buttonFilterAlter');
            const buttonFilterKlasse = this.app.Main.querySelector('#buttonFilterKlasse');
            const buttonFilterKategorie = this.app.Main.querySelector('#buttonFilterKategorie');
            const buttonFilterPreis = this.app.Main.querySelector('#buttonFilterPreis');

            const dropdownItemPKW = this.app.Main.querySelector('#dropdownItemPKW');
            const dropdownItemLKW = this.app.Main.querySelector('#dropdownItemLKW');
            const dropdownItemAnhaenger = this.app.Main.querySelector('#dropdownItemAnhaenger');
            const dropdownItemNFZ = this.app.Main.querySelector('#dropdownItemNFZ');
            const dropdownItemNKW = this.app.Main.querySelector('#dropdownItemNKW');
            const dropdownItemKTW = this.app.Main.querySelector('#dropdownItemKTW');
            const dropdownItemNAW = this.app.Main.querySelector('#dropdownItemNAW');
            const dropdownItemGKW = this.app.Main.querySelector('#dropdownItemGKW');
            const dropdownItemSonstige2 = this.app.Main.querySelector('#dropdownItemSonstige2');
            const dropdownItemUnbekannt2 = this.app.Main.querySelector('#dropdownItemUnbekannt2');

            const dropdownItemKleinwagen = this.app.Main.querySelector('#dropdownItemKleinwagen');
            const dropdownItemCabrio = this.app.Main.querySelector('#dropdownItemCabrio');
            const dropdownItemCoupe = this.app.Main.querySelector('#dropdownItemCoupe');
            const dropdownItemSUV = this.app.Main.querySelector('#dropdownItemSUV');
            const dropdownItemPickup = this.app.Main.querySelector('#dropdownItemPickup');
            const dropdownItemCombi = this.app.Main.querySelector('#dropdownItemCombi');
            const dropdownItemLimousine = this.app.Main.querySelector('#dropdownItemLimousine');
            const dropdownItemVan = this.app.Main.querySelector('#dropdownItemVan');
            const dropdownItemTransporter = this.app.Main.querySelector('#dropdownItemTransporter');
            const dropdownItemElektroauto = this.app.Main.querySelector('#dropdownItemElektroauto');
            const dropdownItemSportwagen = this.app.Main.querySelector('#dropdownItemSportwagen');
            const dropdownItemOldtimer = this.app.Main.querySelector('#dropdownItemOldtimer');
            const dropdownItemSonstige3 = this.app.Main.querySelector('#dropdownItemSonstige3');
            const dropdownItemUnbekannt3 = this.app.Main.querySelector('#dropdownItemUnbekannt3');
            const ulDropdownAusgabenstelle = this.app.Main.querySelector('#ulDropdownAusgabenstelle');

            const inputSubmitPreis = this.app.Main.querySelector('#inputSubmitPreis');
            const selectPreisOperator = this.app.Main.querySelector('#selectPreisOperator');
            const dropdownItemPreis = this.app.Main.querySelector('#dropdownItemPreis');

            const formFilterByPreis = this.app.Main.querySelector('#formPreis');
            const formFilterByAlter = this.app.Main.querySelector("#formAlter");

            this.activeButton = buttonFilterAlle;

            this.datenLaden();

            // ListGroupElement-click
            carListBody.addEventListener('click', (pointerCoordinates) => 
            {
                let button = null;

                if (pointerCoordinates.target.nodeName == 'PATH' && pointerCoordinates.target.parentElement.nodeName == 'SVG' && pointerCoordinates.target.parentElement.parentElement.nodeName == 'BUTTON') 
                {
                    button = pointerCoordinates.target.parentElement.parentElement;
                }
                else if (pointerCoordinates.target.nodeName == 'SVG' && pointerCoordinates.target.parentElement.nodeName == 'BUTTON')
                {
                    button = pointerCoordinates.target.parentElement;
                } 
                else if (pointerCoordinates.target.nodeName == 'BUTTON') 
                {
                    button = pointerCoordinates.target;
                }

                if (button) 
                {

                }
                else if (pointerCoordinates.target.nodeName == 'A') 
                {
                    let kraftfahrzeug_id = pointerCoordinates.target.parentElement.dataset.kraftfahrzeugId;
                    localStorage.setItem("kid", kraftfahrzeug_id); 
                    location.hash = '#cardetails';
                }
            });

            //--------------------------------------
            // Button Filter-Alle-click

            buttonFilterAlle.addEventListener('click', ()=>
            {
                this.datenLaden();
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterAlle;
                this.activeButton.classList.add('active');
            });

            //--------------------------------------
            // Button Filter-Alter-submit

            formFilterByAlter.addEventListener('submit', ()=>
            {
                this.filterBy("alter", dropdownItemAlter.value);
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterAlter;
                this.activeButton.classList.add('active');
            });

            //--------------------------------------
            // Button Filter-Klasse-PKW-click

            dropdownItemPKW.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "PKW");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Klasse-LKW-click

            dropdownItemLKW.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "LKW");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Klasse-Anhänger-click

            dropdownItemAnhaenger.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "Anhaenger");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Klasse-NFZ-click

            dropdownItemNFZ.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "NFZ");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Klasse-NKW-click

            dropdownItemNKW.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "NKW");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Klasse-KTW-click

            dropdownItemKTW.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "KTW");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Klasse-NAW-click

            dropdownItemNAW.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "NAW");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Klasse-GKW-click

            dropdownItemGKW.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "GKW");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Klasse-Sonstige2-click

            dropdownItemSonstige2.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "Sonstige");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Klasse-Unbekannt2-click

            dropdownItemUnbekannt2.addEventListener('click', ()=>
            {
                this.filterBy("klasse", "Unbekannt");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKlasse;
                this.activeButton.classList.add('active');
            });

            //--------------------------------------
            // Button Filter-Kategorie-Kleinwagen-click

            dropdownItemKleinwagen.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Kleinwagen");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Cabrio-click

            dropdownItemCabrio.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Cabrio");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Coupe-click

            dropdownItemCoupe.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Coupé");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-SUV-click

            dropdownItemSUV.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "SUV_Gelaendewagen");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Pickup-click

            dropdownItemPickup.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Pickup");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Combi-click

            dropdownItemCombi.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Combi");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Limousine-click

            dropdownItemLimousine.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Limousine");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Van-click

            dropdownItemVan.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Van_Kleinbus");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Transporter-click

            dropdownItemTransporter.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Transporter");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Elektroauto-click

            dropdownItemElektroauto.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Elektroauto");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Sportwagen-click

            dropdownItemSportwagen.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Sportwagen");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Oldtimer-click

            dropdownItemOldtimer.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Oldtimer");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Sonstige3-click

            dropdownItemSonstige3.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Sonstige");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            // Button Filter-Kategorie-Unbekannt3-click

            dropdownItemUnbekannt3.addEventListener('click', ()=>
            {
                this.filterBy("kategorie", "Unbekannt");
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterKategorie;
                this.activeButton.classList.add('active');
            });

            //--------------------------------------
            // Button Filter-Preis-submit

            formFilterByPreis.addEventListener('submit', ()=>
            {
                if(selectPreisOperator.options[selectPreisOperator.selectedIndex].value == '1')
                {
                    filterBy("=", dropdownItemPreis.value);
                }
                else if(selectPreisOperator.options[selectPreisOperator.selectedIndex].value == '2')
                {
                    filterBy(">", dropdownItemPreis.value);
                }
                else if(selectPreisOperator.options[selectPreisOperator.selectedIndex].value == '3')
                {
                    filterBy("<", dropdownItemPreis.value);
                }
                else if(selectPreisOperator.options[selectPreisOperator.selectedIndex].value == '4')
                {
                    filterBy(">=", dropdownItemPreis.value);
                }
                else if(selectPreisOperator.options[selectPreisOperator.selectedIndex].value == '5')
                {
                    filterBy("<=", dropdownItemPreis.value);
                }
                this.activeButton.classList.remove('active');
                this.activeButton = buttonFilterPreis;
                this.activeButton.classList.add('active');
            });
        });
    }

    //--------------------------------------
    // Functions 

    datenLaden()
    {
        this.app.ApiAusgabenstelleGetList((response) =>
        {
            let html = '';
            let iterator = 1;
            if(response.length != 0)
            {
                for(let ausgabenstelle of response)
                {
                    html += `
                            <li><a class="dropdown-item" id="dropdownItemAusgabenstelle" data-ausgabenstelle-id=${ausgabenstelle.ausgabenstelle_id}>${ausgabenstelle.ausgabenstelle_bezeichnung}</a></li>
                            `;
                    iterator++;
                }
                ulDropdownAusgabenstelle.innerHTML = html;
            }

            // Create dropdown Variables for Ausgabenstelle.
            let ausgabenstelleCollection = document.querySelectorAll('#dropdownItemAusgabenstelle');
            for(let buttonAusgabenstelle of ausgabenstelleCollection) 
            {    
                buttonAusgabenstelle.addEventListener('click', ()=>
                {
                    filterBy("ausgabenstelle", buttonAusgabenstelle.dataset.ausgabenstelleId);
                    this.activeButton.classList.remove('active');
                    this.activeButton = buttonAusgabenstelle;
                    this.activeButton.classList.add('active');
                }); 
            }

            this.app.ApiKraftfahrzeugGetList((response) => 
            {
                let html = '';
                let iterator = 1;
                let currentYear = new Date().getFullYear();
                for (let kraftfahrzeug of response) 
                {
                    html += 
                    `<div class="card cards" style="width: 18rem;">
                        <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}" id="imgBild_${iterator}">
                        <div class="card-body" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}">
                            <h5 class="card-title">${kraftfahrzeug.marke} ${kraftfahrzeug.modell}</h5>
                            <p class="card-text">
                                Alter: ${currentYear - kraftfahrzeug.baujahr} Jahre<br>
                                Klasse: ${kraftfahrzeug.klasse}<br>
                                Kategorie: ${kraftfahrzeug.kategorie}<br>
                                Mietpreis: €${kraftfahrzeug.mietpreis},-<br>
                            </p>
                            <a class="btn btn-primary" id="aEinzelheiten_${iterator}">Einzelheiten</a>
                        </div>
                    </div>
                    `;
                    iterator++;
                }

                carListBody.innerHTML = html;

                this.app.ApiBilderGetAllKfzList((response) =>
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
        }, (ex) => 
        {
            alert(ex);
        });
    }

    filterBy(by, value)
    {
        this.app.ApiKraftfahrzeugFilterBy((response) => 
        {
            let html = '';
            let iterator = 1;
            let currentYear = new Date().getFullYear();
            let kfzList = '';
            if(response.length == 0)
            {
                carListBody.innerHTML = "Es wurden keine KfZ gefunden, die dieser Bedingung entsprechen!"
            }
            else
            {
                for (let kraftfahrzeug of response) 
                {
                    html += 
                    `<div class="card cards" style="width: 18rem;">
                        <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}" id="imgBild_${iterator}">
                        <div class="card-body" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}">
                            <h5 class="card-title">${kraftfahrzeug.marke} ${kraftfahrzeug.modell}</h5>
                            <p class="card-text">
                                Alter: ${currentYear - kraftfahrzeug.baujahr} Jahre<br>
                                Klasse: ${kraftfahrzeug.klasse}<br>
                                Kategorie: ${kraftfahrzeug.kategorie}<br>
                                Mietpreis: €${kraftfahrzeug.mietpreis},-<br>
                            </p>
                            <a class="btn btn-primary" id="aEinzelheiten_${iterator}">Einzelheiten</a>
                        </div>
                    </div>
                    `;
                    iterator++;
                    kfzList += kraftfahrzeug.kraftfahrzeug_id.toString() + '_';
                }

                carListBody.innerHTML = html;

                this.app.ApiBilderGetSpecificKfzList((response) =>
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
                }, kfzList);
            }
        }, (ex) => 
        {
            alert(ex);
        }, by, value);
    }
}