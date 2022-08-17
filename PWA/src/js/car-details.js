const apiBaseUrl = 'http://localhost:59968/api/';

const imgContainer = document.querySelector('#imgContainer');
const buttonKfzMieten = document.querySelector('#buttonKfzMieten');
const buttonKfzZurueck = document.querySelector('#buttonKfzZurueck');
const modalSchadenBody = document.querySelector('#modalSchadenBody');
const buttonSchadenNeu = document.querySelector('#buttonSchadenNeu');
const dialogSchaden = new bootstrap.Modal(modalSchadenBody);
const buttonModalSchadenSpeichern = document.querySelector('#buttonModalSchadenSpeichern');
const labelAnfallendeKosten = document.querySelector('#labelAnfallendeKosten');
const selectSchadenArt = document.querySelector('#selectSchadenArt');
const labelBeschreibung = document.querySelector('#labelBeschreibung');	
const divDateSchaden = document.querySelector('#divDateSchaden');
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
// drag & drop Bild
imgContainer.addEventListener('dragover', (event) => 
{
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
});

imgContainer.addEventListener('drop', (event) => 
{
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    this.bild = fileList[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event) => 
    {
        // convert the image into a base64 string that can be saved as Byte[].
        let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        kfzbild.bild_bytes = base64String;

        imgBild.src = event.target.result;	
    });
    reader.readAsDataURL(fileList[0]);
});

imgContainer.addEventListener('click', (event) =>
{

});

//-------------------------------------------------------------
// speichern
buttonKfzMieten.addEventListener('click', (e) => 
{
    const inputMarke = document.querySelector('#inputMarke');
    const inputModell = document.querySelector('#inputModell');
    const inputKennzeichen = document.querySelector('#inputKennzeichen');
    const inputMietpreis = document.querySelector('#inputMietpreis');
    const inputBaujahr = document.querySelector('#inputBaujahr');
    const inputKlasse = document.querySelector('#inputKlasse');
    const inputKategorie = document.querySelector('#inputKategorie');

    location.hash = '#carlist';
});

//-------------------------------------------------------------
// Vorgang abbrechen
buttonKfzZurueck.addEventListener('click', (e) =>
{
    window.open('http://localhost:5500/src/car-list.html', '_self');
});

//------------------------------------------------------------------------------------------
// alles rund um den Schaden


//---------------------------
buttonSchadenNeu.addEventListener( 'click', (e) => 
{
    labelAnfallendeKosten.value = '';
    selectSchadenArt.value = '0';
    labelBeschreibung.value = '';
    this.schaden = null;
    labelAnfallendeKosten.classList.remove('is-invalid', 'is-valid');
    selectSchadenArt.classList.remove('is-invalid', 'is-valid');

    dialogSchaden.show();
});

//---------------------------
buttonModalSchadenSpeichern.addEventListener('click', (e) => 
{
    let schadensArtText = "Unbekannt";
    let saveOk = true;
    labelAnfallendeKosten.classList.remove('is-invalid', 'is-valid');
    selectSchadenArt.classList.remove('is-invalid', 'is-valid');

    if (!labelAnfallendeKosten.value || (labelAnfallendeKosten.value && isNaN(labelAnfallendeKosten.value))) 
    {
        saveOk = false;
        labelAnfallendeKosten.classList.add('is-invalid');
    }
    else labelAnfallendeKosten.classList.add('is-valid');

    if (selectSchadenArt.value == '0') 
    {
        saveOk = false;
        selectSchadenArt.classList.add('is-invalid');
    }
    else selectSchadenArt.classList.add('is-valid');

    if (saveOk) 
    {
        if (!this.schaden) 
        {
            this.schaden = 
            {
                schaden_id: null,
                schaden_datum: new Date()
            };
        }
        schadensArtText = selectSchadenArt.options[selectSchadenArt.selectedIndex].text;
        this.schaden.kraftfahrzeug_id = parseInt(args.kid);
        this.schaden.anfallendekosten = (labelAnfallendeKosten.value && !isNaN(labelAnfallendeKosten.value) ? parseInt(labelAnfallendeKosten.value) : 0);
        this.schaden.schadensart = schadensArtText;
        this.schaden.beschreibung = labelBeschreibung.value;

        if(divDateSchaden.value == "")
        {
            this.schaden.schaden_datum = null;
        }
        else
        {
            this.schaden.schaden_datum = divDateSchaden.value;
        }
        
        if(!this.kraftfahrzeug)
        {
            this.kraftfahrzeug = null;
            if (!this.kraftfahrzeug.schadenlist)
            {
                this.kraftfahrzeug.schadenlist = [];
            } 
        }
        
        this.kraftfahrzeug.schadenlist.push(this.schaden);
        

        // Update the database.
        ApiSchadenSet(() => 
        {
            console.log("database was updated!");
            if (this.bild) 
            {
                this.bild.schaden_id = this.schaden.schaden_id;
                ApiSchadenSetBild(() => 
                {
                    datenLaden(this.kraftfahrzeug.kraftfahrzeug_id);
                }, (ex) => 
                {
                    alert(ex);
                }, this.bild);
            }
            else
            {
                datenLaden(this.kraftfahrzeug.kraftfahrzeug_id);
            }
        }, (ex) => 
        {
            alert(ex);
        }, this.schaden);

        dialogSchaden.hide();
    }
});

//---------------------------
tableSchadenList.addEventListener('click', (e) => 
{
    let btn = null;
    if (e.target.nodeName.toUpperCase() == 'PATH' && e.target.parentElement.nodeName.toUpperCase() == 'SVG' && e.target.parentElement.parentElement.nodeName == 'BUTTON')
    {
        btn = e.target.parentElement.parentElement;
    } 
    else if (e.target.nodeName.toUpperCase() == 'SVG' && e.target.parentElement.nodeName == 'BUTTON')
    {
        btn = e.target.parentElement;
    } 
    else if (e.target.nodeName == 'BUTTON') 
    {
        btn = e.target;
    }

    if (btn) 
    {
        if (confirm('Wollen Sie den Schadenseintrag wirklich löschen?')) 
        {
            let id = parseInt(btn.id.split('_')[1], 10);

            ApiSchadenDelete(() => 
            {
                console.log("entry was deleted!");
                datenLaden(this.kraftfahrzeug.kraftfahrzeug_id);
            }, (ex) => 
            {
                alert(ex);
            }, id);
        }	
    }
    else if (e.target.nodeName == 'TD') 
    {
        let idx = parseInt(e.target.parentElement.dataset.schadenIdx);
        this.schaden = this.kraftfahrzeug.schadenlist[idx];
        labelAnfallendeKosten.value = this.schaden.anfallendekosten;
        selectSchadenArt.value =  new Helper().SchadensArtConverter(this.schaden.schadensart);
        labelBeschreibung.value = this.schaden.beschreibung;
        divDateSchaden.Value = new Date(this.schaden.schaden_datum); // WIP: does not show the date in the Modal!

        dialogSchaden.show();
    }
});

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
            let iterator = 0;
            for (let schadenitem of this.kraftfahrzeug.schadenlist) 
            {
                html += 
                `
                <tr data-schaden-idx="${iterator}">
                    <th scope="row">
                        <button type="button" class="btn btn-sm" id="buttonSchadenDel_${schadenitem.schaden_id}"><span class="iconify" data-icon="mdi-delete"></span></button>
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