import Helper from "./helper.js";

export default class PageTransactionDetails 
{
	constructor(args) 
	{
		this.app = args.app;

		args.app.Body.style.paddingBottom = '60px';
		args.app.LoadHTML('./page-transaction-details.html', args.app.Main, () => 
		{
            //Initialisierung
            // Allgemein
            const inputBeschreibung = this.app.Main.querySelector('#inputBeschreibung');
            const divAbholortBody = this.app.Main.querySelector('#divAbholortBody');
            const selectAbholort = this.app.Main.querySelector('#selectAbholort');
            const divRowRueckgabeort = this.app.Main.querySelector('#divRowRueckgabeort');
            const divRueckgabeortBody = this.app.Main.querySelector('#divRueckgabeortBody');
            const selectRueckgabeort = this.app.Main.querySelector('#selectRueckgabeort');
            const inputDateAbholdatum = this.app.Main.querySelector('#inputDateAbholdatum');
            const inputTimeAbholzeit = this.app.Main.querySelector('#inputTimeAbholzeit');
            const inputDateRueckgabedatum = this.app.Main.querySelector('#inputDateRueckgabedatum');
            const inputTimeRueckgabezeit = this.app.Main.querySelector('#inputTimeRueckgabezeit');
            const divGesamtpreis = document.querySelector('#divGesamtpreis');
            
            // Kunde
            const inputVorname = document.querySelector('#inputVorname');
            const inputNachname = document.querySelector('#inputNachname');
            const imgKunde = document.querySelector('#imgKunde');

            // Kraftfahrzeug
			const divKraftfahrzeugJahre = this.app.Main.querySelector('#divKraftfahrzeugJahre');
            const divMarkeKraftfahrzeug = document.querySelector('#divMarkeKraftfahrzeug');
            const divModellKraftfahrzeug = document.querySelector('#divModellKraftfahrzeug');
            const divKennzeichenKraftfahrzeug = document.querySelector('#divKennzeichenKraftfahrzeug');
            const divMietpreisKraftfahrzeug = document.querySelector('#divMietpreisKraftfahrzeug');
            const divKlasseKraftfahrzeug = document.querySelector('#divKlasseKraftfahrzeug');
            const divKategorieKraftfahrzeug = document.querySelector('#divKategorieKraftfahrzeug');
            const imgKraftfahrzeug = document.querySelector('#imgKraftfahrzeug');
            const tableSchadenList = document.querySelector('#tableSchadenList');
            const divKraftfahrzeug = document.querySelector('#divKraftfahrzeug');

            // Anhaenger
            const divMarkeAnhaenger = document.querySelector('#divMarkeAnhaenger');
            const divModellAnhaenger = document.querySelector('#divModellAnhaenger');
            const divKennzeichenAnhaenger = document.querySelector('#divKennzeichenAnhaenger');
            const divMietpreisAnhaenger = document.querySelector('#divMietpreisAnhaenger');
            const divKlasseAnhaenger = document.querySelector('#divKlasseAnhaenger');
            const divKategorieAnhaenger = document.querySelector('#divKategorieAnhaenger');
            const imgAnhaenger = document.querySelector('#imgAnhaenger');    
            const divAnhaenger = document.querySelector('#divAnhaenger');

            // Buttons
            const buttonClientDetails = this.app.Main.querySelector('#buttonClientDetails');
            const buttonKraftfahrzeugDetails = this.app.Main.querySelector('#buttonKraftfahrzeugDetails');
            const buttonKraftfahrzeugAendern = this.app.Main.querySelector('#buttonKraftfahrzeugAendern');
            const buttonAnhaengerAendern = this.app.Main.querySelector('#buttonAnhaengerAendern');
            const buttonBewegungSpeichern = this.app.Main.querySelector('#buttonBewegungSpeichern');
            const buttonBewegungAbbrechen = this.app.Main.querySelector('#buttonBewegungAbbrechen');

            // Hiding the ID for security
            history.replaceState({}, null, "./index.html#transactiondetails");

			// Initialisierung
			var kfzbild = {};

			if(args.bid)
			{
				let bewegung_id = parseInt(args.bid);
				this.bewegungLaden(bewegung_id);
			}

            // Event Listeners
            buttonBewegungSpeichern.addEventListener('click', () =>
            {
                this.app.ApiBewegungSet(() =>
                {
                    console.log("Daten wurden erfolgreich geschickt!");
                    location.hash = '#transactions';
                }, (ex) =>
                {
                    alert(ex);
                }, this.bewegung);
            });

            buttonBewegungAbbrechen.addEventListener('click', () =>
            {
                if(document.cookie)
                {
                    const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];
                    this.app.ApiBenutzerGet((response) =>
                    {
                        if(response.benutzer.rolle == 4 || response.benutzer.rolle == 1)
                        {
                            location.hash = '#transactions';
                        }
                        else
                        {
                            location.hash = "#main";
                        }
                    }, (ex) =>
                    {
    
                    }, benutzerMerkmal);
                }  
            });

            buttonClientDetails.addEventListener('click', () =>
            {
                let users_id = this.bewegung.users_id;
                window.open('#profile?pid=' + users_id, '_self');
            });

            buttonKraftfahrzeugDetails.addEventListener('click', () =>
            {
                let kraftfahrzeug_id = this.bewegung.kraftfahrzeug_id;
                window.open('#cardetails?kid=' + kraftfahrzeug_id, '_self');
            });

            buttonKraftfahrzeugAendern.addEventListener('click', () =>
            {
                localStorage.setItem('rentObject', JSON.stringify(this.bewegung));
                window.open('#carsoffice', '_self');
            });

            buttonAnhaengerAendern.addEventListener('click', () =>
            {
                localStorage.setItem('rentObject', JSON.stringify(this.bewegung));
                window.open('#traileroffice', '_self');
            });

		}); // LoadHTML
	} // constructor

	//----------------------------------------------------------------------------------------
	// Anzeige

    bewegungLaden(bewegung_id) 
	{
		this.app.ApiBewegungGet((response) => 
		{
            const dateFormatter = new Intl.DateTimeFormat('de-AT', 
            {
                dateStyle: 'short'
            });

			this.bewegung = response;

            // Load options into the select elements
            this.loadOptions();
		}, (ex) => 
		{
			alert(ex);
		}, bewegung_id);
	}

    // schaden anzeigen
    schadenListAnzeigen() 
    {
        const tableSchadenList = document.querySelector('#tableSchadenList');
        const trSchadenHeader = document.querySelector('#trSchadenHeader');
        const dateFormatter = new Intl.DateTimeFormat('de-AT', 
        {
            dateStyle: 'medium'
        });
        let html = '';

        this.app.ApiSchadenGetKfzList((response) => 
        {
            let iterator = 1;
            for (let schadenitem of response) 
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
                </tr>
                `;
                iterator++;
            }
            tableSchadenList.innerHTML = html;

            // Anhaenger daten laden
            this.anhaengerLaden();
        }, (ex) => 
        {
            alert(ex);
        }, this.bewegung.kraftfahrzeug_id);	
    }

    anhaengerLaden()
    {
        if(this.bewegung.anhaenger_id != null)
        {
            this.app.ApiAnhaengerGet((response) => 
            {
                divMarkeAnhaenger.innerHTML = response.marke;
                divModellAnhaenger.innerHTML = response.modell;
                divKennzeichenAnhaenger.innerHTML = response.kennzeichen;
                divMietpreisAnhaenger.innerHTML = response.mietpreis;
                divKategorieAnhaenger.innerHTML = response.kategorie;
                
                // Kfz Bild anzeigen
                this.app.ApiBilderGetAnhaenger((response) =>
                {
                    if(response != null && response.length > 0)
                    {
                        let bildliste = response;
                        imgAnhaenger.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
                    }
                }, (ex) => 
                {
                    alert(ex);
                }, this.bewegung.anhaenger_id);
            }, (ex) => 
            {
                alert(ex);
            }, this.bewegung.anhaenger_id);
        }
        else
        {
            divAnhaenger.innerHTML = `<h3>KundIn hatte keinen Anhänger bestellt.</h3>`;
        }
    }

    kundenDatenLaden()
    {
        this.app.ApiBenutzerGetById((response) => 
        {
            inputVorname.value = response.benutzer.vorname;
            inputNachname.value = response.benutzer.nachname;
            
            // Kunden Bild anzeigen
            this.app.ApiBilderGetBenutzerList((response) =>
            {
                if(response != null && response.length > 0)
                {
                    let bildliste = response;
                    imgKunde.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
                }
                
                // Kraftfahrzeug Daten anzeigen
                if(this.bewegung.kraftfahrzeug_id != null)
                {
                    this.app.ApiKraftfahrzeugGet((response) =>
                    {
                        divMarkeKraftfahrzeug.innerHTML = response.marke;
                        divModellKraftfahrzeug.innerHTML = response.modell;
                        divKennzeichenKraftfahrzeug.innerHTML = response.kennzeichen;
                        divMietpreisKraftfahrzeug.innerHTML = response.mietpreis;
                        divKlasseKraftfahrzeug.innerHTML = response.klasse;
                        divKategorieKraftfahrzeug.innerHTML = response.kategorie;

                        // Kraftfahrzeug Bild laden
                        this.app.ApiBilderGetKfzList((response) =>
                        {
                            if(response != null && response.length > 0)
                            {
                                let bildliste = response;
                                imgKraftfahrzeug.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
                            }

                            // Schadenliste anzeigen
                            this.schadenListAnzeigen();
                        }, (ex) => 
                        {
                            alert(ex);
                        }, this.bewegung.kraftfahrzeug_id);
                    }, (ex) => 
                    {
                        alert(ex);
                    }, this.bewegung.kraftfahrzeug_id);
                }
                else
                {
                    divKraftfahrzeug.innerHTML = `<h3>KundIn hatte kein Kraftfahrzeug bestellt.</h3>`;

                    // continue with anhaenger daten here
                    this.anhaengerLaden();
                }
            }, (ex) => 
            {
                alert(ex);
            }, this.bewegung.users_id);
        }, (ex) => 
        {
            alert(ex);
        }, this.bewegung.users_id);
    }

    loadOptions()
    {
        const divAbholortBody = document.querySelector('#divAbholortBody');
        const divRueckgabeortBody = document.querySelector('#divRueckgabeortBody');

        // Retrieving rentObject from the local storage
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

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

                    // Start loading the rest of the data
                    this.loadData();
                });
            }, (ex) => 
            {
                alert(ex);
            }, this.kraftfahrzeug.marke, this.kraftfahrzeug.modell);            
        }, (ex) => 
        {
            alert(ex);
        }, this.bewegung.kraftfahrzeug_id);
    }

    loadData()
    {
        // Auftragsdaten auffüllen
        // Retrieving rentObject from the local storage
        this.rentObject = JSON.parse(localStorage.getItem('rentObject'));

        if(this.bewegung)
        {
            if(this.bewegung.beschreibung != null)
            {
                inputBeschreibung.value = this.bewegung.beschreibung;
            }

            if(this.bewegung.abholort != null)
            {
                selectAbholort.value = this.bewegung.abholort;
            }
            
            if(this.bewegung.rueckgabeort != null)
            {
                selectRueckgabeort.value = this.bewegung.rueckgabeort;
            }
            if(this.bewegung.abholort != null)
            {
                selectAbholort.value = this.bewegung.abholort;
            }

            if(this.bewegung.abholdatum != null)
            {
                inputDateAbholdatum.value = this.bewegung.abholdatum.split('T')[0]; 
            }
            if(this.bewegung.abholzeit != null)
            {
                inputTimeAbholzeit.value = this.bewegung.abholzeit;
            }
            if(this.bewegung.rueckgabedatum != null)
            {
                inputDateRueckgabedatum.value = this.bewegung.rueckgabedatum.split('T')[0];
            }
            if(this.bewegung.rueckgabezeit != null)
            {
                inputTimeRueckgabezeit.value = this.bewegung.rueckgabezeit;
            }

            this.kundenDatenLaden();
        }
    }
}