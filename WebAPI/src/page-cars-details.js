import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import ComponentCalendar from "./component-calendar.js";

export default class PageCarsDetails 
{
	constructor(args) 
	{
		this.app = args.app;
		this.gruppeList = null;

		args.app.Body.style.paddingBottom = '60px';
		args.app.LoadHTML('./page-cars-details.html', args.app.Main, () => 
		{
			const imgContainer1 = args.app.Main.querySelector('#imgContainer1');
			const imgContainer = args.app.Main.querySelector('#imgContainer');
			const carouselControlImages = args.app.Main.querySelector('#carouselControlImages');
			const imgBild = args.app.Main.querySelector('#imgBild');
			const fileName = args.app.Main.querySelector('#fileName');
			const buttonKfzSpeichern = args.app.Main.querySelector('#buttonKfzSpeichern');
			const selectGruppe = args.app.Main.querySelector('#selectGruppe');
			const selectKategorie = args.app.Main.querySelector('#selectKategorie');
			const accordionPanelWertBody = args.app.Main.querySelector('#accordionPanelWertBody');
			const accordionPanelKalenderBody = args.app.Main.querySelector('#accordionPanelKalenderBody');
			
			this.calendar = new ComponentCalendar(
				{
					app: this.app,
					target: accordionPanelKalenderBody
				});

			if(args.kid)
			{
				let kraftfahrzeugId = parseInt(args.kid);
				this.datenLaden(kraftfahrzeugId);
			}
			
			// this.app.ApiGruppeGetList((response) => 
			// {
			// 	this.gruppeList = [];
			// 	let html = '';
			// 	for (let g of args.app.GruppeList) 
			// 	{
			// 		if (g.kategorielist && g.kategorielist.length > 0) 
			// 		{
			// 			this.gruppeList.push(g);
			// 			html += `<option value="${g.gruppeid}">${g.name}</option>`;
			// 		}
			// 	}
			// 	selectGruppe.innerHTML = html;

			// 	if (this.gruppeList[0].kategorielist && this.gruppeList[0].kategorielist.length > 0) 
			// 	{
			// 		html = '';
			// 		for (let k of this.gruppeList[0].kategorielist) 
			// 		{
			// 			html += `<option value="${k.kategorieid}">${k.name}</option>`;
			// 		}
			// 		selectKategorie.innerHTML = html;
			// 	}

			// 	this.app.ApiWertGruppeGetList((response) => 
			// 	{
			// 		this.wertGruppeList = response;
			// 		let whtml = '';
			// 		for (let wg of response) 
			// 		{

			// 			whtml += `
			// 				<div class="row mt-2 border-bottom pb-2">
			// 					<div class="col-3 text-end">
			// 						${wg.name}
			// 					</div>
			// 					<div class="col-6">
			// 			`;

			// 			if (wg.multiselect) 
			// 			{
			// 				whtml += `<ul class="list-group list-group-flush" id="listWG_${wg.wertgruppeid}">`;
			// 				for (let w of wg.wertlist) {
			// 					whtml += `
			// 						<li class="list-group-item">
			// 							<div class="form-check">
			// 								<input class="form-check-input" type="checkbox" id="checkboxWert_${w.wertid}" data-wert-gruppe-id="${wg.wertgruppeid}">
			// 								<label class="form-check-label" for="checkboxWert_${w.wertid}">${w.name}</label>
			// 							</div>
			// 						</li>
			// 					`;
			// 				}
			// 				whtml += '</ul>';
			// 			}
			// 			else 
			// 			{
			// 				whtml += `<select class="form-select form-select-sm" id="selectWG_${wg.wertgruppeid}">`;
			// 				for (let w of wg.wertlist) 
			// 				{
			// 					whtml += `<option value="${w.wertid}">${w.name}</option>`;
			// 				}
			// 				whtml += '</select>';
			// 			}
			// 			whtml += "</div></div>";
			// 		}
			// 		accordionPanelWertBody.innerHTML = whtml;

			// 		if (args.aid) this.datenLaden(args.aid);
			// 		else 
			// 		{
			// 			this.kraftfahrzeug = 
			// 			{
			// 				kraftfahrzeugid: null,
			// 				bewegunglist: []
			// 			};
			// 		}
			// 	}, (ex) => 
			// 	{
			// 		alert(ex);
			// 	});
			// });
			//-------------------------------------------------------------
			// selects
			// selectGruppe.addEventListener('change', (e) => 
			// {
			// 	let html = '';
			// 	if (this.gruppeList[selectGruppe.selectedIndex].kategorielist && this.gruppeList[selectGruppe.selectedIndex].kategorielist.length > 0) 
			// 	{
			// 		html = '';
			// 		for (let k of this.gruppeList[selectGruppe.selectedIndex].kategorielist) 
			// 		{
			// 			html += `<option value=${k.kategorieid}">${k.name}</option>`;
			// 		}
			// 		selectKategorie.innerHTML = html;
			// 	}
			// });

			//-------------------------------------------------------------
			// drag & drop Bild
			// imgContainer1.addEventListener('dragover', (event) => 
			// {
			// 	event.stopPropagation();
			// 	event.preventDefault();
			// 	event.dataTransfer.dropEffect = 'copy';
		 	// });

			// imgContainer1.addEventListener('drop', (event) => 
			// {
			// 	event.stopPropagation();
			// 	event.preventDefault();
			// 	const fileList = event.dataTransfer.files;
			// 	fileName.innerText = fileList[0].name;
			// 	this.bild = fileList[0];
			// 	const reader = new FileReader();
			// 	reader.addEventListener('load', (event) => 
			// 	{
			// 		imgContainer1.src = event.target.result;
			// 	});
			// 	reader.readAsDataURL(fileList[0]);
			// });

			//-------------------------------------------------------------
			// speichern
			buttonKfzSpeichern.addEventListener('click', (e) => 
			{
				const inputMarke = this.app.Main.querySelector('#inputMarke');
				const inputModell = this.app.Main.querySelector('#inputModell');
				const inputKennzeichen = this.app.Main.querySelector('#inputKennzeichen');
				const inputMietpreis = this.app.Main.querySelector('#inputMietpreis');
				const textBeschreibung = this.app.Main.querySelector('#textBeschreibung');
				const dateLetzterEinkauf = this.app.Main.querySelector('#dateLetzterEinkauf');

				if (textName.value && textNummer.value) 
				{
					this.kraftfahrzeug.kategorieid = this.gruppeList[selectGruppe.selectedIndex].kategorielist[selectKategorie.selectedIndex].kategorieid;
					this.kraftfahrzeug.name = textName.value;
					this.kraftfahrzeug.nummer = textNummer.value;
					this.kraftfahrzeug.preisek = textPreisEk.value && !isNaN(textPreisEk.value) ? parseFloat(textPreisEk.value) : null;
					this.kraftfahrzeug.preisvk = textPreisVk.value && !isNaN(textPreisVk.value) ? parseFloat(textPreisVk.value) : null;
					this.kraftfahrzeug.packung = textPackung.value && !isNaN(textPackung.value) ? parseInt(textPackung.value) : null;
					this.kraftfahrzeug.einheit = selectEinheit.value;
					this.kraftfahrzeug.beschreibung = textBeschreibung.value;
					this.kraftfahrzeug.letztereinkauf = dateLetzterEinkauf.value ? new Date(dateLetzterEinkauf.value).toISOString() : null;


					this.app.ApiKraftfahrzeugSet((response) => 
					{
						this.kraftfahrzeug = response;
						if (this.bild) {
							this.app.ApiKraftfahrzeugSetBild(() => 
							{

							}, (ex) => 
							{
								alert(ex);
							}, this.kraftfahrzeug, this.bild);
						}
					}, (ex) => 
					{
						alert(ex);
					}, this.kraftfahrzeug);
				}
				else 
				{
					alert('Name und Nummer ist Pflicht!');
				}
			});


			//------------------------------------------------------------------------------------------
			// alles rund um die Bewegung
			const buttonBewegungNeu = args.app.Main.querySelector('#buttonBewegungNeu');
			const modalBewegung = args.app.Main.querySelector('#modalBewegung');
			const dialogBewegung = new bootstrap.Modal(modalBewegung);
			const buttonModalBewegungSpeichern = args.app.Main.querySelector('#buttonModalBewegungSpeichern');
			const textMenge = args.app.Main.querySelector('#textMenge');
			const selectUmlauf = args.app.Main.querySelector('#selectUmlauf');
			const textGrund = args.app.Main.querySelector('#textGrund');			
			const tableBewegungList = this.app.Main.querySelector('#tableBewegungList>tbody');

			//---------------------------
			buttonBewegungNeu.addEventListener( 'click', (e) => 
			{
				textMenge.value = '';
				selectUmlauf.value = '0';
				textGrund.value = '';
				this.bewegung = null;
				this.bewegungOp = 'i';
				textMenge.classList.remove('is-invalid', 'is-valid');
				selectUmlauf.classList.remove('is-invalid', 'is-valid');

				dialogBewegung.show();
			});

			//---------------------------
			buttonModalBewegungSpeichern.addEventListener('click', (e) => 
			{
				let saveOk = true;
				textMenge.classList.remove('is-invalid', 'is-valid');
				selectUmlauf.classList.remove('is-invalid', 'is-valid');

				if (!textMenge.value || (textMenge.value && isNaN(textMenge.value))) 
				{
					saveOk = false;
					textMenge.classList.add('is-invalid');
				}
				else textMenge.classList.add('is-valid');

				if (selectUmlauf.value == '0') 
				{
					saveOk = false;
					selectUmlauf.classList.add('is-invalid');
				}
				else selectUmlauf.classList.add('is-valid');

				if (saveOk) 
				{
					if (!this.bewegung) 
					{
						this.bewegung = 
						{
							bewegungid: null,
							datum: new Date().toISOString()
						};
					}

					this.bewegung.personid = args.app.Benutzer.personid;
					this.bewegung.menge = (textMenge.value && !isNaN(textMenge.value) ? parseInt(textMenge.value) : 0);
					this.bewegung.umlauf = parseInt(selectUmlauf.value);
					this.bewegung.grund = textGrund.value;
					if (this.bewegungOp == 'i') 
					{
						if (this.kraftfahrzeug && !this.kraftfahrzeug.bewegunglist) this.kraftfahrzeug.bewegunglist = [];
						this.kraftfahrzeug.bewegunglist.push(this.bewegung);
					}

					this.bewegungListAnzeigen();
					dialogBewegung.hide();
				}
			});

			//---------------------------
			tableBewegungList.addEventListener('click', (e) => 
			{
				let btn = null;
				if (e.target.nodeName.toUpperCase() == 'PATH' && e.target.parentElement.nodeName.toUpperCase() == 'SVG' && e.target.parentElement.parentElement.nodeName == 'BUTTON') btn = e.target.parentElement.parentElement;
				else if (e.target.nodeName.toUpperCase() == 'SVG' && e.target.parentElement.nodeName == 'BUTTON') btn = e.target.parentElement;
				else if (e.target.nodeName == 'BUTTON') btn = e.target;

				if (btn) 
				{
					if (confirm('Wollen Sie wirklich löschen?')) 
					{
						let idx = parseInt(btn.id.split('_')[1]);
						//this.kraftfahrzeug.bewegunglist = this.kraftfahrzeug.bewegunglist.splice(idx, 1);
						args.app.ApiBewegungDelete((response) => 
						{
							this.kraftfahrzeug.bewegunglist = response;
							this.bewegungListAnzeigen();

						}, (ex) => 
						{
							alert(ex);
						}, this.kraftfahrzeug.bewegunglist[idx].bewegungid);
					}	
				}
				else if (e.target.nodeName == 'TD') 
				{
					let idx = parseInt(e.target.parentElement.dataset.idx);
					this.bewegung = this.kraftfahrzeug.bewegunglist[idx];
					this.bewegungOp = 'u';
					textMenge.value = this.bewegung.menge;
					selectUmlauf.value = this.bewegung.umlauf;
					textGrund.value = this.bewegung.grund;

					dialogBewegung.show();
				}
			});
		}); // LoadHTML
	} // constructor

	datenLaden(kraftfahrzeugId) 
	{
		this.app.ApiKraftfahrzeugGet((response) => 
		{
			this.kraftfahrzeug = response;

			const bildListe = response.bildliste;
			const imgBild = this.app.Main.querySelector('#imgBild');

			inputMarke.value = this.kraftfahrzeug.marke;
			inputModell.value = this.kraftfahrzeug.modell;
			inputKennzeichen.value = this.kraftfahrzeug.kennzeichen;
			inputMietpreis.value = this.kraftfahrzeug.mietpreis;

			if (bildListe != null)
			{
				for(var iterator=0 ; iterator< bildListe.length ; iterator++) 
				{
					$('<div class="item"><img src="'+bildListe.Bild_Url[i]+'"><div class="carousel-caption"></div>   </div>').appendTo('.carousel-inner');
					$('<li data-target="#carouselControlImages" data-slide-to="'+iterator+'"></li>').appendTo('.carousel-indicators')
				}
				$('.item').first().addClass('active'); 
				$('.carousel-indicators > li').first().addClass('active');
				$('#carouselControlImages').carousel(); 
			}


			// if (this.kraftfahrzeug.BildListe) 
			// {
			// 	imgBild.src = this.app.apiBaseUrl + 'kraftfahrzeug/' + this.kraftfahrzeug.kraftfahrzeugid + '/bild';
			// }

			//this.bewegungListAnzeigen();

			// let ctl = null;
			// for (let wertGruppe of this.wertGruppeList) 
			// {
			// 	if (wertGruppe.multiselect) 
			// 	{
			// 		for (let wert of wertGruppe.wertlist) 
			// 		{
			// 			ctl = accordionPanelWertBody.querySelector('#checkboxWert_' + wert.wertid + '[data-wert-gruppe-id="' + wertGruppe.wertgruppeid + '"]');
			// 			if (ctl.checked) this.kraftfahrzeug.wertlist.push(
			// 			{
			// 				kraftfahrzeugid: null,
			// 				wertid: wert.wertid
			// 			});
			// 		}
			// 	}
			// 	else 
			// 	{
			// 		this.kraftfahrzeug.wertlist.filter
			// 		ctl = accordionPanelWertBody.querySelector('#selectWG_' + wertGruppe.wertgruppeid);
			// 		this.kraftfahrzeug.wertlist.push(
			// 		{
			// 			kraftfahrzeug: null,
			// 			wertid: parseInt(ctl.value)
			// 		});
			// 	}
			// }
		}, (ex) => 
		{
			alert(ex);
		}, kraftfahrzeugId);
	}

	//----------------------------------------------------------------------------------------
	// bewegungen anzeigen
	// bewegungListAnzeigen() 
	// {
	// 	if (this.kraftfahrzeug.bewegunglist && this.kraftfahrzeug.bewegunglist.length > 0) 
	// 	{
	// 		const dateFormatter = new Intl.DateTimeFormat('de-AT', 
	// 		{
	// 			dateStyle: 'medium'
	// 		});
	// 		const tableBewegungList = this.app.Main.querySelector('#tableBewegungList>tbody');
	// 		let appointments = [];
	// 		let html = '';
	// 		let idx = 0;
	// 		for (let b of this.kraftfahrzeug.bewegunglist) 
	// 		{
	// 			appointments.push(
	// 			{
	// 				date: new Date(b.datum),
	// 				text: b.umlauftext + ' ' + b.menge,
	// 				class: b.umlauf == 1 ? 'bg-success' : (b.umlauf == 2 ? 'bg-danger' : 'bg-info')
	// 			});

	// 			html += `
	// 				<tr data-idx="${idx}">
	// 					<td>
	// 						<button type="button" class="btn btn-outline-light btn-sm" id="buttonBewegungDel_${idx}"><span class="iconify" data-icon="mdi-delete"></span></button>
	// 					</td>
	// 					<td class="element-clickable">${(b.datum ? dateFormatter.format(new Date(b.datum)) : '&nbsp;')}</td>
	// 					<td class="element-clickable">${(b.menge ? b.menge : '&nbsp;')}</td>
	// 					<td class="element-clickable">${(b.umlauftext ? b.umlauftext : '&nbsp;')}</td>
	// 					<td class="element-clickable">${(b.grund ? b.grund : '&nbsp;')}</td>
	// 					<td class="element-clickable">${(b.personname ? b.personname : '&nbsp;')}</td>
	// 				</tr>
	// 			`;
	// 			idx++;
	// 		}
	// 		tableBewegungList.innerHTML = html;
	// 		this.calendar.Appointments = appointments;
	// 	}
	// }
}