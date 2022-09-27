
import "./app.js";

export default class PageDriverAppointments 
{
	constructor(args) 
    {
		this.app = args.app;
		this.appointments = null;

		args.app.LoadHTML('./page-driver-appointments.html', args.app.Main, () => 
        {
            // Initialisierung
			const buttonPreviousMonth = document.querySelector('#buttonPreviousMonth');
			const spanButtonCurrentMonthText = document.querySelector('#spanButtonCurrentMonthText');
			const buttonNextMonth = document.querySelector('#buttonNextMonth');
            const appointmentsBody = document.querySelector('#appointmentsBody');

			let shortFormatter = new Intl.DateTimeFormat(navigator.language, 
            {
				month: 'short',
				year: 'numeric'
			});
			let now = new Date();
			this.currentMonthsFirst = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
			this.showMonth(this.currentMonthsFirst);
			spanButtonCurrentMonthText.innerText = shortFormatter.format(this.currentMonthsFirst);

            this.loadData();

			// Event Listeners
			buttonPreviousMonth.addEventListener('click', (e) => 
            {
				this.currentMonthsFirst.setMonth(this.currentMonthsFirst.getMonth() - 1);
				this.showMonth(this.currentMonthsFirst);
				spanButtonCurrentMonthText.innerText = shortFormatter.format(this.currentMonthsFirst);
			});

			buttonNextMonth.addEventListener('click', (e) => 
            {
				this.currentMonthsFirst.setMonth(this.currentMonthsFirst.getMonth() + 1);
				this.showMonth(this.currentMonthsFirst);
				spanButtonCurrentMonthText.innerText = shortFormatter.format(this.currentMonthsFirst);
			});

            // ListGroupElement-click
			appointmentsBody.addEventListener('click', (pointerCoordinates) => 
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
		}); 
	} 

	//===========================================================
	// properties
	//===========================================================

	get Appointments() 
    {
		return this.appointments;
	}

	set Appointments(value) 
    {
		this.appointments = value;
		this.showMonth(this.currentMonthsFirst);
	}

	//************************************************************
	//private
	//===========================================================
	showMonth(monthsFirst) 
    {
        // Initialisierung
		let shortFormatter = new Intl.DateTimeFormat(navigator.language, 
        {
			month: 'short',
			day: 'numeric'
		});
		const tableMonth = document.querySelector('#tableMonth>tbody');

		let nextMonthsFirst = new Date(monthsFirst.getFullYear(), monthsFirst.getMonth(), 1, 0, 0, 0, 0);
		let msPerDay = 24 * 60 * 60 * 1000;
		let dayOfFirst = monthsFirst.getDay() == 0 ? 6 : monthsFirst.getDay() - 1; // 0 = Montag .... 6 = Sonntag
		let mondayBeforeFirst = monthsFirst.getTime() - (dayOfFirst * msPerDay);
		let monthsLastMS = new Date(nextMonthsFirst.setMonth(monthsFirst.getMonth()+1)).getTime() - msPerDay;
		let monthsLast = new Date(monthsLastMS);
		let sundayAfterLastMs = monthsLastMS + (6 - (monthsLast.getDay() == 0 ? 6 : monthsLast.getDay() - 1)) * msPerDay;

		let html = '';
		let weekDay = 0;
		let oldMonth = -1;
		let dayText = '';
		let currentDate = null;
		let currentIso = '';
		let currentAppointments = null;
		let appointmentHtml = '';
		let appointmentCount = 0;

        // logic
		for (let currentDay = mondayBeforeFirst; currentDay <= sundayAfterLastMs; currentDay += msPerDay) 
        {
			if (weekDay == 0) 
            {
				if (currentDay > mondayBeforeFirst) html+= '</tr>';
				html += '<tr>';
			} 

			currentDate = new Date(currentDay);
			currentIso = currentDate.toISOString().split('T')[0];

			if (oldMonth != currentDate.getMonth()) 
            {
				oldMonth = currentDate.getMonth();
				dayText = shortFormatter.format(currentDate);
			}
			else dayText = currentDate.getDate();
			
			if (this.appointments && this.appointments.length > 0) 
            {
				currentAppointments = this.appointments.filter( a => new Date(a.date).toISOString().split('T')[0] == currentIso);
				if (currentAppointments && currentAppointments.length > 0) 
                {
					appointmentCount = 0;
					for (let appointment of currentAppointments) 
                    {
						appointmentHtml += `<div class="${appointment.class} rounded-pill py-1 px-3 mb-1">${appointment.text}</div>`;
						if (++appointmentCount > 2) break;
					}
				}
				else appointmentHtml = '';
			}

			html += `
				<td>
					<div class="calendar-day-header">${dayText}</div>
					<div class="calendar-day-body">${appointmentHtml}</div>
				</td>
			`;

			weekDay++;
			if (weekDay == 7) weekDay = 0;
		}
		tableMonth.innerHTML = html;
	}

    loadData()
    {
        // Initialisierung
        const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];
        const dateFormatter = new Intl.DateTimeFormat('de-AT', 
        {
            dateStyle: 'short'
        });

        let html = '';

        if(document.cookie)
        {
            this.app.ApiBenutzerGetId((response) =>
            {
                let fahrer_id = response;
                let iterator = 1;
                this.app.ApiRentObjectGetByFahrerId((response) =>
                {
                    if(response.length > 0)
                    {
                        for(let bewegung of response)
                        {
                            html += `<tr data-bewegung-id="${bewegung.bewegung_id}">
                                    <th scope="row">${iterator}</th>
                                    <td>${bewegung.abholort}</td>
                                    <td>${dateFormatter.format(new Date(bewegung.abholdatum))} ${bewegung.abholzeit} </td>
                                    <td>${dateFormatter.format(new Date(bewegung.rueckgabedatum))} ${bewegung.rueckgabezeit}</td>
                                    <td>${bewegung.rueckgabeort}</td>
                                    </tr>`;
                            iterator++;
                        }

                        appointmentsBody.innerHTML = html;
                    }
                }, (ex) => 
                {
                    alert(ex);
                }, fahrer_id);
            }, (ex) => 
            {
                alert(ex);
            }, benutzerMerkmal);
        }
    }
}
