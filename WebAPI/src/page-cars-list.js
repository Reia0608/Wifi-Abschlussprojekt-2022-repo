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

		});
	}

	datenLaden()
	{
		this.app.ApiKraftfahrzeugGetList((response) => 
		{
			let html = '';
			let iterator = 1;
			this.Helper = new Helper();
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
}