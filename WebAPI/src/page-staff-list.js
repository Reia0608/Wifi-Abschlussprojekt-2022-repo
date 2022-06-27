import Helper from "./helper.js";

export default class PageStaffList 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-staff-list.html', args.app.Main, () => 
		{
			const buttonPersonalNeu = this.app.Main.querySelector('#buttonPersonalNeu');
            const tbodyStaffList = this.app.Main.querySelector('#tbodyStaffList');

			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			this.buttonPersonalLoeschen = this.app.Main.querySelector('#buttonPersonalLoeschen');

			this.datenLaden();

			//--------------------------------------
			// events
			//--------------------------------------

			buttonPersonalNeu.addEventListener('click', ()=>
			{
				window.open('#staffdetails', '_self');
			});

			// ListGroupElement-click
			tbodyStaffList.addEventListener('click', (pointerCoordinates) => 
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

			// Button Personal löschen-click

			this.buttonPersonalLoeschen.addEventListener('click', ()=>
			{
				let selectedPersonalList = [];
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				for(let checkbox of checkboxCollection) 
				{    
					if(checkbox.checked)
					{
						selectedPersonalList.push(checkbox);
					} 
				}
				if(selectedPersonalList.length == 0)
				{
					alert("Bitte wählen Sie zunächst das zu löschende Personal aus!");
				}
				else
				{
					if(confirm("Sind Sie sicher, dass Sie das gewählte Personal löschen wollen?!"))
					{
						let personalList = [];
						for(let personal of selectedPersonalList)
						{
							personalList.push(personal.dataset.benutzerId);
						}
						this.app.ApiBenutzerDelete(() =>
						{
							this.datenLaden();
						}, (ex) =>
						{
							alert(ex);
						}, personalList);
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
			for (let personal of response) 
			{
				html += 
				`
				<tr data-benutzer-id="${personal.userid}">
					<th scope="row">${iterator}</th>
					<td>${personal.vorname}</td>
					<td>${personal.nachname}</td>
					<td>${personal.username}</td>
					<td>${personal.kundennummer}</td>
					<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-benutzer-id="${personal.userid}"></th>
				</tr>
				`;
				iterator++;
			}

			tbodyStaffList.innerHTML = html;
		}, (ex) => 
		{
			alert(ex);
		}, 2);
	}
}