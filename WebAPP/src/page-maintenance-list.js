import Helper from "./helper.js";

export default class PageMaintenanceList
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-maintenance-list.html', args.app.Main, () => 
		{
			const buttonWartungNeu = this.app.Main.querySelector('#buttonWartungNeu');
            const tbodyWartungList = this.app.Main.querySelector('#tbodyWartungList');

			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			this.buttonWartungLoeschen = this.app.Main.querySelector('#buttonWartungLoeschen');

			this.datenLaden();

			//--------------------------------------
			// events
			//--------------------------------------

			buttonWartungNeu.addEventListener('click', ()=>
			{
				window.open('#maintenancedetails', '_self');
			});

			// ListGroupElement-click
			tbodyWartungList.addEventListener('click', (pointerCoordinates) => 
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
					let wartungstermin_id = pointerCoordinates.target.parentElement.dataset.wartungsterminId;
					window.open('#maintenancedetails?wtid=' + wartungstermin_id, '_self');
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

			// Button Wartung löschen-click
			this.buttonWartungLoeschen.addEventListener('click', ()=>
			{
				let selectedWartungList = [];
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				for(let checkbox of checkboxCollection) 
				{    
					if(checkbox.checked)
					{
						selectedWartungList.push(checkbox);
					} 
				}
				if(selectedWartungList.length == 0)
				{
					alert("Bitte wählen Sie zunächst die zu löschenden Wartungstermine aus!");
				}
				else
				{
					if(confirm("Sind Sie sicher, dass Sie die gewählten Wartungstermine löschen wollen?!"))
					{
						let wartungList = [];
						for(let wartung of selectedWartungList)
						{
							wartungList.push(wartung.dataset.wartungsterminId);
						}
						this.app.ApiWartungsterminDelete(() =>
						{
							this.datenLaden();
						}, (ex) =>
						{
							alert(ex);
						}, wartungList);
					}
				}
			});

		});
	}

	datenLaden()
	{
        this.app.ApiWartungsterminGetList((response) => 
        {
            if(response.length > 0)
            {
                let html = '';
                let iterator = 1;
                let kraftfahrzeugList = "";
                const dateFormatter = new Intl.DateTimeFormat('de-AT', 
                {
                    dateStyle: 'medium'
                });
                const timeFormatter = new Intl.DateTimeFormat('de-AT', 
                {
                    timeStyle: 'medium'
                })
    
                for (let wartung of response) 
                {
                    html += 
                    `
                    <tr data-wartungstermin-id="${wartung.wartungstermin_id}">
                        <th scope="row">${iterator}</th>
                        <td data-kraftfahrzeug-id=${wartung.kraftfahrzeug_id} id="fahrzeug_${iterator}">${wartung.marke} ${wartung.modell}</td>
                        <td>${dateFormatter.format(new Date(wartung.datum))}</td>
                        <td>${wartung.uhrzeit}</td>
                        <td>${wartung.werkstatt}</td>
                        <td>${dateFormatter.format(new Date(wartung.vorraussichtliches_ende))}</td>
                        <th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-wartungstermin-id="${wartung.wartungstermin_id}"></th>
                    </tr>
                    `;
                    iterator++;
    
                    // Save the kraftfahrzeug_id's to fill out the names later
                    kraftfahrzeugList += wartung.kraftfahrzeug_id.toString() + '_';
                }
    
                tbodyWartungList.innerHTML = html;
    
                this.app.ApiKraftfahrzeugGetSpecificList((response) =>
                {
                    this.Helper = new Helper();
    
                    // Convert kraftfahrzeugList from string to array
                    let kraftfahrzeugArray = this.Helper.StringToArrayConverter(kraftfahrzeugList); 
                    if(response.length > 0)
                    {
                        for(let jiterator = 1; jiterator < iterator; jiterator++)
                        {
                            for (let kraftfahrzeug of response)
                            {
                                for(let element of kraftfahrzeugArray)
                                {
                                    var fahrzeugIdentifier = "fahrzeug_" + jiterator.toString();
                                    var fahrzeugElement = document.getElementById(fahrzeugIdentifier);
            
                                    if(kraftfahrzeug.kraftfahrzeug_id == fahrzeugElement.dataset.kraftfahrzeugId)
                                    {
                                        fahrzeugElement.innerHTML = kraftfahrzeug.marke + ' ' + kraftfahrzeug.modell;
                                    }	
                                }
                            }
                        }
                    }
                }, (ex) =>
                {
                    alert(ex);
                }, kraftfahrzeugList)
            }
        }, (ex) => 
        {
            alert(ex);
        });
    }
}