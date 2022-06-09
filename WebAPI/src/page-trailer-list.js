import Helper from "./helper.js";

export default class PageTrailerList 
{
    constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-trailer-list.html', args.app.Main, () => 
		{
			const buttonAnhaengerNeu = this.app.Main.querySelector('#buttonAnhaengerNeu');
            const tbodyTrailerList = this.app.Main.querySelector('#tbodyTrailerList');

			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			this.buttonAnhaengerLoeschen = this.app.Main.querySelector('#buttonAnhaengerLoeschen');

			this.datenLaden();

			//--------------------------------------
			// events
			//--------------------------------------

			buttonAnhaengerNeu.addEventListener('click', ()=>
			{
				window.open('#trailerdetails', '_self');
			});

			// ListGroupElement-click
			tbodyTrailerList.addEventListener('click', (pointerCoordinates) => 
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
					let anhaenger_id = pointerCoordinates.target.parentElement.dataset.anhaengerId;
					window.open('#trailerdetails?aid=' + anhaenger_id, '_self');
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

			// Button Anhänger löschen-click

			this.buttonAnhaengerLoeschen.addEventListener('click', ()=>
			{
				let selectedAnhaengerList = [];
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				for(let checkbox of checkboxCollection) 
				{    
					if(checkbox.checked)
					{
						selectedAnhaengerList.push(checkbox);
					} 
				}
				if(selectedAnhaengerList.length == 0)
				{
					alert("Bitte wählen Sie zunächst die zu löschenden Anhänger aus!");
				}
				else
				{
					if(confirm("Sind Sie sicher, dass Sie die gewählten Anhänger, deren Schäden und Bilder unwiederruflich löschen wollen?!"))
					{
						for(let anhaenger of selectedAnhaengerList)
						{
							this.app.ApiAnhaengerDelete(() =>
							{
								this.datenLaden();
							}, (ex) =>
							{
								alert(ex);
							}, anhaenger.dataset.anhaengerId);
						}
					}
				}
			});

		});
	}

	datenLaden()
	{
		this.app.ApiAnhaengerGetList((response) => 
		{
			let html = '';
			let iterator = 1;
			this.Helper = new Helper();
			for (let anhaenger of response) 
			{
				html += 
				`
				<tr data-anhaenger-id="${anhaenger.anhaenger_id}">
					<th scope="row">${iterator}</th>
					<td>${anhaenger.marke}</td>
					<td>${anhaenger.modell}</td>
					<td>${this.Helper.GegenstandZustandConverter(anhaenger.gegenstandzustand)}</td>
					<td>${anhaenger.aktuellerstandort}</td>
					<td>${anhaenger.mietpreis}</td>
					<td>${anhaenger.kennzeichen}</td>
					<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-anhaenger-id="${anhaenger.anhaenger_id}"></th>
				</tr>
				`;
				iterator++;
			}

			tbodyTrailerList.innerHTML = html;
		}, (ex) => 
		{
			alert(ex);
		});
	}
}