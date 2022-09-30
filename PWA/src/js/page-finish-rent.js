import "./app.js";
import Helper from "./helper.js";

export default class PageFinishRent
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-finish-rent.html', args.app.Main, () => 
		{
			// Intilialisierung
			const buttonPdf = document.querySelector('#buttonPdf');
			const buttonGenerateQRCode = document.querySelector('#buttonGenerateQRCode');
			const buttonScanQRCode = document.querySelector('#buttonScanQRCode');
			const divQrCodeTarget = document.querySelector('#divQrCodeTarget');

			// Logic
			if(args.bid)
			{
				this.loadData(args.bid);
			}
			
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

			buttonGenerateQRCode.addEventListener('click', () =>
			{
				// Initialisierung
				let qrcode = undefined;
				this.Helper = new Helper();

				// logic
				this.Helper.QRCodeGenerator(qrcode, document.getElementById('divQrCodeTarget'), 'http://localhost:5500/src/index.html#finishrent');
			});

			buttonScanQRCode.addEventListener('click', () =>
			{
				location.hash = '#scanner';
			});
		});
	}

    // functions
	loadData(bewegung_id)
	{	
		if(bewegung_id != null)
		{
			this.app.ApiRentObjectGet((response) =>
			{
				// Initialisierung
				this.Helper = new Helper();
				this.rentObject = this.Helper.CreateRentObject();

				if(response.bewegung_id != null)
				{
					this.rentObject.bewegung_id = response.bewegung_id;
				}
				if(response.users_id != null)
				{
					this.rentObject.users_id = response.users_id;
				}
				if(response.bewegungsdatum != null)
				{
					this.rentObject.bewegungsdatum = response.bewegungsdatum;
				}
				if(response.beschreibung != null)
				{
					this.rentObject.beschreibung = response.beschreibung;
				}
				if(response.grund != null)
				{
					this.rentObject.grund = response.grund;
				}
				if(response.abholort != null)
				{
					this.rentObject.abholort = response.abholort;
				}
				if(response.rueckgabeort != null)
				{
					this.rentObject.rueckgabeort = response.rueckgabeort;
				}
				if(response.abholdatum != null)
				{
					this.rentObject.abholdatum = response.abholdatum;
				}
				if(response.rueckgabedatum != null)
				{
					this.rentObject.rueckgabedatum = response.rueckgabedatum;
				}
				this.rentObject.gleicherrueckgabeort = response.gleicherrueckgabeort;
				this.rentObject.schutzpaket = response.schutzpaket;
				this.rentObject.braucht_fahrer = response.braucht_fahrer;
				this.rentObject.fahrer_id = response.fahrer_id;
				this.rentObject.preis_gesamt = response.preis_gesamt;
				this.rentObject.preis_kfz = response.preis_kfz;
				this.rentObject.preis_anhaenger = response.preis_anhaenger;
				this.rentObject.preis_fahrer = response.preis_fahrer;
				this.rentObject.preis_schutzpaket = response.preis_schutzpaket;
				this.rentObject.allow_reload = response.allow_reload;
				this.rentObject.transaction_finished = response.transaction_finished;
				this.rentObject.bewegung_finished = response.bewegung_finished;
				this.rentObject.kraftfahrzeug_id = response.kraftfahrzeug_id;
				this.rentObject.anhaenger_id = response.anhaenger_id;
				this.rentObject.abholzeit = response.abholzeit;
				this.rentObject.rueckgabezeit = response.rueckgabezeit;
				this.rentObject.times_rented = response.times_rented;
				this.rentObject.tage_gemietet = response.tage_gemietet;
				this.rentObject.kfz_bezeichnung = response.kfz_bezeichnung;
				this.rentObject.anhaenger_bezeichnung = response.anhaenger_bezeichnung;
				this.rentObject.start_km_stand = response.start_km_stand;
                this.rentObject.ende_km_stand = response.ende_km_stand;
                this.rentObject.zeit_start = response.zeit_start;
                this.rentObject.zeit_ende = response.zeit_ende;

				if(document.cookie)
				{
					const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];
					// logic
					// Check the role of the user and show him/her the appropriate buttons
					this.app.ApiBenutzerGet((response) =>
					{
						if(response.benutzer.rolle == 0)
						{
							buttonGenerateQRCode.classList.add('d-none');
							divQrCodeTarget.classList.add('d-none');
							buttonScanQRCode.classList.remove('d-none');
						}
						else if(response.benutzer.rolle == 2)
						{
							buttonGenerateQRCode.classList.remove('d-none');
							divQrCodeTarget.classList.remove('d-none');
							buttonScanQRCode.classList.add('d-none');
						}
						else if(response.benutzer.rolle == 1)
						{
							buttonGenerateQRCode.classList.remove('d-none');
							divQrCodeTarget.classList.remove('d-none');
							buttonScanQRCode.classList.remove('d-none');
						}

						// Load data into what will be the PDF file
						this.app.ApiBenutzerGetById((response) =>
						{
							if(response.success)
							{
								// Initialisierung
								const tableEmpfaengerDaten = document.querySelector('#tableEmpfaengerDaten');
								const tableRechnungInhalt = document.querySelector('#tableRechnungInhalt');
								const tableRechnungGesamt = document.querySelector('#tableRechnungGesamt');
			
								
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
										<td bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Km</strong></td>
										<td bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Preis/Km</strong></td>
										<td bordercolor='#ccc' bgcolor='#f2f2f2' style='font-size:12px;'><strong>Gesamt</strong></td>
								
										</tr>
										<tr style="display:none;"><td colspan="*"><tr>`;
			
								// Used to set up the page nicely
								let numberOfEntries = 0;
								let kmGefahren = this.rentObject.ende_km_stand - this.rentObject.start_km_stand;
								if(this.rentObject.preis_kfz != 0)
								{
									let total =  kmGefahren * this.rentObject.preis_kfz;
									html += `<td valign='top' style='font-size:12px;'>Fahrzeug ${this.rentObject.kfz_bezeichnung}</td>
									<td valign='top' style='font-size:12px;'>${kmGefahren}</td>
									<td valign='top' style='font-size:12px;'>${this.rentObject.preis_kfz}</td>
									<td valign='top' style='font-size:12px;'>${total}</td>
						
									</tr>`;
									numberOfEntries++;
								}
								if(this.rentObject.preis_anhaenger != 0)
								{
									let total = kmGefahren * this.rentObject.preis_anhaenger;
									html += `<td valign='top' style='font-size:12px;'>Anhänger ${this.rentObject.anhaenger_bezeichnung}</td>
									<td valign='top' style='font-size:12px;'>${kmGefahren}</td>
									<td valign='top' style='font-size:12px;'>${this.rentObject.preis_anhaenger}</td>
									<td valign='top' style='font-size:12px;'>${total}</td>
						
									</tr>`;
									numberOfEntries++;
								}
								if(this.rentObject.preis_fahrer != 0)
								{
									let total = kmGefahren * this.rentObject.preis_fahrer;
									html += `<td valign='top' style='font-size:12px;'>FahrerIn</td>
									<td valign='top' style='font-size:12px;'>${kmGefahren}</td>
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
									this.rentObject.preis_gesamt =  (this.rentObject.preis_kfz * kmGefahren) + (this.rentObject.preis_anhaenger * kmGefahren) + (this.rentObject.preis_fahrer * kmGefahren) + this.rentObject.preis_schutzpaket + gesamtSchaden;
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
						},  this.rentObject.users_id);
					}, (ex) =>
					{
						alert(ex);
					}, benutzerMerkmal);
				}
			}, (ex) =>
			{
				alert(ex);
			}, bewegung_id);
		}			
	}

	addDays(date, days) 
	{
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}
}