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
			// KfZ Mieten
			buttonKfzMieten.addEventListener('click', (e) => 
			{
				location.hash = '#rentstepone';
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