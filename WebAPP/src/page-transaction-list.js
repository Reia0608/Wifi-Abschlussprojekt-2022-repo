import Helper from "./helper.js";

export default class PageTransactionList 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-transaction-list.html', args.app.Main, () => 
		{
			const buttonBewegungNeu = this.app.Main.querySelector('#buttonBewegungNeu');
            const tbodyTransactionList = this.app.Main.querySelector('#tbodyTransactionList');

			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			this.buttonBewegungLoeschen = this.app.Main.querySelector('#buttonBewegungLoeschen');

			this.datenLaden();

			//--------------------------------------
			// events
			//--------------------------------------

			buttonBewegungNeu.addEventListener('click', ()=>
			{
				window.open('#transactiondetails', '_self');
			});

			// ListGroupElement-click
			tbodyTransactionList.addEventListener('click', (pointerCoordinates) => 
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
					let bewegung_id = pointerCoordinates.target.parentElement.dataset.bewegungId;
					window.open('#transactiondetails?bid=' + bewegung_id, '_self');
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

			// Button Bewegung löschen-click

			this.buttonBewegungLoeschen.addEventListener('click', ()=>
			{
				let selectedBewegungList = [];
				let checkboxCollection = this.app.Main.querySelectorAll('#checkboxSelect');
				for(let checkbox of checkboxCollection) 
				{    
					if(checkbox.checked)
					{
						selectedBewegungList.push(checkbox);
					} 
				}
				if(selectedBewegungList.length == 0)
				{
					alert("Bitte wählen Sie zunächst die zu löschenden Bewegungen aus!");
				}
				else
				{
					if(confirm("Sind Sie sicher, dass Sie die gewählten Bewegungen löschen wollen?!"))
					{
						let bewegungList = [];
						for(let kunde of selectedBewegungList)
						{
							bewegungList.push(kunde.dataset.bewegungId);
						}
						this.app.ApiBenutzerDelete(() =>
						{
							this.datenLaden();
						}, (ex) =>
						{
							alert(ex);
						}, bewegungList);
					}
				}
			});

		});
	}

	datenLaden()
	{
		this.app.ApiBewegungGetList((response) => 
		{
			let html = '';
			let iterator = 1;
			let benutzerList = "";
			const dateFormatter = new Intl.DateTimeFormat('de-AT', 
			{
				dateStyle: 'medium'
			});

			for (let bewegung of response) 
			{
				html += 
				`
				<tr data-bewegung-id="${bewegung.bewegung_id}">
					<th scope="row">${iterator}</th>
					<td data-benutzer-id=${bewegung.users_id} id="kundeVorname_${iterator}">${bewegung.vorname}</td>
					<td id="kundeNachname_${iterator}">${bewegung.nachname}</td>
					<td>${bewegung.kfz_bezeichnung}</td>
					<td>${bewegung.anhaenger_bezeichnung}</td>
					<td>${bewegung.braucht_fahrer}</td>
					<td>${dateFormatter.format(new Date(bewegung.abholdatum))}</td>
					<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-bewegung-id="${bewegung.bewegung_id}"></th>
				</tr>
				`;
				iterator++;

				// Save the bewegung_id's to fill out the names later
				benutzerList += bewegung.users_id.toString() + '_';
			}

			tbodyTransactionList.innerHTML = html;

			this.app.ApiBenutzerGetSpecificList((response) =>
			{
				this.Helper = new Helper();

				// Convert benutzerList from string to array
				let benutzerArray = this.Helper.StringToArrayConverter(benutzerList); 
				if(response.length > 0)
				{
                    for(let jiterator = 1; jiterator < iterator; jiterator++)
                    {
                        for (let benutzer of response)
                        {
                            for(let element of benutzerArray)
                            {
                                var vornameIdentifier = "kundeVorname_" + jiterator.toString();
								var nachnameIdentifier = "kundeNachname_" + jiterator.toString();
                                var kundeVorname = document.getElementById(vornameIdentifier);
								var kundeNachname = document.getElementById(nachnameIdentifier);
        
                                if(benutzer.userid == kundeVorname.dataset.benutzerId)
                                {
                                    kundeVorname.innerHTML = benutzer.vorname;
									kundeNachname.innerHTML = benutzer.nachname;
                                }	
                            }
                        }
                    }
				}
			}, (ex) =>
			{
				alert(ex);
			}, benutzerList)
		}, (ex) => 
		{
			alert(ex);
		});
	}
}