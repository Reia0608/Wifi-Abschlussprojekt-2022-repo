import Helper from "./helper.js";

export default class PageCars
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-cars.html', args.app.Main, () => 
		{
            const carListBody = this.app.Main.querySelector('#carListBody');

            this.datenLaden();

			// ListGroupElement-click
			carListBody.addEventListener('click', (pointerCoordinates) => 
			{
				let button = null;

				if (pointerCoordinates.target.nodeName == 'PATH' && pointerCoordinates.target.parentElement.nodeName == 'SVG' && pointerCoordinates.target.parentElement.parentElement.nodeName == 'BUTTON') 
				{
					button = pointerCoordinates.target.parentElement.parentElement;
				}
				else if (pointerCoordinates.target.nodeName == 'SVG' && pointerCoordinates.target.parentElement.nodeName == 'BUTTON')
				{
					button = pointerCoordinates.target.parentElement;
				} 
				else if (pointerCoordinates.target.nodeName == 'BUTTON') 
				{
					button = pointerCoordinates.target;
				}

				if (button) 
				{

				}
				else if (pointerCoordinates.target.nodeName == 'A') 
				{
					let kraftfahrzeug_id = pointerCoordinates.target.parentElement.dataset.kraftfahrzeugId;
					window.open('#clientcardetails?kid=' + kraftfahrzeug_id, '_self');
				}
			});
        });
	}

	datenLaden()
	{
		this.app.ApiKraftfahrzeugGetList((response) => 
		{
			let html = '';
			let iterator = 1;
			this.Helper = new Helper();
			let currentYear = new Date().getFullYear();
			for (let kraftfahrzeug of response) 
			{
				html += 
				`<div class="card cards" style="width: 18rem;">
                    <img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}" id="imgBild_${iterator}">
                    <div class="card-body" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}">
						<h5 class="card-title">${kraftfahrzeug.marke} ${kraftfahrzeug.modell}</h5>
						<p class="card-text">
							Alter: ${currentYear - kraftfahrzeug.baujahr} Jahre<br>
							Klasse: ${kraftfahrzeug.klasse}<br>
							Kategorie: ${kraftfahrzeug.kategorie}<br>
							Mietpreis: €${kraftfahrzeug.mietpreis},-<br>
						</p>
						<a class="btn btn-primary" id="aEinzelheiten_${iterator}">Einzelheiten</a>
                    </div>
                </div>
                `;
				iterator++;
			}

			carListBody.innerHTML = html;

			this.app.ApiBilderGetAllKfzList((response) =>
			{
				let jiterator = 1;
				for(let i = 0; i < response.length; i++)
				{
					for (let kfzBild of response)
					{
						if(jiterator <= response.length)
						{
							var imgIdentifier = "imgBild_" + jiterator.toString();
							var imgBild = document.getElementById(imgIdentifier);
	
							if(kfzBild.kraftfahrzeug_id == imgBild.dataset.kraftfahrzeugId)
							{
								imgBild.src = "data:image/jpeg;base64," + kfzBild.bild_bytes;
								jiterator++;
							}	
						}
					}
				}
			}, (ex) => 
			{
				alert(ex);
			});
		}, (ex) => 
		{
			alert(ex);
		});
	}

	filterBy(by, value)
	{
		this.app.ApiKraftfahrzeugFilterBy((response) => 
		{
			let html = '';
			let iterator = 1;
			this.Helper = new Helper();
			let currentYear = new Date().getFullYear();
			for (let kraftfahrzeug of response) 
			{
				html += 
				`
				<tr data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}">
					<th scope="row">${iterator}</th>
					<td>${kraftfahrzeug.marke}</td>
					<td>${kraftfahrzeug.modell}</td>
					<td>${this.Helper.GegenstandZustandConverter(kraftfahrzeug.gegenstandzustand)}</td>
					<td>${kraftfahrzeug.aktuellerstandort}</td>
					<td>${kraftfahrzeug.mietpreis}</td>
					<td>${kraftfahrzeug.kennzeichen}</td>
					<td>${currentYear - kraftfahrzeug.baujahr}</td>
					<td>${kraftfahrzeug.klasse}</td>
					<td>${kraftfahrzeug.kategorie}</td>
					<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}"></th>
				</tr>
				`;
				iterator++;
			}

			carListBody.innerHTML = html;
		}, (ex) => 
		{
			alert(ex);
		}, by, value);
	}
}