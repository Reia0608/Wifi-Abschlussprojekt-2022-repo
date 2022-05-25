import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import Helper from "./helper.js";

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
			const modalSchadenBody = args.app.Main.querySelector('#modalSchadenBody');
			const buttonSchadenNeu = args.app.Main.querySelector('#buttonSchadenNeu');
			const dialogSchaden = new bootstrap.Modal(modalSchadenBody);
			const buttonModalSchadenSpeichern = args.app.Main.querySelector('#buttonModalSchadenSpeichern');
			const labelAnfallendeKosten = args.app.Main.querySelector('#labelAnfallendeKosten');
			const selectSchadenArt = args.app.Main.querySelector('#selectSchadenArt');
			const labelBeschreibung = args.app.Main.querySelector('#labelBeschreibung');			
			

			if(args.kid)
			{
				let kraftfahrzeug_id = parseInt(args.kid);
				this.datenLaden(kraftfahrzeug_id);
			}

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
					this.kraftfahrzeug.kraftfahrzeug_id = parseFloat(args.app.kid);
					this.kraftfahrzeug.marke = inputMarke.value;
					this.kraftfahrzeug.modell = inputModell.value;
					this.kraftfahrzeug.kennzeichen = inputKennzeichen.value;
					this.kraftfahrzeug.mietpreis = inputMietpreis.value && !isNaN(inputMietpreis.value) ? parseFloat(inputMietpreis.value) : null;
					this.kraftfahrzeug.beschreibung = textareaBeschreibung.value;
					// for (let schadenitem of this.kraftfahrzeug.schadenlist) 
					// {
					// 	schadenitem.push(
					// 	{
					// 		schadensart: 
					// 		beschreibung:
					// 		anfallendekosten:
					// 		schaden_datum:
					// 	});
					// }
					// this.kraftfahrzeug.schadenliste = 


					this.app.ApiKraftfahrzeugSet((response) => 
					{
						this.kraftfahrzeug = response;
						if (this.bild) 
						{
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
							schaden_id: null,
							datum: new Date().toISOString()
						};
					}
					schadensArtText = selectSchadenArt.options[selectSchadenArt.selectedIndex].text;
					this.schaden.kraftfahrzeug_id = parseFloat(args.kid);
					this.schaden.anfallendekosten = (labelAnfallendeKosten.value && !isNaN(labelAnfallendeKosten.value) ? parseInt(labelAnfallendeKosten.value) : 0);
					this.schaden.schadensart = schadensArtText;
					this.schaden.beschreibung = labelBeschreibung.value;
					if (this.schadenOp == 'i') 
					{
						if (this.kraftfahrzeug && !this.kraftfahrzeug.schadenlist)
						{
							this.kraftfahrzeug.schadenlist = [];
						} 
						this.kraftfahrzeug.schadenlist.push(this.schaden);
					}

					// Update the database.
					this.app.ApiSchadenSet((response) => 
					{
						this.schaden = response;
						console.log("database was updated!");
						if (this.bild) 
						{
							this.app.ApiSchadenSetBild(() => 
							{

							}, (ex) => 
							{
								alert(ex);
							}, this.schaden, this.bild);
						}
					}, (ex) => 
					{
						alert(ex);
					}, this.schaden);

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
						let id = parseInt(btn.id.split('_')[1]);
			
						this.app.ApiSchadenDelete(() => 
						{
							this.schadenListAnzeigen();
						}, (ex) => 
						{
							alert(ex);
						}, id);
					}	
				}
				else if (e.target.nodeName == 'TD') 
				{
					let idx = parseInt(e.target.parentElement.dataset.idx);
					this.schaden = this.kraftfahrzeug.schadenlist[idx];
					this.schadenOp = 'u';
					labelAnfallendeKosten.value = this.schaden.anfallendekosten;
					selectSchadenArt.value =  new Helper().SchadensArtConverter(this.schaden.schadensart);
					labelBeschreibung.value = this.schaden.beschreibung;

					dialogSchaden.show();
				}
			});
		}); // LoadHTML
	} // constructor

	datenLaden(kraftfahrzeug_id) 
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
					$('<div class="item"><img src="'+bildListe.Bild_Url[iterator]+'"><div class="carousel-caption"></div>   </div>').appendTo('.carousel-inner');
					$('<li data-target="#carouselControlImages" data-slide-to="'+iterator+'"></li>').appendTo('.carousel-indicators')
				}
				$('.item').first().addClass('active'); 
				$('.carousel-indicators > li').first().addClass('active');
				$('#carouselControlImages').carousel(); 
			}

			// if (this.kraftfahrzeug.BildListe) 
			// {
			// 	imgBild.src = this.app.apiBaseUrl + 'kraftfahrzeug/' + this.kraftfahrzeug.kraftfahrzeug_id + '/bild';
			// }

			this.schadenListAnzeigen();

		}, (ex) => 
		{
			alert(ex);
		}, kraftfahrzeug_id);
	}

	//----------------------------------------------------------------------------------------
	// schaden anzeigen
	schadenListAnzeigen() 
	{
		const tableSchadenList = this.app.Main.querySelector('#tableSchadenList');
		let html = '';

		this.app.ApiSchadenGetList((response) => 
		{
			this.kraftfahrzeug.schadenlist = response;
			for (let schadenitem of this.kraftfahrzeug.schadenlist) 
			{
				html += 
				`<tr data-idx="${schadenitem.schaden_id}">
					<td>
						<button type="button" class="btn btn-outline-light btn-sm" id="buttonSchadenDel_${schadenitem.schaden_id}"><span class="iconify" data-icon="mdi-delete"></span></button>
					</td>
					<td class="element-clickable">${(schadenitem.datum ? dateFormatter.format(new Date(schadenitem.datum)) : '&nbsp;')}</td>
					<td class="element-clickable">${(schadenitem.schadensart ? schadenitem.schadensart : '&nbsp;')}</td>
					<td class="element-clickable">${(schadenitem.beschreibung? schadenitem.beschreibung : '&nbsp;')}</td>
					<td class="element-clickable">${(schadenitem.anfallendekosten ? schadenitem.anfallendekosten : '&nbsp;')}</td>
				</tr>
				`;
			}
			tableSchadenList.innerHTML = html;
		}, (ex) => 
		{
			alert(ex);
		});
	}
}