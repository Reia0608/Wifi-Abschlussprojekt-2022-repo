import Helper from "./helper.js";

export default class PageAusgabenstellenList 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-ausgabenstellen-list.html', args.app.Main, () => 
		{
            const ulIssuingOfficeList = this.app.Main.querySelector('#ulIssuingOfficeList');

			this.app.ApiAusgabenstellenGetList((response) => 
            {
				let html = '';
                let iterator = 1;
				this.Helper = new Helper();
				for (let ausgabenstelle of response) 
                {
					// WIP: putting kraftfahrzeug_id into html code potentially harmful?!
					html += 
					`
                        <ul class="list-group list-group-horizontal-sm clickable" data-kraftfahrzeug-id="${ausgabenstelle.ausgabenstelle_id}">
							<li class="list-group-item col-1" data-kraftfahrzeug-id="${ausgabenstelle.ausgabenstelle_id}>${iterator}</li>
							<li class="list-group-item col-2">test</li>
							<li class="list-group-item col-3">test</li>
                        </ul>
					`;
                    iterator++;
				}

				ulIssuingOfficeList.innerHTML = html;

				//--------------------------------------
				// events
				//--------------------------------------
				// ListElement-click
				ulIssuingOfficeList.addEventListener('click', (pointerCoordinates) => 
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