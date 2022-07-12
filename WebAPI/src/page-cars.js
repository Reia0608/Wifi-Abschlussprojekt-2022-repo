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
        });
	}

	datenLaden()
	{
		this.app.ApiKraftfahrzeugGetCardList((response) => 
		{
			let html = '';
			let iterator = 1;
			this.Helper = new Helper();
			let currentYear = new Date().getFullYear();
			for (let kraftfahrzeug of response) 
			{
				html += 
				`<div class="card cards" style="width: 18rem;">
                    <img src="data:image/jpeg;base64${kraftfahrzeug.bild_bytes}" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" id="imgBild" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeug_id}">
                    <div class="card-body">
                    <h5 class="card-title">${kraftfahrzeug.marke} ${kraftfahrzeug.modell}</h5>
                    <p class="card-text">
                        Alter: ${currentYear - kraftfahrzeug.baujahr} Jahre<br>
                        Klasse: ${kraftfahrzeug.klasse}<br>
                        Kategorie: ${kraftfahrzeug.kategorie}<br>
                        Mietpreis: €${kraftfahrzeug.mietpreis},-<br>
                    </p>
                    <a href="#" class="btn btn-primary">Einzelheiten</a>
                    </div>
                </div>
                `;
				iterator++;
			}

			carListBody.innerHTML = html;
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