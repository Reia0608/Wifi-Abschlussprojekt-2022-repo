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
					</tr>
					`;
                    iterator++;
				}

				tbodyCarList.innerHTML = html;

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
			}, (ex) => 
            {
				alert(ex);
			});
		});
	}
}