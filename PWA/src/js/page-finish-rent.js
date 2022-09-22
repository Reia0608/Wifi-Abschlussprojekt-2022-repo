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


			this.bildObject = {};

			// Logic


			// Event listeners
	
		});
	}

    // functions
	loadData()
	{
		// Initialisierung
		var kraftfahrzeug_id = localStorage.getItem("kid");
		const dateFormatter = new Intl.DateTimeFormat('de-AT', 
        {
            dateStyle: 'short'
        });

		// logic
		this.app.ApiSchadenGetKfzList((response) =>
		{
			let html = '';
			let iterator = 1;
			if(response == null)
			{
				damageListBody.innerHTML = `<p>Es gibt keine Schäden am Fahrzeug!</p>`;
			}
			else
			{
				damageListBody.innerHTML = '';
				for (let schaden of response) 
				{
					html = 
					`<div class="card cards mt-3" style="width: 18rem;">
						<img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-schaden-id="${schaden.schaden_id}" id="imgBild_${iterator}">
						<div class="card-body" data-schaden-id="${schaden.schaden_id}">
							<h5 class="card-title">Schaden Nummer ${iterator}</h5>
							<p class="card-text">
								Schadensart: ${schaden.schadensart}<br>
								Beschreibung: ${schaden.beschreibung}<br>
								Anfallende Kosten: €${schaden.anfallendekosten},-<br>
								Datum des entstandenen Schadens: ${dateFormatter.format(new Date(schaden.schaden_datum))}<br>
							</p>
						</div>
					</div>
					`;
					iterator++;
					damageListBody.innerHTML += html;
				}
				this.app.ApiBilderGetAllSchadenListFromKfz((response) =>
                {
					if(response.length > 0)
					{
						// jiterator here, is the total amount of times we have assigned a picture to its HTML element
						let jiterator = 1;
						for (let schadenBild of response)
						{
							// iterator-1 here, is the total number of cards we put on screen in the previous API call
							for(let kiterator = 1; kiterator <= (iterator-1); kiterator++)
							{
								if(jiterator <= response.length)
								{
									var imgIdentifier = "imgBild_" + kiterator.toString();
									var imgBild = document.getElementById(imgIdentifier);
			
									if(schadenBild.schaden_id == imgBild.dataset.schadenId)
									{
										imgBild.src = "data:image/jpeg;base64," + schadenBild.bild_bytes;
										jiterator++;
									}	
								}
							}
						}
					}
                }, (ex) => 
                {
                    alert(ex);
                }, kraftfahrzeug_id);
			}
		}, (ex) =>
		{
			alert(ex);
		}, kraftfahrzeug_id);
	}
}