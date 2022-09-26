import "./app.js";

export default class PageFinishRent
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-finish-rent.html', args.app.Main, () => 
		{
			// Intilialisierung
			const buttonPdf = document.querySelector('#buttonPdf');

			// Logic
			this.loadData();

			// Event listeners
			buttonPdf.addEventListener('click', () =>
			{
				// options for html2pdf see: https://github.com/eKoopmans/html2pdf.js#options
				var opt = 
				{
					margin:       20,
					filename:     'Rechnung.pdf',
					image:        { type: 'jpeg', quality: 0.98 },
					html2canvas:  { scale: 2 },
					jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
			  	};
				var source = document.getElementById('toPDF');
				html2pdf(source, opt);

				// Update database
				this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
				this.rentObject.bewegung_finished = true;
				this.app.ApiRentObjectSet(() =>
				{
					console.log("Data sent successfuly!");
				}, (ex) =>
				{
					alert(ex);
				}, this.rentObject);
			});
		});
	}

    // functions
	loadData()
	{
		// Initialisierung
		const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];

		// logic
		this.app.ApiBenutzerGet((response) =>
		{
			if(response.success)
			{
				// Initialisierung
				const tableEmpfaengerDaten = document.querySelector('#tableEmpfaengerDaten');
				const tableRechnungInhalt = document.querySelector('#tableRechnungInhalt');
				const tableRechnungGesamt = document.querySelector('#tableRechnungGesamt');

				this.rentObject = JSON.parse(localStorage.getItem('rentObject'));
				this.benutzer = response.benutzer;
				this.benutzer.userid = response.benutzer.userid;

				// Obere Daten ausfüllen
				let today = new Date().toLocaleDateString('de-AT');
				let deadline = this.addDays(new Date(), 14).toLocaleDateString('de-AT');
				let html = `<tr>
							<td valign='top' width='35%' style='font-size:12px;'> <strong>${this.benutzer.vorname} ${this.benutzer.nachname}</strong><br /> 
								[Adresse]<br />
								[Adresse] <br/>StNr.: [Steuernummer]<br />USt-IdNr.: [Umsatzteuer ID]<br />
							</td>
							<td valign='top' width='35%'>
							</td>
							<td valign='top' width='30%' style='font-size:12px;'>Rechnungsdatum: ${today}<br/>
								Fälligkeitsdatum: ${deadline} <br/>
							</td>
							</tr>`;

				tableEmpfaengerDaten.innerHTML = html;

				// Mittlere Daten ausfüllen
				html = `<tr>

						<td width='35%' bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Beschreibung </strong></td>
						<td bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Tage</strong></td>
						<td bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Preis/Tag</strong></td>
						<td bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Gesamt</strong></td>
				
						</tr>
						<tr style="display:none;"><td colspan="*"><tr>`;

				// Used to set up the page nicely
				let numberOfEntries = 0;
				if(this.rentObject.preis_kfz != 0)
				{
					let total = this.rentObject.tage_gemietet * this.rentObject.preis_kfz;
					html += `<td valign='top' style='font-size:12px;'>Fahrzeug ${this.rentObject.kfz_bezeichnung}</td>
					<td valign='top' style='font-size:12px;'>${this.rentObject.tage_gemietet}</td>
					<td valign='top' style='font-size:12px;'>${this.rentObject.preis_kfz}</td>
					<td valign='top' style='font-size:12px;'>${total}</td>
		
					</tr>`;
					numberOfEntries++;
				}
				if(this.rentObject.preis_anhaenger != 0)
				{
					let total = this.rentObject.tage_gemietet * this.rentObject.preis_anhaenger;
					html += `<td valign='top' style='font-size:12px;'>Anhänger ${this.rentObject.anhaenger_bezeichnung}</td>
					<td valign='top' style='font-size:12px;'>${this.rentObject.tage_gemietet}</td>
					<td valign='top' style='font-size:12px;'>${this.rentObject.preis_anhaenger}</td>
					<td valign='top' style='font-size:12px;'>${total}</td>
		
					</tr>`;
					numberOfEntries++;
				}
				if(this.rentObject.preis_fahrer != 0)
				{
					let total = this.rentObject.tage_gemietet * this.rentObject.preis_fahrer;
					html += `<td valign='top' style='font-size:12px;'>FahrerIn</td>
					<td valign='top' style='font-size:12px;'>${this.rentObject.tage_gemietet}</td>
					<td valign='top' style='font-size:12px;'>${this.rentObject.preis_fahrer}</td>
					<td valign='top' style='font-size:12px;'>${total}</td>
		
					</tr>`;
					numberOfEntries++;
				}
				if(this.rentObject.preis_schutzpaket != 0)
				{
					html += `<td valign='top' style='font-size:12px;'>${this.rentObject.schutzpaket}</td>
					<td valign='top' style='font-size:12px;'></td>
					<td valign='top' style='font-size:12px;'>${this.rentObject.preis_schutzpaket}</td>
					<td valign='top' style='font-size:12px;'>${this.rentObject.preis_schutzpaket}</td>
		
					</tr>`;
					numberOfEntries++;
				} 

				// Schäden an das Kraftfahrzeug hinzufügen
				let gesamtSchaden = 0;
				this.app.ApiSchadenGetByKraftfahrzeugIdAndUser((response) =>
				{
					if(response.length > 0 && response != null)
					{
						for(let schadenentry of response)
						{
							html += `<td valign='top' style='font-size:12px;'>${schadenentry.schadensart}</td>
							<td valign='top' style='font-size:12px;'></td>
							<td valign='top' style='font-size:12px;'>${schadenentry.anfallendekosten}</td>
							<td valign='top' style='font-size:12px;'>${schadenentry.anfallendekosten}</td>
				
							</tr>`;
							numberOfEntries++;
							gesamtSchaden += schadenentry.anfallendekosten;
						}
					}

					for(let iterator = 0; iterator < (20-numberOfEntries); iterator++)
					{
						html += `<tr><td valign='top' style='font-size:12px;'>&nbsp;</td>
						<td valign='top' style='font-size:12px;'>&nbsp;</td>
						<td valign='top' style='font-size:12px;'>&nbsp;</td>
						<td valign='top' style='font-size:12px;'>&nbsp;</td></tr>`;
					}
	
					html += `</td></tr>`;
					tableRechnungInhalt.innerHTML = html;
	
					// Untere Daten ausfüllen
					this.rentObject.preis_gesamt = this.rentObject.preis_gesamt + gesamtSchaden;
					let umsatzsteuer = ((this.rentObject.preis_gesamt * 20)/100); 
					html = `<tr>
						<td style='font-size:12px;width:50%;'><strong> </strong></td>
						<td><table width='100%' cellspacing='0' cellpadding='2' border='0'>
					<tr>
						<td align='right' style='font-size:12px;' >Gesamt</td>
						<td  align='right' style='font-size:12px;'>${this.rentObject.preis_gesamt - umsatzsteuer} €<td>
					</tr>
					<tr>
						<td  align='right' style='font-size:12px;'>USt.(20%)</td>
						<td  align='right' style='font-size:12px;'>${umsatzsteuer} €</td>
					</tr>
					<tr>
		
						<td  align='right' style='font-size:12px;'><b>Gesamtpreis</b></td>
						<td  align='right' style='font-size:12px;'><b>${this.rentObject.preis_gesamt},00 €</b></td>
					</tr>`;
					
					tableRechnungGesamt.innerHTML = html;
					localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
				}, (ex) => 
				{
					alert(ex);
				}, this.rentObject.kraftfahrzeug_id, this.rentObject.users_id);
			}
			else
			{
				alert(response.message);
			}
		}, (ex) => 
		{
			alert(ex);
		},  benutzerMerkmal);
	}

	addDays(date, days) 
	{
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}
}