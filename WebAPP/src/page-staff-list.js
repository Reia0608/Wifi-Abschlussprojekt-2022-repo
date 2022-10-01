import Helper from "./helper.js";
import "./../node_modules/@popperjs/core/dist/umd/popper.min.js";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";

export default class PageStaffList 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-staff-list.html', args.app.Main, () => 
		{
			const buttonPersonalNeu = this.app.Main.querySelector('#buttonPersonalNeu');
            const tbodyStaffList = this.app.Main.querySelector('#tbodyStaffList');
			const buttonFilterAlle = this.app.Main.querySelector('#buttonFilterAlle');
			const buttonFilterRecht = this.app.Main.querySelector('#buttonFilterRecht');
			const buttonFilterLenkerberechtigung = this.app.Main.querySelector('#buttonFilterLenkerberechtigung');
			const buttonFilterStatus = this.app.Main.querySelector('#buttonFilterStatus');
			const dropdownItemUnbekannt = this.app.Main.querySelector('#dropdownItemUnbekannt');
			const dropdownItemFrei = this.app.Main.querySelector('#dropdownItemFrei');
			const dropdownItemTermin = this.app.Main.querySelector('#dropdownItemTermin');
			const dropdownItemKrank = this.app.Main.querySelector('#dropdownItemKrank');
			const dropdownItemUrlaub = this.app.Main.querySelector('#dropdownItemUrlaub');
			const dropdownItemKeinFahrer = this.app.Main.querySelector('#dropdownItemKeinFahrer');
			const dropdownItemKunde = this.app.Main.querySelector('#dropdownItemKunde');
			const dropdownItemUser = this.app.Main.querySelector('#dropdownItemUser');
			const dropdownItemAdmin = this.app.Main.querySelector('#dropdownItemAdmin');
			const dropdownItemOffice = this.app.Main.querySelector('#dropdownItemOffice');
			const dropdownItemAM = this.app.Main.querySelector('#dropdownItemAM');
			const dropdownItemA1 = this.app.Main.querySelector('#dropdownItemA1');
			const dropdownItemA2 = this.app.Main.querySelector('#dropdownItemA1');
			const dropdownItemA = this.app.Main.querySelector('#dropdownItemA');
			const dropdownItemB1 = this.app.Main.querySelector('#dropdownItemB1');
			const dropdownItemB = this.app.Main.querySelector('#dropdownItemB');
			const dropdownItemC1 = this.app.Main.querySelector('#dropdownItemC1');
			const dropdownItemC = this.app.Main.querySelector('#dropdownItemC');
			const dropdownItemD1 = this.app.Main.querySelector('#dropdownItemD1');
			const dropdownItemD = this.app.Main.querySelector('#dropdownItemAM');
			const dropdownItemBE = this.app.Main.querySelector('#dropdownItemBE');
			const dropdownItemC1E = this.app.Main.querySelector('#dropdownItemC1E');
			const dropdownItemCE = this.app.Main.querySelector('#dropdownItemCE');
			const dropdownItemD1E = this.app.Main.querySelector('#dropdownItemD1E');
			const dropdownItemDE = this.app.Main.querySelector('#dropdownItemDE');
			const dropdownItemF = this.app.Main.querySelector('#dropdownItemF');

			this.checkboxAll = this.app.Main.querySelector('#checkboxAll');
			this.buttonPersonalLoeschen = this.app.Main.querySelector('#buttonPersonalLoeschen');
			this.activeButton = buttonFilterAlle;

			this.datenLaden();

			//--------------------------------------
			// events
			//--------------------------------------

			buttonPersonalNeu.addEventListener('click', ()=>
			{
				window.open('#clientdetails', '_self');
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
			// Button Filter-Recht-Kunde-click

			dropdownItemKunde.addEventListener('click', ()=>
			{
				this.filterBy("rolle", "Kunde");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterRecht;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Recht-User-click

			dropdownItemUser.addEventListener('click', ()=>
			{
				this.filterBy("rolle", "User");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterRecht;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Recht-Admin-click

			dropdownItemAdmin.addEventListener('click', ()=>
			{
				this.filterBy("rolle", "Admin");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterRecht;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Recht-Office-click

			dropdownItemOffice.addEventListener('click', ()=>
			{
				this.filterBy("rolle", "Office");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterRecht;
				this.activeButton.classList.add('active');
			});

			//--------------------------------------
			// Button Filter-Lenkerberechtigung-AM-click

			dropdownItemAM.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "am");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-A1-click

			dropdownItemA1.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "a1");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-A2-click

			dropdownItemA2.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "a2");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-A-click

			dropdownItemA.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "a");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-B1-click

			dropdownItemB1.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "b1");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-B-click

			dropdownItemB.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "b");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-C1-click

			dropdownItemC1.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "c1");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-C-click

			dropdownItemC.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "c");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-D1-click

			dropdownItemD1.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "d1");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-D-click

			dropdownItemD.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "d");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-BE-click

			dropdownItemBE.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "be");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-C1E-click

			dropdownItemC1E.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "c1e");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-CE-click

			dropdownItemCE.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "ce");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-D1E-click

			dropdownItemD1E.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "d1e");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-DE-click

			dropdownItemDE.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "de");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Lenkerberechtigung-F-click

			dropdownItemF.addEventListener('click', ()=>
			{
				this.filterBy("fsk", "f");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterLenkerberechtigung;
				this.activeButton.classList.add('active');
			});

			//--------------------------------------
			// Button Filter-Status-click

			buttonFilterStatus.addEventListener('click', ()=>
			{
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterStatus;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Status-Unbekannt-click

			dropdownItemUnbekannt.addEventListener('click', ()=>
			{
				this.filterBy("status", "unbekannt");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterStatus;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Status-Frei-click

			dropdownItemFrei.addEventListener('click', ()=>
			{
				this.filterBy("status", "frei");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterStatus;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Status-Termin-click

			dropdownItemTermin.addEventListener('click', ()=>
			{
				this.filterBy("status", "termin");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterStatus;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Status-Krank-click

			dropdownItemKrank.addEventListener('click', ()=>
			{
				this.filterBy("status", "krank");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterStatus;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Status-Urlaub-click

			dropdownItemUrlaub.addEventListener('click', ()=>
			{
				this.filterBy("status", "urlaub");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterStatus;
				this.activeButton.classList.add('active');
			});

			// Button Filter-Status-Kein-Fahrer-click

			dropdownItemKeinFahrer.addEventListener('click', ()=>
			{
				this.filterBy("status", "keinFahrer");
				this.activeButton.classList.remove('active');
				this.activeButton = buttonFilterStatus;
				this.activeButton.classList.add('active');
			});
		});
	}

	datenLaden()
	{
		this.app.ApiBenutzerGetStaff((response) => 
		{
			let html = '';
			let iterator = 1;
			this.Helper = new Helper();
			for (let personal of response) 
			{
				let fsk = '';
				if (personal.am)
				{
					fsk += 'AM, ';
				}
				if (personal.a1)
				{
					fsk += 'A1, ';
				}
				if (personal.a2)
				{
					fsk += 'A2, ';
				}
				if (personal.a)
				{
					fsk += 'A, ';
				}
				if (personal.b1)
				{
					fsk += 'B1, ';
				}
				if (personal.b)
				{
					fsk += 'B, ';
				}
				if (personal.c1)
				{
					fsk += 'C1, ';
				}
				if (personal.c)
				{
					fsk += 'C, ';
				}
				if (personal.d1)
				{
					fsk += 'D1, ';
				}
				if (personal.d)
				{
					fsk += 'D, ';
				}
				if (personal.be)
				{
					fsk += 'BE, ';
				}
				if (personal.c1e)
				{
					fsk += 'C1E, ';
				}
				if (personal.ce)
				{
					fsk += 'CE, ';
				}
				if (personal.d1e)
				{
					fsk += 'D1E, ';
				}
				if (personal.de)
				{
					fsk += 'DE, ';
				}
				if (personal.f)
				{
					fsk += 'F, ';
				}

				html += 
				`
				<tr data-benutzer-id="${personal.userid}">
					<th scope="row">${iterator}</th>
					<td>${personal.vorname}</td>
					<td>${personal.nachname}</td>
					<td>${personal.username}</td>
					<td>${new Helper().StatusConverter(personal.status)}</td>
					<td>${fsk}</td>
					<td>${new Helper().RolleConverter(personal.rolle)}</td>
					<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-benutzer-id="${personal.userid}"></th>
				</tr>
				`;
				iterator++;
			}

			tbodyStaffList.innerHTML = html;
		}, (ex) => 
		{
			alert(ex);
		});
	}

	filterBy(by, value)
	{
		this.app.ApiBenutzerFilterPersonalBy((response) => 
		{
			let html = '';
			let iterator = 1;
			this.Helper = new Helper();
			for (let personal of response) 
			{
				let fsk = '';
				if (personal.am)
				{
					fsk += 'AM, ';
				}
				if (personal.a1)
				{
					fsk += 'A1, ';
				}
				if (personal.a2)
				{
					fsk += 'A2, ';
				}
				if (personal.a)
				{
					fsk += 'A, ';
				}
				if (personal.b1)
				{
					fsk += 'B1, ';
				}
				if (personal.b)
				{
					fsk += 'B, ';
				}
				if (personal.c1)
				{
					fsk += 'C1, ';
				}
				if (personal.c)
				{
					fsk += 'C, ';
				}
				if (personal.d1)
				{
					fsk += 'D1, ';
				}
				if (personal.d)
				{
					fsk += 'D, ';
				}
				if (personal.be)
				{
					fsk += 'BE, ';
				}
				if (personal.c1e)
				{
					fsk += 'C1E, ';
				}
				if (personal.ce)
				{
					fsk += 'CE, ';
				}
				if (personal.d1e)
				{
					fsk += 'D1E, ';
				}
				if (personal.de)
				{
					fsk += 'DE, ';
				}
				if (personal.f)
				{
					fsk += 'F, ';
				}

				html += 
				`
				<tr data-benutzer-id="${personal.userid}">
					<th scope="row">${iterator}</th>
					<td>${personal.vorname}</td>
					<td>${personal.nachname}</td>
					<td>${personal.username}</td>
					<td>${new Helper().StatusConverter(personal.status)}</td>
					<td>${fsk}</td>
					<td>${new Helper().RolleConverter(personal.rolle)}</td>
					<th scope="col"><input class="form-check-input" type="checkbox" value="" id="checkboxSelect" data-benutzer-id="${personal.userid}"></th>
				</tr>
				`;
				iterator++;
			}

			tbodyStaffList.innerHTML = html;
		}, (ex) => 
		{
			alert(ex);
		}, by, value);
	}
}