import "./../../node_modules/@iconify/iconify/dist/iconify.min.js";
import "./app.js";
import Helper from "./helper.js";

export default class PageHome
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-home.html', args.app.Main, () => 
		{
			// Intilialisierung
			const tBodyCarList = document.querySelector('#tBodyCarList');

			// Logic
			this.loadData();

			// Event listeners
			tBodyCarList.addEventListener('click', (mouseCoordinates) => 
			{
				let btn = null;
				if (mouseCoordinates.target.nodeName.toUpperCase() == 'PATH' && mouseCoordinates.target.parentElement.nodeName.toUpperCase() == 'SVG' && mouseCoordinates.target.parentElement.parentElement.nodeName == 'BUTTON')
				{
					btn = mouseCoordinates.target.parentElement.parentElement;
				} 
				else if (mouseCoordinates.target.nodeName.toUpperCase() == 'SVG' && mouseCoordinates.target.parentElement.nodeName == 'BUTTON')
				{
					btn = mouseCoordinates.target.parentElement;
				} 
				else if (mouseCoordinates.target.nodeName == 'BUTTON') 
				{
					btn = mouseCoordinates.target;
				}

				if (btn) 
				{
					// Get the letters part of the button id
					let testArray = btn.id.split('_');

					// Check which of the two variant buttons was clicked
					if(testArray[0] == "buttonBewegungBeenden")
					{
						// Bewegung ID
						let id = parseInt(btn.id.split('_')[1], 10);
		
						this.app.ApiRentObjectGet((response) => 
						{
							if(response != null)
							{
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

								localStorage.setItem('kid', this.rentObject.kraftfahrzeug_id);
								localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
								location.hash = '#finishrent';
							}
						}, (ex) => 
						{
							alert(ex);
						}, id);
					}
					else
					{
						// Bewegung ID
						let id = parseInt(btn.id.split('_')[1], 10);
								
						this.app.ApiRentObjectGet((response) => 
						{
							if(response != null)
							{
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

								localStorage.setItem('kid', this.rentObject.kraftfahrzeug_id);
								localStorage.setItem('rentObject', JSON.stringify(this.rentObject));
								location.hash = '#rentstepone';
							}
						}, (ex) => 
						{
							alert(ex);
						}, id);
					}
				}
				else
				{
					//var kid = localStorage.getItem("kid");
					location.hash = "#damagelog";
				}
			});
		});
	}

	loadData()
	{
		// Intilialisierung
		const tBodyCarList = document.querySelector('#tBodyCarList');
		const hGemieteteFahrzeuge = document.querySelector('#hGemieteteFahrzeuge');
		const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];
		const dateFormatter = new Intl.DateTimeFormat('de-AT', 
        {
            dateStyle: 'short'
        });

		hGemieteteFahrzeuge.innerHTML = 'Liste der gemieteten Fahrzeuge:<tr>';

        this.app.ApiBenutzerGetId((response) =>
        {
            let benutzer_id = response;
            this.app.ApiRentObjectGetById((response) =>
            {
				let bewegungList = response;
				let iterator = 1;

				tBodyCarList.innerHTML = '';

				for(let bewegung of bewegungList)
				{
					let brauchtAnhaenger = "Nein";
					let brauchtFahrer = "Nein";
					let html = '';
					if(bewegung.anhaenger_id != null)
					{
						brauchtAnhaenger = "Ja";
					}
					if(bewegung.fahrer_id != null)
					{
						brauchtFahrer = "Ja";
					}
					if(bewegung.bewegung_finished == false)
					{
						html = 
						`<tr data-bewegung-id="${bewegung.bewegung_id}">
							<th scope="row">${iterator}</th>
							<th scope="col"><button type="button" class="btn-outline-info btn-sm" id="buttonBewegungBeenden_${bewegung.bewegung_id}"><span class="iconify" data-icon="ant-design:file-done-outlined" style="font-size: 2rem;"></span></button></th>
							<td>${bewegung.beschreibung}</td>
							<td>${bewegung.preis_gesamt},-€</td>
							<td>${dateFormatter.format(new Date(bewegung.rueckgabedatum))}</td>
							<td>${brauchtAnhaenger}</td>
							<td>${brauchtFahrer}</td>
						</tr>`;
					}
					else
					{
						html = 
						`<tr data-bewegung-id="${bewegung.bewegung_id}">
							<th scope="row">${iterator}</th>
							<th scope="col"><button type="button" class="btn-outline-info btn-sm" id="buttonBewegungMieten_${bewegung.bewegung_id}"><span class="iconify me-2" data-icon="map:car-rental" style="font-size: 2rem;"></span></button></th>
							<td>${bewegung.beschreibung}</td>
							<td>${bewegung.preis_gesamt},-€</td>
							<td>${dateFormatter.format(new Date(bewegung.rueckgabedatum))}</td>
							<td>${brauchtAnhaenger}</td>
							<td>${brauchtFahrer}</td>
						</tr>`;
					}

					iterator++;
					localStorage.setItem("kid", bewegung.kraftfahrzeug_id);
					tBodyCarList.innerHTML += html;
				}
            }, (ex) =>
            {
                alert(ex);
            }, benutzer_id);
        }, (ex) =>
        {
            alert(ex);
        }, benutzerMerkmal);
	}
}