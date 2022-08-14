//--------------------------------------
// Constants and variables

const apiBaseUrl = 'http://localhost:59968/api/';

const carListBody = document.querySelector('#carListBody');

const buttonFilterAlle = document.querySelector('#buttonFilterAlle');
const buttonFilterAlter = document.querySelector('#buttonFilterAlter');
const buttonFilterKlasse = document.querySelector('#buttonFilterKlasse');
const buttonFilterKategorie = document.querySelector('#buttonFilterKategorie');
const buttonFilterPreis = document.querySelector('#buttonFilterPreis');

const dropdownItemPKW = document.querySelector('#dropdownItemPKW');
const dropdownItemLKW = document.querySelector('#dropdownItemLKW');
const dropdownItemAnhaenger = document.querySelector('#dropdownItemAnhaenger');
const dropdownItemNFZ = document.querySelector('#dropdownItemNFZ');
const dropdownItemNKW = document.querySelector('#dropdownItemNKW');
const dropdownItemKTW = document.querySelector('#dropdownItemKTW');
const dropdownItemNAW = document.querySelector('#dropdownItemNAW');
const dropdownItemGKW = document.querySelector('#dropdownItemGKW');
const dropdownItemSonstige2 = document.querySelector('#dropdownItemSonstige2');
const dropdownItemUnbekannt2 = document.querySelector('#dropdownItemUnbekannt2');

const dropdownItemKleinwagen = document.querySelector('#dropdownItemKleinwagen');
const dropdownItemCabrio = document.querySelector('#dropdownItemCabrio');
const dropdownItemCoupe = document.querySelector('#dropdownItemCoupe');
const dropdownItemSUV = document.querySelector('#dropdownItemSUV');
const dropdownItemPickup = document.querySelector('#dropdownItemPickup');
const dropdownItemCombi = document.querySelector('#dropdownItemCombi');
const dropdownItemLimousine = document.querySelector('#dropdownItemLimousine');
const dropdownItemVan = document.querySelector('#dropdownItemVan');
const dropdownItemTransporter = document.querySelector('#dropdownItemTransporter');
const dropdownItemElektroauto = document.querySelector('#dropdownItemElektroauto');
const dropdownItemSportwagen = document.querySelector('#dropdownItemSportwagen');
const dropdownItemOldtimer = document.querySelector('#dropdownItemOldtimer');
const dropdownItemSonstige3 = document.querySelector('#dropdownItemSonstige3');
const dropdownItemUnbekannt3 = document.querySelector('#dropdownItemUnbekannt3');
const ulDropdownAusgabenstelle = document.querySelector('#ulDropdownAusgabenstelle');

const inputSubmitPreis = document.querySelector('#inputSubmitPreis');
const selectPreisOperator = document.querySelector('#selectPreisOperator');
const dropdownItemPreis = document.querySelector('#dropdownItemPreis');

const formFilterByPreis = document.querySelector('#formPreis');
const formFilterByAlter = document.querySelector("#formAlter");

this.activeButton = buttonFilterAlle;

datenLaden();

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
        window.open('http://localhost:5500/src/car-details.html', '_self');
    }
});

//--------------------------------------
// Button Filter-Alle-click

buttonFilterAlle.addEventListener('click', ()=>
{
    datenLaden();
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterAlle;
    this.activeButton.classList.add('active');
});

//--------------------------------------
// Button Filter-Alter-submit

formFilterByAlter.addEventListener('submit', ()=>
{
    filterBy("alter", dropdownItemAlter.value);
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterAlter;
    this.activeButton.classList.add('active');
});

//--------------------------------------
// Button Filter-Klasse-PKW-click

dropdownItemPKW.addEventListener('click', ()=>
{
    filterBy("klasse", "PKW");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

// Button Filter-Klasse-LKW-click

dropdownItemLKW.addEventListener('click', ()=>
{
    filterBy("klasse", "LKW");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

// Button Filter-Klasse-Anhänger-click

dropdownItemAnhaenger.addEventListener('click', ()=>
{
    filterBy("klasse", "Anhaenger");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

// Button Filter-Klasse-NFZ-click

dropdownItemNFZ.addEventListener('click', ()=>
{
    filterBy("klasse", "NFZ");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

// Button Filter-Klasse-NKW-click

dropdownItemNKW.addEventListener('click', ()=>
{
    filterBy("klasse", "NKW");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

// Button Filter-Klasse-KTW-click

dropdownItemKTW.addEventListener('click', ()=>
{
    filterBy("klasse", "KTW");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

// Button Filter-Klasse-NAW-click

dropdownItemNAW.addEventListener('click', ()=>
{
    filterBy("klasse", "NAW");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

// Button Filter-Klasse-GKW-click

dropdownItemGKW.addEventListener('click', ()=>
{
    filterBy("klasse", "GKW");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

// Button Filter-Klasse-Sonstige2-click

dropdownItemSonstige2.addEventListener('click', ()=>
{
    filterBy("klasse", "Sonstige");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

// Button Filter-Klasse-Unbekannt2-click

dropdownItemUnbekannt2.addEventListener('click', ()=>
{
    filterBy("klasse", "Unbekannt");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKlasse;
    this.activeButton.classList.add('active');
});

//--------------------------------------
// Button Filter-Kategorie-Kleinwagen-click

dropdownItemKleinwagen.addEventListener('click', ()=>
{
    filterBy("kategorie", "Kleinwagen");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Cabrio-click

dropdownItemCabrio.addEventListener('click', ()=>
{
    filterBy("kategorie", "Cabrio");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Coupe-click

dropdownItemCoupe.addEventListener('click', ()=>
{
    filterBy("kategorie", "Coupé");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-SUV-click

dropdownItemSUV.addEventListener('click', ()=>
{
    filterBy("kategorie", "SUV_Gelaendewagen");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Pickup-click

dropdownItemPickup.addEventListener('click', ()=>
{
    filterBy("kategorie", "Pickup");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Combi-click

dropdownItemCombi.addEventListener('click', ()=>
{
    filterBy("kategorie", "Combi");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Limousine-click

dropdownItemLimousine.addEventListener('click', ()=>
{
    filterBy("kategorie", "Limousine");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Van-click

dropdownItemVan.addEventListener('click', ()=>
{
    filterBy("kategorie", "Van_Kleinbus");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Transporter-click

dropdownItemTransporter.addEventListener('click', ()=>
{
    filterBy("kategorie", "Transporter");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Elektroauto-click

dropdownItemElektroauto.addEventListener('click', ()=>
{
    filterBy("kategorie", "Elektroauto");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Sportwagen-click

dropdownItemSportwagen.addEventListener('click', ()=>
{
    filterBy("kategorie", "Sportwagen");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Oldtimer-click

dropdownItemOldtimer.addEventListener('click', ()=>
{
    filterBy("kategorie", "Oldtimer");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Sonstige3-click

dropdownItemSonstige3.addEventListener('click', ()=>
{
    filterBy("kategorie", "Sonstige");
    this.activeButton.classList.remove('active');
    this.activeButton = buttonFilterKategorie;
    this.activeButton.classList.add('active');
});

// Button Filter-Kategorie-Unbekannt3-click

dropdownItemUnbekannt3.addEventListener('click', ()=>
{
    filterBy("kategorie", "Unbekannt");
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

//--------------------------------------
// Functions 

function datenLaden()
{
    ApiAusgabenstelleGetList((response) =>
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

        ApiKraftfahrzeugGetList((response) => 
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

            ApiBilderGetAllKfzList((response) =>
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

function filterBy(by, value)
{
    ApiKraftfahrzeugFilterBy((response) => 
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

            ApiBilderGetSpecificKfzList((response) =>
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

//--------------------------------------
// APIs

function ApiAusgabenstelleGetList(successCallback, errorCallback)
{
    fetch(apiBaseUrl + 'ausgabenstelle', 
    {
        method: 'GET',
        credentials: 'include'
    })
    .then((response) => 
    {
        if (response.status == 200)
        {
            return response.json();
        } 
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .then(successCallback)
    .catch(errorCallback);
}

function ApiBilderGetSpecificKfzList(successCallback, errorCallback, kfzList)
{
    fetch(apiBaseUrl + 'bilder/specifickfz/' + kfzList, 
    {
        method: 'GET',
    })
    .then((response) => 
    {
        if (response.status == 200) 
        {
            return response.json();
        }
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .then(successCallback)
    .catch(errorCallback);
}

function ApiKraftfahrzeugGetList(successCallback, errorCallback) 
{
    fetch(apiBaseUrl + 'kraftfahrzeug', 
    {
        method: 'GET',
        credentials: 'include'
    })
    .then((response) => 
    {
        if (response.status == 200)
        {
            return response.json();
        } 
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .then(successCallback)
    .catch(errorCallback);
}

function ApiBilderGetAllKfzList(successCallback, errorCallback)
{
    fetch(apiBaseUrl + 'bilder/kfz', 
    {
        method: 'GET',
        credentials: 'include'
    })
    .then((response) => 
    {
        if (response.status == 200) 
        {
            return response.json();
        }
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .then(successCallback)
    .catch(errorCallback);
}

function ApiKraftfahrzeugFilterBy(successCallback, errorCallback, by, value) 
{
    fetch(apiBaseUrl + 'kraftfahrzeug/filter/' + by + '/' + value, 
    {
        method: 'GET',
        cache: 'no-cache',
        credentials: 'include'
    })
    .then((response)=>
    {
        if (response.status == 200 || response.status == 401)
        {
            return response.json();
        } 
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    }).then(successCallback)
    .catch(errorCallback);
}