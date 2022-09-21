import Helper from "./helper.js";

export default class PageClientList 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-client-list.html', args.app.Main, () => 
		{
			const buttonKundeNeu = this.app.Main.querySelector('#buttonKundeNeu');
            const tbodyClientList = this.app.Main.querySelector('#tbodyClientList');

			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			this.buttonKundeLoeschen = this.app.Main.querySelector('#buttonKundeLoeschen');

			this.datenLaden();

			//--------------------------------------
			// events
			//--------------------------------------

			buttonKundeNeu.addEventListener('click', ()=>
			{
				window.open('#clientdetails', '_self');
			});

			// ListGroupElement-click
			tbodyClientList.addEventListener('click', (pointerCoordinates) => 
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
					let benutzer_id = pointerCoordinates.target.parentElement.dataset.benutzerId;
					window.open('#clientdetails?pid=' + benutzer_id, '_self');
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

			// Button Kunde löschen-click

			this.buttonKundeLoeschen.addEventListener('click', ()=>
			{
				let selectedKundeList = [];
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				for(let checkbox of checkboxCollection) 
				{    
					if(checkbox.checked)
					{
						selectedKundeList.push(checkbox);
					} 
				}
				if(selectedKundeList.length == 0)
				{
					alert("Bitte wählen Sie zunächst die zu löschenden Kunden aus!");
				}
				else
				{
					if(confirm("Sind Sie sicher, dass Sie die gewählten Kunden löschen wollen?!"))
					{
						let kundeList = [];
						for(let kunde of selectedKundeList)
						{
							kundeList.push(kunde.dataset.benutzerId);
						}
						this.app.ApiBenutzerDelete(() =>
						{
							this.datenLaden();
						}, (ex) =>
						{
							alert(ex);
						}, kundeList);
					}
				}
			});

		});
	}

	datenLaden()
	{
		this.app.ApiBenutzerGetList((response) => 
		{
			let html = '';
			let iterator = 1;
			this.Helper = new Helper();
			for (let kunde of response) 
			{
				html += 
				`
				<tr data-benutzer-id="${kunde.userid}">
					<th scope="row">${iterator}</th>
					<td>${kunde.vorname}</td>
					<td>${kunde.nachname}</td>
					<td>${kunde.username}</td>
					<td>${kunde.kundennummer}</td>
					<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-benutzer-id="${kunde.userid}"></th>
				</tr>
				`;
				iterator++;
			}

			tbodyClientList.innerHTML = html;
		}, (ex) => 
		{
			alert(ex);
		}, 0);
	}
}