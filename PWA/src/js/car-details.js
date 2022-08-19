const apiBaseUrl = 'http://localhost:59968/api/';

const imgContainer = document.querySelector('#imgContainer');
const buttonKfzMieten = document.querySelector('#buttonKfzMieten');
const buttonKfzZurueck = document.querySelector('#buttonKfzZurueck');
const modalSchadenBody = document.querySelector('#modalSchadenBody');
const buttonModalSchadenSpeichern = document.querySelector('#buttonModalSchadenSpeichern');	
const imgBild = document.querySelector('#imgBild');
const spanKraftfahrzeugJahre = document.querySelector('#spanKraftfahrzeugJahre');

// Initialisierung
var kfzbild = {};

var kid = localStorage.getItem("kid");
 
if(kid)
{
    let kraftfahrzeug_id = parseInt(kid);
    datenLaden(kraftfahrzeug_id);
}
else
{
    schadenListAnzeigen(); 
}

//-------------------------------------------------------------
// KfZ Mieten

buttonKfzMieten.addEventListener('click', (e) => 
{
    const inputMarke = document.querySelector('#inputMarke');
    const inputModell = document.querySelector('#inputModell');
    const inputKennzeichen = document.querySelector('#inputKennzeichen');
    const inputMietpreis = document.querySelector('#inputMietpreis');
    const inputBaujahr = document.querySelector('#inputBaujahr');
    const inputKlasse = document.querySelector('#inputKlasse');
    const inputKategorie = document.querySelector('#inputKategorie');

    window.open('http://localhost:5500/src/rent-step-one.html', '_self');
});

//-------------------------------------------------------------
// Vorgang abbrechen

buttonKfzZurueck.addEventListener('click', (e) =>
{
    window.open('http://localhost:5500/src/car-list.html', '_self');
});

//------------------------------------------------------------------------------------------
// alles rund um den Schaden


//-------------------------------------------------------------
// Functions

function datenLaden(kraftfahrzeug_id) 
{
    ApiKraftfahrzeugGet((response) => 
    {
        let currentYear = new Date().getFullYear();
        this.kraftfahrzeug = response;

        //const bildliste = response.bildliste;

        inputMarke.value = this.kraftfahrzeug.marke;
        inputModell.value = this.kraftfahrzeug.modell;
        inputKennzeichen.value = this.kraftfahrzeug.kennzeichen;
        inputMietpreis.value = this.kraftfahrzeug.mietpreis;
        inputBaujahr.value = this.kraftfahrzeug.baujahr;
        spanKraftfahrzeugJahre.textContent = (currentYear - inputBaujahr.value).toString();
        if(this.kraftfahrzeug.klasse == null)
        {
            inputKlasse.value = 'unbekannt';
        }
        else
        {
            inputKlasse.value = this.kraftfahrzeug.klasse;
        }
        
        if(this.kraftfahrzeug.kategorie == null)
        {
            inputKategorie.value = 'unbekannt';
        }
        else
        {
            inputKategorie.value = this.kraftfahrzeug.kategorie;
        }
        
        // Kfz Bild anzeigen
        ApiBilderGetKfzList((response) =>
        {
            if(response != null && response.length > 0)
            {
                let bildliste = response;
                imgBild.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
            }
            schadenListAnzeigen();
        }, (ex) => 
        {
            alert(ex);
        }, this.kraftfahrzeug.kraftfahrzeug_id);
    }, (ex) => 
    {
        alert(ex);
    }, kraftfahrzeug_id);
}

//----------------------------------------------------------------------------------------
// Anzeige

// schaden anzeigen
function schadenListAnzeigen() 
{
    const tableSchadenList = document.querySelector('#tableSchadenList');
    const trSchadenHeader = document.querySelector('#trSchadenHeader');
    const dateFormatter = new Intl.DateTimeFormat('de-AT', 
    {
        dateStyle: 'medium'
    });
    let html = '';

    if(typeof this.kraftfahrzeug != "undefined")
    {
        ApiSchadenGetKfzList((response) => 
        {
            this.kraftfahrzeug.schadenlist = response;
            let iterator = 1;
            for (let schadenitem of this.kraftfahrzeug.schadenlist) 
            {
                html += 
                `
                <tr data-schaden-idx="${iterator}">
                    <th scope="row">
                        ${iterator}
                    </th>
                    <td scope="col">${(schadenitem.schaden_datum ? dateFormatter.format(new Date(schadenitem.schaden_datum)) : '&nbsp;')}</td>
                    <td scope="col">${(schadenitem.schadensart ? schadenitem.schadensart : '&nbsp;')}</td>
                    <td scope="col">${(schadenitem.beschreibung? schadenitem.beschreibung : '&nbsp;')}</td>
                    <td scope="col">${(schadenitem.anfallendekosten ? schadenitem.anfallendekosten : '&nbsp;')}</td>
                </tr>
                `;
                iterator++;
            }
            tableSchadenList.innerHTML = html;
        }, (ex) => 
        {
            alert(ex);
        }, this.kraftfahrzeug.kraftfahrzeug_id);
    }
    else
    {
        html = 
        `
        <td>Erzeugen Sie bitte ein Fahrzeug um den Schaden eintragen zu können!</td>
        `
        trSchadenHeader.innerHTML = html;
    }		
}

//-------------------------------------------------------------
// APIs

function ApiKraftfahrzeugSet(successCallback, errorCallback, kraftfahrzeug) 
{
    fetch(apiBaseUrl + 'kraftfahrzeug' + (kraftfahrzeug.kraftfahrzeug_id ? '/' + kraftfahrzeug.kraftfahrzeug_id : ''), 
    {
        method: kraftfahrzeug.kraftfahrzeug_id ? 'PUT' : 'POST',
        cache: 'no-cache',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(kraftfahrzeug)
    })
    .then((response) => 
    {
        if (response.status == 200) 
        {
            return successCallback('Daten wurden erfolgreich geschickt!');
        }
        else if (response.status == 204) 
        {
            errorCallback('Daten sind unvollständig!');
        }
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .catch(errorCallback);
}

function ApiBilderSet(successCallback, errorCallback, bild)
{
    fetch(apiBaseUrl + 'bilder', 
    {
        method: bild.kraftfahrzeug_id ? 'PUT' : 'POST',
        cache: 'no-cache',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bild)
    })
    .then((response) => 
    {
        if (response.status == 200) 
        {
            return response.json();
        }
        else if (response.status == 204) 
        {
            errorCallback('Daten sind unvollständig!');
        }
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .then(successCallback)
    .catch(errorCallback);
}

function ApiSchadenSet(successCallback, errorCallback, schaden)
{
    fetch(apiBaseUrl + 'schaden', 
    {
        method: schaden.schaden_id ? 'PUT' : 'POST',
        cache: 'no-cache',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(schaden)
    })
    .then((response) => 
    {
        if (response.status == 200) 
        {
            return successCallback();
        }
        else if (response.status == 204) 
        {
            errorCallback('Daten sind unvollständig!');
        }
        else throw new Error(response.status + ' ' + response.statusText);
    })
    .catch(errorCallback);
}

function ApiSchadenGetKfzList(successCallback, errorCallback, kraftfahrzeug_id)
{
    fetch(apiBaseUrl + 'schaden/kfz/' + kraftfahrzeug_id, 
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

function ApiBilderGetKfzList(successCallback, errorCallback, kraftfahrzeug_id)
{
    fetch(apiBaseUrl + 'bilder/kfz/' + kraftfahrzeug_id, 
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

function ApiKraftfahrzeugGet(successCallback, errorCallback, kraftfahrzeug_id) 
{
    fetch(apiBaseUrl + 'kraftfahrzeug/' + kraftfahrzeug_id, 
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

function ApiSchadenDelete(successCallback, errorCallback, id) 
{
    fetch(apiBaseUrl + 'schaden/' + id, 
    {
        method: 'DELETE'
    })
    .then((response) => 
    {
        if (response.status == 200)
        {
            successCallback();
        } 
        else if (response.status == 204)
        {
            errorCallback('Daten unvollständig!');
        } 
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .catch(errorCallback);
}

// WIP: ApiSchadenSetBild needs to be implemented!