export default class PageSearch
{
    constructor(args)
    {
        this.app = args.app;

		args.app.LoadHTML('./page-search.html', args.app.Main, () => 
        {
            const searchButton = document.getElementById('searchButton');
            const searchTerm = document.getElementById('searchTerm');
			const ulSearchResult = args.app.Main.querySelector('#ulSearchResult');

            searchButton.addEventListener('click', (e)=>
            {
                args.app.ApiPageSearch((response) => 
                {
                    let html = '';
                    if (response.artikellist && response.artikellist.length > 0) 
                    {
                        for (let a of response.artikellist) 
                        {
                            html += `
                                <li class="list-group-item bg-dark border-bottom">
                                    <a href="#artikeldetail?aid=${a.artikelid}" class="text-decoration-none">
                                    <div class="d-flex">
                                        <span class="feld-name">Typ:</span><span class="feld-wert">Artikel</span>
                                    </div>
                                    <div class="d-flex">
                                        <span class="feld-name ms-2">Nummer:</span><span class="feld-wert">${a.nummer}</span>
                                        <span class="feld-name ms-2">Name:</span><span class="feld-wert">${a.name}</span>
                                        <span class="feld-name ms-2">Beschreibung:</span><span class="feld-wert">${a.beschreibung}</span>
                                    </div>
                                    </a>
                                </li>`;
                        }
                    }

                    if (response.personlist && response.personlist.length > 0) 
                    {
                        for (let p of response.personlist) 
                        {
                            html += `
                                <li class="list-group-item bg-dark border-bottom">
                                    <div class="d-flex">
                                        <span class="feld-name">Typ:</span><span class="feld-wert">Person</span>
                                    </div>
                                    <div class="d-flex">
                                        <span class="feld-name">Name:</span><span class="feld-wert">${p.vorname} ${p.name}</span>
                                    </div>
                                </li>`;
                        }
                    }
                    ulSearchResult.innerHTML = html;
			    }, (ex) => 
                {

			    }, searchTerm);
            })
		});
    }
}