import Helper from "./helper.js";

export default class PageAusgabenstellenList 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-ausgabenstellen-list.html', args.app.Main, () => 
		{
            const tbodyAusgabenstellen = this.app.Main.querySelector('#tbodyAusgabenstellen');
			const buttonAusgabenstelleNeu = this.app.Main.querySelector('#buttonAusgabenstelleNeu');

			this.app.ApiAusgabenstellenGetList((response) => 
            {
				let html = '';
                let iterator = 1;
				this.Helper = new Helper();
				for (let ausgabenstelle of response) 
                {
					html += 
					`
						<tr data-ausgabenstelle-id="${ausgabenstelle.ausgabenstelle_id}">
							<th scope="row">${iterator}</th>
							<td>${ausgabenstelle.ausgabenstelle_bezeichnung}</td>
							<td>${ausgabenstelle.ausgabenstelle_adresse}</td>
							<td>WIP</td>
						</tr>
					`;
                    iterator++;
				}

				tbodyAusgabenstellen.innerHTML = html;

				//--------------------------------------
				// events
				//--------------------------------------

				// Button Neue Ausgabenstelle-click
				buttonAusgabenstelleNeu.addEventListener('click', ()=>
				{
					window.open('#issuingofficedetails', '_self');
				});

				// ListElement-click
				tbodyAusgabenstellen.addEventListener('click', (pointerCoordinates) => 
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
					else if (pointerCoordinates.target.nodeName == 'TH') 
                    {
						let ausgabenstelle_id = pointerCoordinates.target.parentElement.dataset.ausgabenstelleId;
						window.open('#issuingofficedetails?aid=' + ausgabenstelle_id, '_self');
					}
				});
			}, (ex) => 
            {
				alert(ex);
			});
		});
	}
}