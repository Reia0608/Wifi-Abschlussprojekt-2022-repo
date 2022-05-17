
export default class ComponentCalendar 
{
	constructor(args) 
	{
		this.target = args.target;
		this.appointments = null;

		args.app.LoadHTML('./component-calendar.html', args.target, () => 
		{
			const buttonPrevMon = args.target.querySelector('#buttonPrevMon');
			const spanButtonCurrMonText = args.target.querySelector('#spanButtonCurrMonText');
			const buttonNextMon = args.target.querySelector('#buttonNextMon');
			let shortFormatter = new Intl.DateTimeFormat(navigator.language, 
			{
				month: 'short',
				year: 'numeric'
			});
			let now = new Date();
			this.currMonthsFirst = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
			this.showMonth(this.currMonthsFirst);
			spanButtonCurrMonText.innerText = shortFormatter.format(this.currMonthsFirst);

			// ------------------------------------
			buttonPrevMon.addEventListener('click', (e) => 
			{
				this.currMonthsFirst.setMonth(this.currMonthsFirst.getMonth() - 1);
				this.showMonth(this.currMonthsFirst);
				spanButtonCurrMonText.innerText = shortFormatter.format(this.currMonthsFirst);
			});

			buttonNextMon.addEventListener('click', (e) => 
			{
				this.currMonthsFirst.setMonth(this.currMonthsFirst.getMonth() + 1);
				this.showMonth(this.currMonthsFirst);
				spanButtonCurrMonText.innerText = shortFormatter.format(this.currMonthsFirst);
			});
		}); // load
	} // constructor

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
		this.showMonth(this.currMonthsFirst);
	}

	//************************************************************
	//private
	//===========================================================
	showMonth(monthsFirst) 
	{
		let shortFormatter = new Intl.DateTimeFormat(navigator.language, 
		{
			month: 'short',
			day: 'numeric'
		});
		const tableMonth = this.target.querySelector('#tableMonth>tbody');

		let nextMonthsFirst = new Date(monthsFirst.getFullYear(), monthsFirst.getMonth(), 1, 0, 0, 0, 0);
		let msPerDay = 24 * 60 * 60 * 1000;
		let dayOfFirst = monthsFirst.getDay() == 0 ? 6 : monthsFirst.getDay() - 1; // 0 = Montag .... 6 = Sonntag
		let mondayBeforeFirst = monthsFirst.getTime() - (dayOfFirst * msPerDay);
		let monthsLastMS = new Date(nextMonthsFirst.setMonth(monthsFirst.getMonth()+1)).getTime() - msPerDay;
		let monthsLast = new Date(monthsLastMS);
		let sundayAfterLastMs = monthsLastMS + (6 - (monthsLast.getDay() == 0 ? 6 : monthsLast.getDay() - 1)) * msPerDay;
		//let sundayAfterLast = new Date(sundayAfterLastMs);

		let html = '';
		let weekDay = 0;
		let oldMonth = -1;
		let dayText = '';
		let currDate = null;
		let currIso = '';
		let currAppointments = null;
		let appointmentHtml = '';
		let appCount = 0;
		for (let currDay = mondayBeforeFirst; currDay <= sundayAfterLastMs; currDay += msPerDay) 
		{
			if (weekDay == 0) 
			{
				if (currDay > mondayBeforeFirst) html+= '</tr>';
				html += '<tr>';
			} 

			currDate = new Date(currDay);
			currIso = currDate.toISOString().split('T')[0];

			if (oldMonth != currDate.getMonth()) 
			{
				oldMonth = currDate.getMonth();
				dayText = shortFormatter.format(currDate);
			}
			else dayText = currDate.getDate();
			
			if (this.appointments && this.appointments.length > 0) 
			{
				currAppointments = this.appointments.filter( a => new Date(a.date).toISOString().split('T')[0] == currIso);
				if (currAppointments && currAppointments.length > 0) 
				{
					appCount = 0;
					for (let appointment of currAppointments) 
					{
						appointmentHtml += `<div class="${appointment.class} rounded-pill py-1 px-3 mb-1">${appointment.text}</div>`;
						if (++appCount > 2) break;
					}
				}
				else 
				{
					appointmentHtml = '';
				}
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
} // class
