import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import Helper from "./helper.js";

export default class PageClientCarDetails 
{
	constructor(args) 
	{
		this.app = args.app;

		args.app.Body.style.paddingBottom = '60px';
		args.app.LoadHTML('./page-client-car-details.html', args.app.Main, () => 
		{
			const imgContainer = args.app.Main.querySelector('#imgContainer');
			const buttonKfzMieten = args.app.Main.querySelector('#buttonKfzMieten');
			const buttonKfzZurueck = args.app.Main.querySelector('#buttonKfzZurueck');
			const imgBild = this.app.Main.querySelector('#imgBild');
			const spanKraftfahrzeugJahre = this.app.Main.querySelector('#spanKraftfahrzeugJahre');
			
			// Initialisierung
			var kfzbild = {};

			if(args.kid)
			{
				let kraftfahrzeug_id = parseInt(args.kid);
				this.datenLaden(kraftfahrzeug_id);
			}
			else
			{
				this.schadenListAnzeigen(); 
			}

			//-------------------------------------------------------------
			// drag & drop Bild
			imgContainer.addEventListener('dragover', (event) => 
			{
				event.stopPropagation();
				event.preventDefault();
				event.dataTransfer.dropEffect = 'copy';
		 	});

			imgContainer.addEventListener('drop', (event) => 
			{
				event.stopPropagation();
				event.preventDefault();
				const fileList = event.dataTransfer.files;
				this.bild = fileList[0];
				const reader = new FileReader();
				reader.addEventListener('load', (event) => 
				{
					// convert the image into a base64 string that can be saved as Byte[].
					let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
					kfzbild.bild_bytes = base64String;

					imgBild.src = event.target.result;	
				});
				reader.readAsDataURL(fileList[0]);
			});

			imgContainer.addEventListener('click', (event) =>
			{

			});
			
			//-------------------------------------------------------------
			// Mieten
			buttonKfzMieten.addEventListener('click', (e) => 
			{
				const inputMarke = this.app.Main.querySelector('#inputMarke');
				const inputModell = this.app.Main.querySelector('#inputModell');
				const inputKennzeichen = this.app.Main.querySelector('#inputKennzeichen');
				const inputMietpreis = this.app.Main.querySelector('#inputMietpreis');
				const inputBaujahr = this.app.Main.querySelector('#inputBaujahr');
				const selectKlasse = this.app.Main.querySelector('#selectKlasse');
				const selectKategorie = this.app.Main.querySelector('#selectKategorie');

				if (inputMarke.value && inputModell.value) 
				{
					if(args.kid)
					{
						this.kraftfahrzeug.kraftfahrzeug_id = parseInt(args.kid);
					}
					else
					{
						this.kraftfahrzeug = {};
					}
					this.kraftfahrzeug.marke = inputMarke.value;
					this.kraftfahrzeug.modell = inputModell.value;
					this.kraftfahrzeug.kennzeichen = inputKennzeichen.value;
					this.kraftfahrzeug.mietpreis = inputMietpreis.value && !isNaN(inputMietpreis.value) ? parseFloat(inputMietpreis.value) : null;
					this.kraftfahrzeug.baujahr = parseInt(inputBaujahr.value);
					this.kraftfahrzeug.klasse = selectKlasse.options[selectKlasse.selectedIndex].text;
					this.kraftfahrzeug.kategorie = selectKategorie.options[selectKategorie.selectedIndex].text;

					this.app.ApiKraftfahrzeugSet(() => 
					{
						if (kfzbild.bild_bytes) 
						{
							kfzbild.kraftfahrzeug_id = this.kraftfahrzeug.kraftfahrzeug_id;
							this.app.ApiBilderSet(() => 
							{

							}, (ex) => 
							{
								alert(ex);
							}, kfzbild);
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
				location.hash = '#cars';
			});

			//-------------------------------------------------------------
			// Vorgang abbrechen
			buttonKfzZurueck.addEventListener('click', (e) =>
			{
				location.hash = '#cars';
			});

		}); // LoadHTML
	} // constructor

	//----------------------------------------------------------------------------------------
	// Anzeige

    datenLaden(kraftfahrzeug_id) 
	{
		this.app.ApiKraftfahrzeugGet((response) => 
		{
			let currentYear = new Date().getFullYear();
			this.kraftfahrzeug = response;

			//const bildliste = response.bildliste;

			inputMarke.value = this.kraftfahrzeug.marke;
			inputModell.value = this.kraftfahrzeug.modell;
			inputKennzeichen.value = this.kraftfahrzeug.kennzeichen;
			inputMietpreis.value = this.kraftfahrzeug.mietpreis;
			inputBaujahr.value = this.kraftfahrzeug.baujahr;
			spanKraftfahrzeugJahre.textContent = (currentYear - inputBaujahr.value).toString();
			if(this.kraftfahrzeug.klasse == null)
			{
				selectKlasse.value = '0';
			}
			else
			{
				selectKlasse.options[selectKlasse.selectedIndex].text = this.kraftfahrzeug.klasse;
			}
			
			if(this.kraftfahrzeug.kategorie == null)
			{
				selectKategorie.value = '0';
			}
			else
			{
				selectKategorie.options[selectKategorie.selectedIndex].text = this.kraftfahrzeug.kategorie;
			}
			
			// Kfz Bild anzeigen
			this.app.ApiBilderGetKfzList((response) =>
			{
				if(response != null && response.length > 0)
				{
					let bildliste = response;
					imgBild.src = "data:image/jpeg;base64," + bildliste[0].bild_bytes;
				}
			}, (ex) => 
			{
				alert(ex);
			}, this.kraftfahrzeug.kraftfahrzeug_id);
		}, (ex) => 
		{
			alert(ex);
		}, kraftfahrzeug_id);
	}
}