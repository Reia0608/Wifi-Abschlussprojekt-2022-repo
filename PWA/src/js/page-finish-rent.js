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
					margin:       1,
					filename:     'Rechnung.pdf',
					image:        { type: 'jpeg', quality: 0.98 },
					html2canvas:  { scale: 2 },
					jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
			  	};
				var source = document.getElementById('toPDF');
				html2pdf(source, opt);
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

				// Untere Daten ausfüllen
				html = `<tr>

						<td width='35%' bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Beschreibung </strong></td>
						<td bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Tage</strong></td>
						<td bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Preis/Tag</strong></td>
						<td bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Gesamt</strong></td>
				
						</tr>
						<tr style="display:none;"><td colspan="*"><tr>`;

				if(this.rentObject.preis_kfz != 0)
				{
					html += `<td valign='top' style='font-size:12px;'>Mein Produkt</td>
					<td valign='top' style='font-size:12px;'>6 </td>
					<td valign='top' style='font-size:12px;'>305,00 </td>
					<td valign='top' style='font-size:12px;'>1.830,00 </td>
		
					</tr>`
				}
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