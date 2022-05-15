import "./app.js";

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
				for (let kraftfahrzeug of response) 
                {
					html += `
                        <ul class="list-group list-group-horizontal-sm">
                        <li class="list-group-item col-1 ">${iterator}</li>
                        <li class="list-group-item col-2 ">${kraftfahrzeug.marke}</li>
                        <li class="list-group-item col-3 ">${kraftfahrzeug.modell}</li>
                        <li class="list-group-item col-4 ">${kraftfahrzeug.gegenstandzustand}</li>
                        <li class="list-group-item col-5 ">${kraftfahrzeug.aktuellerstandort}</li>
                        <li class="list-group-item col-6 ">${kraftfahrzeug.mietpreis}</li>
                        <li class="list-group-item col-7 ">${kraftfahrzeug.kennzeichen}</li>
                        </ul>
					`;
                    iterator++;
				}

				ulCarList.innerHTML = html;

				//--------------------------------------
				// events
				//--------------------------------------
				// ListGroupElement-click
				ulCarList.addEventListener('click', (e) => 
                {
					let button = null;

					if (e.target.nodeName == 'PATH' && e.target.parentElement.nodeName == 'SVG' && e.target.parentElement.parentElement.nodeName == 'BUTTON') 
                    {
                        button = e.target.parentElement.parentElement;
                    }
					else if (e.target.nodeName == 'SVG' && e.target.parentElement.nodeName == 'BUTTON')
                    {
                        button = e.target.parentElement;
                    } 
					else if (e.target.nodeName == 'BUTTON') 
                    {
                        button = e.target;
                    }

					if (button) 
                    {

					}
					else if (e.target.nodeName == 'TD') 
                    {
						let kraftfahrzeugid = e.target.parentElement.dataset.kraftfahrzeugid;
						window.open('#kraftfahrzeugdetail?kid=' + kraftfahrzeugid, '_self');
					}
				});

			}, (ex) => 
            {
				alert(ex);
			});
		});
	}
}