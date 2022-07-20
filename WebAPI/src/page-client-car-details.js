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
			const divKraftfahrzeugJahre = this.app.Main.querySelector('#divKraftfahrzeugJahre');
			
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
				const divMarke = this.app.Main.querySelector('#divMarke');
				const divModell = this.app.Main.querySelector('#divModell');
				const divKennzeichen = this.app.Main.querySelector('#divKennzeichen');
				const divMietpreis = this.app.Main.querySelector('#divMietpreis');
				const divBaujahr = this.app.Main.querySelector('#divBaujahr');
				const divKlasse = this.app.Main.querySelector('#divKlasse');
				const divKategorie = this.app.Main.querySelector('#divKategorie');

				if (divMarke.value && divModell.value) 
				{
					if(args.kid)
					{
						this.kraftfahrzeug.kraftfahrzeug_id = parseInt(args.kid);
					}
					else
					{
						this.kraftfahrzeug = {};
					}
					this.kraftfahrzeug.marke = divMarke.innerHTML;
					this.kraftfahrzeug.modell = divModell.innerHTML;
					this.kraftfahrzeug.kennzeichen = divKennzeichen.innerHTML;
					this.kraftfahrzeug.mietpreis = divMietpreis.value && !isNaN(divMietpreis.value) ? parseFloat(divMietpreis.value) : null;
					this.kraftfahrzeug.baujahr = parseInt(divBaujahr.innerHTML);
					this.kraftfahrzeug.klasse = divKlasse.options[selectKlasse.selectedIndex].text;
					this.kraftfahrzeug.kategorie = divKategorie.options[selectKategorie.selectedIndex].text;

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

			divMarke.innerHTML = this.kraftfahrzeug.marke;
			divModell.innerHTML = this.kraftfahrzeug.modell;
			divKennzeichen.innerHTML = this.kraftfahrzeug.kennzeichen;
			divMietpreis.innerHTML = this.kraftfahrzeug.mietpreis;
			divBaujahr.innerHTML = this.kraftfahrzeug.baujahr;
			divKraftfahrzeugJahre.innerHTML = (currentYear - divBaujahr.innerHTML).toString();
			if(this.kraftfahrzeug.klasse == null)
			{
				divKlasse.innerHTML = '0';
			}
			else
			{
				divKlasse.innerHTML = this.kraftfahrzeug.klasse;
			}
			
			if(this.kraftfahrzeug.kategorie == null)
			{
				divKategorie.innerHTML = '0';
			}
			else
			{
				divKategorie.innerHTML = this.kraftfahrzeug.kategorie;
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