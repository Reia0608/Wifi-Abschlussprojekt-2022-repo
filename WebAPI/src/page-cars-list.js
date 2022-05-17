import Helper from "./helper.js";

export default class PageCarsList 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-cars-list.html', args.app.Main, () => 
		{
            const ulCarList = this.app.Main.querySelector('#ulCarList');

			this.app.ApiKraftfahrzeugGetList((response) => 
            {
				let html = '';
                let iterator = 1;
				this.Helper = new Helper();
				for (let kraftfahrzeug of response) 
                {
					// WIP: putting kraftfahrzeugid into html code potentially harmful?!
					html += `
                        <ul class="list-group list-group-horizontal-sm clickable" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeugid}">
                        <li class="list-group-item col-1" data-kraftfahrzeug-id="${kraftfahrzeug.kraftfahrzeugid}>${iterator}</li>
                        <li class="list-group-item col-2">${kraftfahrzeug.marke}</li>
                        <li class="list-group-item col-3">${kraftfahrzeug.modell}</li>
                        <li class="list-group-item col-4">${this.Helper.GegenstandZustandConverter(kraftfahrzeug.gegenstandzustand)}</li>
                        <li class="list-group-item col-5">${kraftfahrzeug.aktuellerstandort}</li>
                        <li class="list-group-item col-6">${kraftfahrzeug.mietpreis}</li>
                        <li class="list-group-item col-7">${kraftfahrzeug.kennzeichen}</li>
                        </ul>
					`;
                    iterator++;
				}

				ulCarList.innerHTML = html;

				//--------------------------------------
				// events
				//--------------------------------------
				// ListGroupElement-click
				ulCarList.addEventListener('click', (pointerCoordinates) => 
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
					else if (pointerCoordinates.target.nodeName == 'LI') 
                    {
						let kraftfahrzeugid = pointerCoordinates.target.parentElement.dataset.kraftfahrzeugId;
						window.open('#cardetails?kid=' + kraftfahrzeugid, '_self');
					}
				});
			}, (ex) => 
            {
				alert(ex);
			});
		});
	}
}