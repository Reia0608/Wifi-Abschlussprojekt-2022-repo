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
				let kraftfahrzeugid = parseInt(args.kid);
				this.datenLaden(kraftfahrzeugid);
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
			// 				schadenlist: []
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
				const textareaBeschreibung = this.app.Main.querySelector('#textareaBeschreibung');
				//const dateLetzterEinkauf = this.app.Main.querySelector('#dateLetzterEinkauf');

				if (inputMarke.value && inputModell.value) 
				{
					this.kraftfahrzeug.kraftfahrzeugid = parseFloat(args.app.kid);
					this.kraftfahrzeug.marke = inputMarke.value;
					this.kraftfahrzeug.modell = inputModell.value;
					this.kraftfahrzeug.kennzeichen = inputKennzeichen.value;
					this.kraftfahrzeug.mietpreis = inputMietpreis.value && !isNaN(inputMietpreis.value) ? parseFloat(inputMietpreis.value) : null;
					this.kraftfahrzeug.beschreibung = textareaBeschreibung.value;


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
					alert('Marke und Modell sind Pflicht!');
				}
			});


			//------------------------------------------------------------------------------------------
			// alles rund um den Schaden
			const buttonSchadenNeu = args.app.Main.querySelector('#buttonSchadenNeu');
			const modalSchaden = args.app.Main.querySelector('#modalSchaden');
			const dialogSchaden = new bootstrap.Modal(modalSchaden);
			const buttonModalSchadenSpeichern = args.app.Main.querySelector('#buttonModalSchadenSpeichern');
			const labelAnfallendeKosten = args.app.Main.querySelector('#labelAnfallendeKosten');
			const selectSchadenArt = args.app.Main.querySelector('#selectSchadenArt');
			const labelBeschreibung = args.app.Main.querySelector('#labelBeschreibung');			
			const tableSchadenList = this.app.Main.querySelector('#tableSchadenList>tbody');

			//---------------------------
			buttonSchadenNeu.addEventListener( 'click', (e) => 
			{
				labelAnfallendeKosten.value = '';
				selectSchadenArt.value = '0';
				labelBeschreibung.value = '';
				this.schaden = null;
				this.schadenOp = 'i';
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
							schadenid: null,
							datum: new Date().toISOString()
						};
					}
					schadensArtText = selectSchadenArt.options[selectSchadenArt.selectedIndex].text;
					this.schaden.schadenid = parseFloat(args.kid);
					this.schaden.anfallendekosten = (labelAnfallendeKosten.value && !isNaN(labelAnfallendeKosten.value) ? parseInt(labelAnfallendeKosten.value) : 0);
					this.schaden.schadensart = schadensArtText;
					this.schaden.beschreibung = labelBeschreibung.value;
					if (this.schadenOp == 'i') 
					{
						if (this.kraftfahrzeug && !this.kraftfahrzeug.schadenlist) this.kraftfahrzeug.schadenlist = [];
						this.kraftfahrzeug.schadenlist.push(this.schaden);
					}

					this.schadenListAnzeigen();
					dialogSchaden.hide();
				}
			});

			//---------------------------
			tableSchadenList.addEventListener('click', (e) => 
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
						this.kraftfahrzeug.schadenlist = this.kraftfahrzeug.schadenlist.splice(idx, 1);
						args.app.ApiSchadenDelete((response) => 
						{
							this.kraftfahrzeug.schadenlist = response;
							this.schadenListAnzeigen();

						}, (ex) => 
						{
							alert(ex);
						}, this.kraftfahrzeug.schadenlist[idx].schadenid);
					}	
				}
				else if (e.target.nodeName == 'TD') 
				{
					let idx = parseInt(e.target.parentElement.dataset.idx);
					this.schaden = this.kraftfahrzeug.schadenlist[idx];
					this.schadenOp = 'u';
					labelAnfallendeKosten.value = this.schaden.anfallendekosten;
					switch(this.schaden.schadensart)
					{
						case 'Unbekannt': selectSchadenArt.value = 0;
							break;
						case 'Blechschaden': selectSchadenArt.value = 1;
							break;
						case 'Glasbruch': selectSchadenArt.value = 2;
							break;
						case 'Marderschaden': selectSchadenArt.value = 3;
							break;
						case 'Lackschaden': selectSchadenArt.value = 4;
							break;
						case 'Parkschaden': selectSchadenArt.value = 5;
							break;
						case 'Frostschaden': selectSchadenArt.value = 6;
							break;
						case 'Totalschaden': selectSchadenArt.value = 7;
							break;
						case 'Sonstiger Schaden': selectSchadenArt.value = 8;
							break;
						default: selectSchadenArt.value = 0;
							break;
					}
					labelBeschreibung.value = this.schaden.beschreibung;

					dialogSchaden.show();
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
			// 	imgBild.src = this.app.apiBaseUrl + 'kraftfahrzeug/' + this.kraftfahrzeug.kraftfahrzeugId + '/bild';
			// }

			this.schadenListAnzeigen();

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
	// schaden anzeigen
	schadenListAnzeigen() 
	{
		if (this.kraftfahrzeug.schadenlist && this.kraftfahrzeug.schadenlist.length > 0) 
		{
			const dateFormatter = new Intl.DateTimeFormat('de-AT', 
			{
				dateStyle: 'medium'
			});
			const tableSchadenList = this.app.Main.querySelector('#tableSchadenList>tbody');
			let appointments = [];
			let html = '';
			let idx = 0;
			for (let schadenitem of this.kraftfahrzeug.schadenlist) 
			{
				appointments.push(
				{
					date: new Date(schadenitem.datum),
					text: schadenitem.schadensart + ' ' + schadenitem.anfallendekosten,
					class: schadenitem.schadensart == 1 ? 'bg-success' : (schadenitem.schadensart == 2 ? 'bg-danger' : 'bg-info')
				});

				html += `
					<tr data-idx="${idx}">
						<td>
							<button type="button" class="btn btn-outline-light btn-sm" id="buttonSchadenDel_${idx}"><span class="iconify" data-icon="mdi-delete"></span></button>
						</td>
						<td class="element-clickable">${(schadenitem.datum ? dateFormatter.format(new Date(schadenitem.datum)) : '&nbsp;')}</td>
						<td class="element-clickable">${(schadenitem.schadensart ? schadenitem.schadensart : '&nbsp;')}</td>
						<td class="element-clickable">${(schadenitem.beschreibung? schadenitem.beschreibung : '&nbsp;')}</td>
						<td class="element-clickable">${(schadenitem.anfallendekosten ? schadenitem.anfallendekosten : '&nbsp;')}</td>
					</tr>
				`;
				idx++;
			}
			tableSchadenList.innerHTML = html;
			this.calendar.Appointments = appointments;
		}
	}
}