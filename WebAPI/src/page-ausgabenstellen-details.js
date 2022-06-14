import Helper from "./helper.js";

export default class PageAusgabenstellenDetails
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-ausgabenstellen-details.html', args.app.Main, () => 
		{
			const buttonAusgabenstelleSpeichern = args.app.Main.querySelector('#buttonAusgabenstelleSpeichern');
			const buttonAusgabenstelleAbbrechen = args.app.Main.querySelector('#buttonAusgabenstelleAbbrechen');
			const buttonKfzAdd = args.app.Main.querySelector('#buttonKfzAdd');
			const modalKfzList = args.app.Main.querySelector('#modalKfzList');
			const dialogKfzList = new bootstrap.Modal(modalKfzList);
			const modalKfzListBody = args.app.Main.querySelector('#modalKfzListBody');
			const buttonAnhaengerAdd = args.app.Main.querySelector('#buttonAnhaegerAdd');
			const buttonModalKfzSpeichern = args.app.Main.querySelector('#buttonModalKfzSpeichern');
			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');


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
					this.ausgabenstelle.ausgabenstelle_adresse = inputStrasse.value + 'QXZ ' + inputHausnummer.value + ',QXZ ' + inputPLZ.value + 'QXZ ' + inputStadt.value + ',QXZ ' + inputLand.value; 	

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
						if(args.asid)
						{
							this.app.ApiAdresseSet(()=>
							{
								console.log("Address has been set!");
							}, (ex) =>
							{
								alert(ex);
							}, this.adresse);
						}
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

			//-------------------------------------------------------------
			// KfZ zur Ausgabenstelle hinzufügen

			buttonKfzAdd.addEventListener('click', (e) =>
			{
				this.kraftfahrzeuglist = null;
				this.app.ApiKraftfahrzeugGetList((response) => 
				{
					let html = '';
					let iterator = 1;
					this.Helper = new Helper();
					for (let kraftfahrzeug of response) 
					{
						html += 
						`
						<tr data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}">
							<th scope="row">${iterator}</th>
							<td>${kraftfahrzeug.marke}</td>
							<td>${kraftfahrzeug.modell}</td>
							<td>${this.Helper.GegenstandZustandConverter(kraftfahrzeug.gegenstandzustand)}</td>
							<td>${kraftfahrzeug.aktuellerstandort}</td>
							<td>${kraftfahrzeug.mietpreis}</td>
							<td>${kraftfahrzeug.kennzeichen}</td>
						`;
						if(this.ausgabenstelle.ausgabenstelle_id == kraftfahrzeug.ausgabenstelle_id)
						{
							html += `
									<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}" checked></th>
									</tr>
									`;
						}
						else
						{
							html += `
									<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}"></th>
									</tr>
									`;
						}
						iterator++;
					}
		
					modalKfzListBody.innerHTML = html;
				}, (ex) => 
				{
					alert(ex);
				});
				dialogKfzList.show();
			});

			// Modal Button checkboxAll-click

			this.checkboxAll.addEventListener('click', ()=>
			{
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				let selected = this.checkboxAll.checked;
				for(let checkbox of checkboxCollection) 
				{    
					checkbox.checked = selected; 
				}
			});

			// Modal Speichern Button-click

			buttonModalKfzSpeichern.addEventListener('click', ()=>
			{
				
			});
        });
    }

    datenLaden(ausgabenstelle_id) 
	{
		this.app.ApiAusgabenstelleGet((response) => 
		{
			this.ausgabenstelle = response;

			let subString = this.ausgabenstelle.ausgabenstelle_adresse.split('QXZ');
			try
			{
				inputBezeichnung.value = this.ausgabenstelle.ausgabenstelle_bezeichnung;
				inputHausnummer.value = subString[1].replace(',','');
				inputStrasse.value = subString[0];
				inputPLZ.value = subString[2];
				inputStadt.value = subString[3].replace(',','');
				inputLand.value = subString[4];

				this.KfzUndAnhaengerListAnzeigen();

			}
			catch(ex)
			{
				console.log("Can not display string of different system!");
			}
		}, (ex) => 
		{
			alert(ex);
		}, ausgabenstelle_id);
	}

	//----------------------------------------------------------------------------------------
	// Anzeige

	// alle Kraftfahrzeuge in der Ausgabestelle anzeigen
	KfzUndAnhaengerListAnzeigen() 
	{
		const trKfzHeader = this.app.Main.querySelector('#trKfzHeader');
		const accordionPanelKfzBody = this.app.Main.querySelector('#accordionPanelKfzBody');
		const tbodyKfzList = this.app.Main.querySelector('#tbodyKfzList');

		let html = '';

		if(typeof this.ausgabenstelle != "undefined")
		{
			this.app.ApiGetKraftfahrzeugListByAusgabenstelle((response) => 
			{
				this.ausgabenstelle.kraftfahrzeuglist = response;
				let iterator = 0;
				for (let kfzitem of this.ausgabenstelle.kraftfahrzeuglist) 
				{
					html += 
					`
					<tr data-kraftfahrzeug-idx="${iterator}">
						<th scope="row">
						<button type="button" class="btn btn-outline-dark btn-sm" id="buttonKraftfahrzeugRemove_${kfzitem.kraftfahrzeug_id}"><span class="iconify me-2" data-icon="mdi-delete"></span>Entfernen</button>
						</th>
						<td scope="col">${(kfzitem.marke ? kfzitem.marke : '&nbsp;')}</td>
						<td scope="col">${(kfzitem.modell ? kfzitem.modell : '&nbsp;')}</td>
						<td scope="col">${(kfzitem.gegenstandzustand? this.Helper.GegenstandZustandConverter(kfzitem.gegenstandzustand) : '&nbsp;')}</td>
						<td scope="col">${(kfzitem.mietpreis ? kfzitem.mietpreis : '&nbsp;')}</td>
					</tr>
					`;
					iterator++;
				}
				tbodyKfzList.innerHTML = html;

				this.anhaengerListAnzeigen() 
			}, (ex) => 
			{
				alert(ex);
			}, this.ausgabenstelle.ausgabenstelle_id);
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

	// alle Anhänger in der Ausgabestelle anzeigen
	anhaengerListAnzeigen() 
	{
		const accordionPanelAnhaengerBody = this.app.Main.querySelector('#accordionPanelAnhaengerBody');
		const tbodyAnhaengerList = this.app.Main.querySelector('#tbodyAnhaengerList');
		const trAnhaengerHeader = this.app.Main.querySelector('#trAnhaengerHeader');

		let html = '';
		this.Helper = new Helper();

		if(typeof this.ausgabenstelle != "undefined")
		{
			this.app.ApiGetAnhaengerListByAusgabenstelle((response) => 
			{
				this.ausgabenstelle.anhaengerlist = response;
				let iterator = 0;
				for (let anhaengeritem of this.ausgabenstelle.anhaengerlist) 
				{
					html += 
					`
					<tr data-anhaenger-idx="${iterator}">
						<th scope="row">
							<button type="button" class="btn btn-outline-dark btn-sm" id="buttonAnhaengerRemove_${anhaengeritem.anhaenger_id}"><span class="iconify me-2" data-icon="mdi-delete"></span>Entfernen</button>
						</th>
						<td scope="col">${(anhaengeritem.marke ? anhaengeritem.marke : '&nbsp;')}</td>
						<td scope="col">${(anhaengeritem.modell ? anhaengeritem.modell : '&nbsp;')}</td>
						<td scope="col">${(anhaengeritem.gegenstandzustand? this.Helper.GegenstandZustandConverter(anhaengeritem.gegenstandzustand) : '&nbsp;')}</td>
						<td scope="col">${(anhaengeritem.mietpreis ? anhaengeritem.mietpreis : '&nbsp;')}</td>
					</tr>
					`;
					iterator++;
				}
				tbodyAnhaengerList.innerHTML = html;
			}, (ex) => 
			{
				alert(ex);
			}, this.ausgabenstelle.ausgabenstelle_id);
		}
		else
		{
			html = 
			`
			<td>Erzeugen Sie bitte eine Ausgabenstelle um die Anhänger eintragen zu können!</td>
			`
			trAnhaengerHeader.innerHTML = html;
		}		
	}
}