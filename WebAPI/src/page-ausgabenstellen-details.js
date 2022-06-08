export default class PageAusgabenstellenDetails
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-ausgabenstellen-details.html', args.app.Main, () => 
		{
			const buttonAusgabenstelleSpeichern = args.app.Main.querySelector('#buttonAusgabenstelleSpeichern');
			const buttonAusgabenstelleAbbrechen = args.app.Main.querySelector('#buttonAusgabenstelleAbbrechen');

			if(args.asid)
			{
				let ausgabenstelle_id = parseInt(args.asid);
				this.datenLaden(ausgabenstelle_id);
			}
			else
			{
				//this.schadenListAnzeigen(); 
			}

            //-------------------------------------------------------------
			// speichern
            buttonAusgabenstelleSpeichern.addEventListener('click', (e) => 
			{
                const inputBezeichnung = args.app.Main.querySelector('#inputBezeichnung');
                const inputLand = args.app.Main.querySelector('#inputLand');
                const inputStadt = args.app.Main.querySelector('#inputStadt');
                const inputPLZ = args.app.Main.querySelector('#inputPLZ');
                const inputStrasse = args.app.Main.querySelector('#inputStrasse');
                const inputHausnummer = args.app.Main.querySelector('#inputHausnummer');

				// Initialisierung 
				this.adresse = {};
				this.ausgabenstelle = {};

				if (inputBezeichnung.value) 
				{
					if(args.asid)
					{
                        this.ausgabenstelle.ausgabenstelle_id = parseInt(args.asid);
						this.adresse.ausgabenstelle_id = parseInt(args.asid);
					}
					else
					{
						this.ausgabenstelle = {};
					}
					
					this.ausgabenstelle.ausgabenstelle_bezeichnung = inputBezeichnung.value;
					this.ausgabenstelle.ausgabenstelle_adresse = inputStrasse.value + ' ' + inputHausnummer.value + ', ' + inputPLZ.value + ' ' + inputStadt.value + ', ' + inputLand.value; 	

					this.adresse.bezeichnung = inputBezeichnung.value;
					this.adresse.land = inputLand.value;
					this.adresse.stadt_ort = inputStadt.value;
					this.adresse.plz = inputPLZ.value;
                    this.adresse.strasse = inputStrasse.value;
                    this.adresse.strassennummer = inputHausnummer.value;

					this.app.ApiAusgabenstelleSet((response) => 
					{
						console.log(response);
						console.log("Issuing office has been set!");
						this.app.ApiAdresseSet(()=>
						{
							console.log("Address has been set!");
						}, (ex) =>
						{
							alert(ex);
						}, this.adresse);
					}, (ex) =>
					{
						alert(ex);
					}, this.ausgabenstelle);
				}
				else 
				{
					alert('Bezeichnung ist Pflicht!');
				}
				location.hash = '#issuingofficelist';
			});

            //-------------------------------------------------------------
			// Vorgang abbrechen
			buttonAusgabenstelleAbbrechen.addEventListener('click', (e) =>
			{
				location.hash = '#issuingofficelist';
			});
        });
    }

    datenLaden(ausgabenstelle_id) 
	{
		this.app.ApiAdresseGetOfAusgabenstelle((response) => 
		{
			this.adresse = response;

			inputBezeichnung.value = this.adresse.bezeichnung;
			inputLand.value = this.adresse.land;
			inputStadt.value = this.adresse.stadt_ort;
			inputPLZ.value = this.adresse.plz;
            inputStrasse.value = this.adresse.strasse;
            inputHausnummer.value = this.adresse.strassennummer;
		}, (ex) => 
		{
			alert(ex);
		}, ausgabenstelle_id);
	}

	//----------------------------------------------------------------------------------------
	// Anzeige

	// schaden anzeigen
	KfzListAnzeigen() 
	{
		const tableSchadenList = this.app.Main.querySelector('#tableSchadenList');
		const trSchadenHeader = this.app.Main.querySelector('#trSchadenHeader');
		const dateFormatter = new Intl.DateTimeFormat('de-AT', 
		{
			dateStyle: 'medium'
		});
		let html = '';

		if(typeof this.kraftfahrzeug != "undefined")
		{
			this.app.ApiSchadenGetKfzList((response) => 
			{
				this.kraftfahrzeug.schadenlist = response;
				let iterator = 0;
				for (let schadenitem of this.kraftfahrzeug.schadenlist) 
				{
					html += 
					`
					<tr data-idx="${iterator}">
						<td>
							<button type="button" class="btn btn-outline-light btn-sm" id="buttonSchadenDel_${schadenitem.schaden_id}"><span class="iconify" data-icon="mdi-delete"></span></button>
						</td>
						<td class="element-clickable">${(schadenitem.schaden_datum ? dateFormatter.format(new Date(schadenitem.schaden_datum)) : '&nbsp;')}</td>
						<td class="element-clickable">${(schadenitem.schadensart ? schadenitem.schadensart : '&nbsp;')}</td>
						<td class="element-clickable">${(schadenitem.beschreibung? schadenitem.beschreibung : '&nbsp;')}</td>
						<td class="element-clickable">${(schadenitem.anfallendekosten ? schadenitem.anfallendekosten : '&nbsp;')}</td>
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
}