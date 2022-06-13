import Helper from "./helper.js";

export default class PageAusgabenstellenList 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-ausgabenstellen-list.html', args.app.Main, () => 
		{
            this.tbodyAusgabenstellen = this.app.Main.querySelector('#tbodyAusgabenstellen');
			this.buttonAusgabenstelleNeu = this.app.Main.querySelector('#buttonAusgabenstelleNeu');
			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			this.buttonAusgabenstelleLoeschen = this.app.Main.querySelector('#buttonAusgabenstelleLoeschen');

			// Initialisation
			this.checkboxCollection = [];

			this.datenLaden();

			//--------------------------------------
			// events
			//--------------------------------------

			// Button Neue Ausgabenstelle-click
			this.buttonAusgabenstelleNeu.addEventListener('click', ()=>
			{
				window.open('#issuingofficedetails', '_self');
			});

			// ListElement-click
			this.tbodyAusgabenstellen.addEventListener('click', (pointerCoordinates) => 
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
					let ausgabenstelle_id = pointerCoordinates.target.parentElement.dataset.ausgabenstelleId;
					window.open('#issuingofficedetails?asid=' + ausgabenstelle_id, '_self');
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

			// Button Ausgabenstellen löschen-click

			this.buttonAusgabenstelleLoeschen.addEventListener('click', ()=>
			{
				let selectedAusgabenstelleList = [];
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				for(let checkbox of checkboxCollection) 
				{    
					if(checkbox.checked)
					{
						selectedAusgabenstelleList.push(checkbox);
					} 
				}
				if(selectedAusgabenstelleList.length == 0)
				{
					alert("Bitte wählen Sie zunächst die zu löschenden Ausgabestellen aus!");
				}
				else
				{
					if(confirm("Sind Sie sicher, dass Sie die gewählten Ausgabestellen und deren Adressen unwiederruflich löschen wollen?!"))
					{
						let ausgabenstelleList = [];
						for(let ausgabenstelle of selectedAusgabenstelleList)
						{
							ausgabenstelleList.push(ausgabenstelle.dataset.ausgabenstelleId);
						}
						this.app.ApiAusgabenstelleDelete(() =>
						{
							this.datenLaden();
						}, (ex) =>
						{
							alert(ex);
						}, ausgabenstelleList);
					}
				}
			});
		});
	}

	datenLaden()
	{
			this.app.ApiAusgabenstellenGetList((response) => 
            {
				let html = '';
                let iterator = 1;

				for (let ausgabenstelle of response) 
                {
					let replacedString = ausgabenstelle.ausgabenstelle_adresse.replace(/QXZ/g, '');
					html += 
					`
						<tr data-ausgabenstelle-id="${ausgabenstelle.ausgabenstelle_id}">
							<th scope="row">${iterator}</th>
							<td>${ausgabenstelle.ausgabenstelle_bezeichnung}</td>
							<td>${replacedString}</td>
							<td>WIP</td>
							<td>WIP</td>
							<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-ausgabenstelle-id="${ausgabenstelle.ausgabenstelle_id}"></th>
						</tr>
					`;
                    iterator++;
				}

				this.tbodyAusgabenstellen.innerHTML = html;
			}, (ex) => 
            {
				alert(ex);
			});
	}
}