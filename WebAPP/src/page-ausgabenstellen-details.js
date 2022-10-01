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
			const buttonAnhaengerAdd = args.app.Main.querySelector('#buttonAnhaengerAdd');
			const modalKfzList = args.app.Main.querySelector('#modalKfzList');
			const modalAnhaengerList = args.app.Main.querySelector('#modalAnhaengerList');
			const dialogKfzList = new bootstrap.Modal(modalKfzList);
			const dialogAnhaengerList = new bootstrap.Modal(modalAnhaengerList);
			const modalKfzListBody = args.app.Main.querySelector('#modalKfzListBody');
			const modalAnhaengerListBody = args.app.Main.querySelector('#modalAnhaengerListBody');
			const buttonModalKfzSpeichern = args.app.Main.querySelector('#buttonModalKfzSpeichern');
			const buttonModalAnhaengerSpeichern = args.app.Main.querySelector('#buttonModalAnhaengerSpeichern');
			this.checkboxAllKfz = this.app.Main.querySelector('#checkboxAllKfz');
			this.checkboxAllAnhaenger = this.app.Main.querySelector('#checkboxAllAnhaenger');

			// Hiding the ID for security
			history.replaceState({}, null, "./index.html#issuingofficedetails");

			if(args.asid)
			{
				var ausgabenstelle_id = parseInt(args.asid);
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
				this.Helper = new Helper();
				this.kraftfahrzeuglist = null;
				this.app.ApiKraftfahrzeugGetList((response) => 
				{
					let html = '';
					let iterator = 1;
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
									<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelectKfz" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}" checked></th>
									</tr>
									`;
						}
						else
						{
							html += `
									<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelectKfz" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}"></th>
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

			//-------------------------------------------------------------
			// Anhaenger zur Ausgabenstelle hinzufügen

			buttonAnhaengerAdd.addEventListener('click', (e) =>
			{
				this.Helper = new Helper();
				this.anhaengerlist = null;
				this.app.ApiAnhaengerGetList((response) => 
				{
					let html = '';
					let iterator = 1;
					for (let anhaenger of response) 
					{
						html += 
						`
						<tr data-anhaenger-id="${anhaenger.anhaenger_id}">
							<th scope="row">${iterator}</th>
							<td>${anhaenger.marke}</td>
							<td>${anhaenger.modell}</td>
							<td>${this.Helper.GegenstandZustandConverter(anhaenger.gegenstandzustand)}</td>
							<td>${anhaenger.aktuellerstandort}</td>
							<td>${anhaenger.mietpreis}</td>
							<td>${anhaenger.kennzeichen}</td>
						`;
						if(this.ausgabenstelle.ausgabenstelle_id == anhaenger.ausgabenstelle_id)
						{
							html += `
									<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelectAnhaenger" data-anhaenger-id="${anhaenger.anhaenger_id}" checked></th>
									</tr>
									`;
						}
						else
						{
							html += `
									<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelectAnhaenger" data-anhaenger-id="${anhaenger.anhaenger_id}"></th>
									</tr>
									`;
						}
						iterator++;
					}
		
					modalAnhaengerListBody.innerHTML = html;
				}, (ex) => 
				{
					alert(ex);
				});
				dialogAnhaengerList.show();
			});

			// Modal Button checkboxAll-KfZ-click

			this.checkboxAllKfz.addEventListener('click', ()=>
			{
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelectKfz');
				let selected = this.checkboxAllKfz.checked;
				for(let checkbox of checkboxCollection) 
				{    
					checkbox.checked = selected; 
				}
			});

			// Modal Button checkboxAll-Anhaenger-click

			this.checkboxAllAnhaenger.addEventListener('click', ()=>
			{
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelectAnhaenger');
				let selected = this.checkboxAllAnhaenger.checked;
				for(let checkbox of checkboxCollection) 
				{    
					checkbox.checked = selected; 
				}
			});

			// Modal KfZ Speichern Button-click

			buttonModalKfzSpeichern.addEventListener('click', ()=>
			{
				// initialisierung
				let listToUpdate =
				{
					listtoadd: [],
					listtoremove: []
				};
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelectKfz');
				for(let item of checkboxCollection) 
				{
					if(item.checked)
					{
						listToUpdate.listtoadd.push(item.dataset.kraftfahrzeugId);
					}
					else
					{
						listToUpdate.listtoremove.push(item.dataset.kraftfahrzeugId);
					}
				}

				this.app.ApiKraftfahrzeugSetAusgabenstelle(() =>
				{
					this.KfzUndAnhaengerListAnzeigen();
				}, (ex) =>
				{
					alert(ex);
				}, listToUpdate, ausgabenstelle_id);

				dialogKfzList.hide();
			});

			// Modal Anhaenger Speichern Button-click

			buttonModalAnhaengerSpeichern.addEventListener('click', ()=>
			{
				// initialisierung
				let listToUpdate =
				{
					listtoadd: [],
					listtoremove: []
				};
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelectAnhaenger');
				for(let item of checkboxCollection) 
				{
					if(item.checked)
					{
						listToUpdate.listtoadd.push(item.dataset.anhaengerId);
					}
					else
					{
						listToUpdate.listtoremove.push(item.dataset.anhaengerId);
					}
				}

				this.app.ApiAnhaengerSetAusgabenstelle(() =>
				{
					this.KfzUndAnhaengerListAnzeigen();
				}, (ex) =>
				{
					alert(ex);
				}, listToUpdate, ausgabenstelle_id);

				dialogAnhaengerList.hide();
			});

			//---------------------------
			// KfZ items entfernen

			tbodyKfzList.addEventListener('click', (e) => 
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

				if (e.target.nodeName == 'TD') 
				{
					let kraftfahrzeug_id = parseInt(e.target.parentElement.dataset.kraftfahrzeugId);
					window.open('#cardetails?kid=' + kraftfahrzeug_id, '_self');
				}
			});

			//---------------------------
			// Anhänger items entfernen

			tbodyAnhaengerList.addEventListener('click', (e) => 
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

				if (e.target.nodeName == 'TD') 
				{
					let anhaenger_id = parseInt(e.target.parentElement.dataset.anhaengerId);
					window.open('#trailerdetails?aid=' + anhaenger_id, '_self');
				}
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

		this.Helper = new Helper();
		let html = '';

		if(typeof this.ausgabenstelle != "undefined")
		{
			this.app.ApiGetKraftfahrzeugListByAusgabenstelle((response) => 
			{
				this.ausgabenstelle.kraftfahrzeuglist = response;
				let iterator = 1;
				for (let kfzitem of this.ausgabenstelle.kraftfahrzeuglist) 
				{
					html += 
					`
					<tr data-kraftfahrzeug-id="${kfzitem.kraftfahrzeug_id}">
						<th scope="row">${iterator}
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
			<td>Erzeugen Sie bitte eine Ausgabenstelle um ein Fahrzeug hinzufügen zu können!</td>
			`
			trKfzHeader.innerHTML = html;
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
				let iterator = 1;
				for (let anhaengeritem of this.ausgabenstelle.anhaengerlist) 
				{
					html += 
					`
					<tr data-anhaenger-id="${anhaengeritem.anhaenger_id}">
						<th scope="row">${iterator}
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