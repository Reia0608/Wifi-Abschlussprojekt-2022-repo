import Helper from "./helper.js";

export default class PageCarsList 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-cars-list.html', args.app.Main, () => 
		{
			const buttonKfzNeu = this.app.Main.querySelector('#buttonKfzNeu');
            const tbodyCarList = this.app.Main.querySelector('#tbodyCarList');

			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			this.buttonKfzLoeschen = this.app.Main.querySelector('#buttonKfzLoeschen');

			const buttonFilterAlle = this.app.Main.querySelector('#buttonFilterAlle');
			const buttonFilterAlter = this.app.Main.querySelector('#buttonFilterAlter');
			const buttonFilterKlasse = this.app.Main.querySelector('#buttonFilterKlasse');
			const buttonFilterKategorie = this.app.Main.querySelector('#buttonFilterKategorie');

			const dropdownItemPKW = this.app.Main.querySelector('#dropdownItemPKW');
			const dropdownItemLKW = this.app.Main.querySelector('#dropdownItemLKW');
			const dropdownItemAnhaenger = this.app.Main.querySelector('#dropdownItemAnhaenger');
			const dropdownItemNFZ = this.app.Main.querySelector('#dropdownItemNFZ');
			const dropdownItemNKW = this.app.Main.querySelector('#dropdownItemNKW');
			const dropdownItemKTW = this.app.Main.querySelector('#dropdownItemKTW');
			const dropdownItemNAW = this.app.Main.querySelector('#dropdownItemNAW');
			const dropdownItemGKW = this.app.Main.querySelector('#dropdownItemGKW');
			const dropdownItemSonstige2 = this.app.Main.querySelector('#dropdownItemSonstige2');
			const dropdownItemUnbekannt2 = this.app.Main.querySelector('#dropdownItemUnbekannt2');

			const dropdownItemKleinwagen = this.app.Main.querySelector('#dropdownItemKleinwagen');
			const dropdownItemCabrio = this.app.Main.querySelector('#dropdownItemCabrio');
			const dropdownItemCoupe = this.app.Main.querySelector('#dropdownItemCoupe');
			const dropdownItemSUV = this.app.Main.querySelector('#dropdownItemSUV');
			const dropdownItemPickup = this.app.Main.querySelector('#dropdownItemPickup');
			const dropdownItemCombi = this.app.Main.querySelector('#dropdownItemCombi');
			const dropdownItemLimousine = this.app.Main.querySelector('#dropdownItemLimousine');
			const dropdownItemVan = this.app.Main.querySelector('#dropdownItemVan');
			const dropdownItemTransporter = this.app.Main.querySelector('#dropdownItemTransporter');
			const dropdownItemElektroauto = this.app.Main.querySelector('#dropdownItemElektroauto');
			const dropdownItemSportwagen = this.app.Main.querySelector('#dropdownItemSportwagen');
			const dropdownItemOldtimer = this.app.Main.querySelector('#dropdownItemOldtimer');
			const dropdownItemSonstige3 = this.app.Main.querySelector('#dropdownItemSonstige3');
			const dropdownItemUnbekannt3 = this.app.Main.querySelector('#dropdownItemUnbekannt3');

			const dropdownItemAlter = this.app.Main.querySelector('#dropdownItemAlter');
			const formFilterByAlter = document.querySelector("form");

			this.activeButton = buttonFilterAlle;

			this.datenLaden();

			//--------------------------------------
			// events
			//--------------------------------------

			buttonKfzNeu.addEventListener('click', ()=>
			{
				window.open('#cardetails', '_self');
			});

			// ListGroupElement-click
			tbodyCarList.addEventListener('click', (pointerCoordinates) => 
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
				else if (pointerCoordinates.target.nodeName == 'TD') 
				{
					let kraftfahrzeug_id = pointerCoordinates.target.parentElement.dataset.kraftfahrzeugId;
					window.open('#cardetails?kid=' + kraftfahrzeug_id, '_self');
				}
			});

			// Button checkboxAll-click

			this.checkboxAll.addEventListener('click', ()=>
			{
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				let selected = this.checkboxAll.checked;
				for(let checkbox of checkboxCollection) 
				{    
					checkbox.checked = selected; 
				}
			});

			// Button KfZ löschen-click

			this.buttonKfzLoeschen.addEventListener('click', ()=>
			{
				let selectedKfzList = [];
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				for(let checkbox of checkboxCollection) 
				{    
					if(checkbox.checked)
					{
						selectedKfzList.push(checkbox);
					} 
				}
				if(selectedKfzList.length == 0)
				{
					alert("Bitte wählen Sie zunächst die zu löschenden KfZ aus!");
				}
				else
				{
					if(confirm("Sind Sie sicher, dass Sie die gewählten KfZ, deren Schäden und Bilder unwiederruflich löschen wollen?!"))
					{
						let kfzList = [];
						for(let kfz of selectedKfzList)
						{
							kfzList.push(kfz.dataset.kraftfahrzeugId);
						}
						this.app.ApiKraftfahrzeugDelete(() =>
						{
							this.datenLaden();
						}, (ex) =>
						{
							alert(ex);
						}, kfzList);
					}
				}
			});

			//--------------------------------------
			// Button Filter-Alle-click

			buttonFilterAlle.addEventListener('click', ()=>
			{
				this.datenLaden();
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterAlle;
				this.activeButton.classList.add('active');
			});

			//--------------------------------------
			// Button Filter-Alter-submit

			formFilterByAlter.addEventListener('submit', ()=>
			{
				this.filterBy("alter", dropdownItemAlter.value);
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterAlter;
				this.activeButton.classList.add('active');
			});

			//--------------------------------------
			// Button Filter-Klasse-PKW-click

			dropdownItemPKW.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "PKW");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Klasse-LKW-click

			dropdownItemLKW.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "LKW");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});
			
			// Button Filter-Klasse-Anhänger-click

			dropdownItemAnhaenger.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "Anhaenger");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});
			
			// Button Filter-Klasse-NFZ-click

			dropdownItemNFZ.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "NFZ");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});
			
			// Button Filter-Klasse-NKW-click

			dropdownItemNKW.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "NKW");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});
			
			// Button Filter-Klasse-KTW-click

			dropdownItemKTW.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "KTW");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});
		
			// Button Filter-Klasse-NAW-click

			dropdownItemNAW.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "NAW");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});
			
			// Button Filter-Klasse-GKW-click

			dropdownItemGKW.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "GKW");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});
			
			// Button Filter-Klasse-Sonstige2-click

			dropdownItemSonstige2.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "Sonstige");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});
			
			// Button Filter-Klasse-Unbekannt2-click

			dropdownItemUnbekannt2.addEventListener('click', ()=>
			{
				this.filterBy("klasse", "Unbekannt");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKlasse;
				this.activeButton.classList.add('active');
			});

			//--------------------------------------
			// Button Filter-Kategorie-Kleinwagen-click

			dropdownItemKleinwagen.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Kleinwagen");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Cabrio-click

			dropdownItemCabrio.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Cabrio");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Coupe-click

			dropdownItemCoupe.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Coupé");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-SUV-click

			dropdownItemSUV.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "SUV/ Geländewagen");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Pickup-click

			dropdownItemPickup.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Pickup");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Combi-click

			dropdownItemCombi.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Combi");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Limousine-click

			dropdownItemLimousine.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Limousine");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Van-click

			dropdownItemVan.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Van/ Kleinbus");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Transporter-click

			dropdownItemTransporter.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Transporter");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Elektroauto-click

			dropdownItemElektroauto.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Elektroauto");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Sportwagen-click

			dropdownItemSportwagen.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Sportwagen");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Oldtimer-click

			dropdownItemOldtimer.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Oldtimer");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Sonstige3-click

			dropdownItemSonstige3.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Sonstige");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Kategorie-Unbekannt3-click

			dropdownItemUnbekannt3.addEventListener('click', ()=>
			{
				this.filterBy("kategorie", "Unbekannt");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterKategorie;
				this.activeButton.classList.add('active');
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

			tbodyCarList.innerHTML = html;
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

			tbodyCarList.innerHTML = html;
		}, (ex) => 
		{
			alert(ex);
		}, by, value);
	}
}