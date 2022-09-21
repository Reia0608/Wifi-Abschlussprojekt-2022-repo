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
                args.app.ApiSearchByTerm((response) => 
                {
                    let html = '';
                    if (response.kraftFahrzeugListe && response.kraftFahrzeugListe.length > 0) 
                    {
                        for (let kfz of response.kraftFahrzeugListe) 
                        {
                            html += `
                                <li class="list-group-item bg-dark border-bottom">
                                    <a href="#kraftfahrzeugDetail?aid=${kfz.kraftfahrzeug_id}" class="text-decoration-none">
                                    <div class="d-flex">
                                        <span class="feld-name">Typ:</span><span class="feld-wert">Artikel</span>
                                    </div>
                                    <div class="d-flex">
                                        <span class="feld-name ms-2">Nummer:</span><span class="feld-wert">${kfz.marke}</span>
                                        <span class="feld-name ms-2">Name:</span><span class="feld-wert">${kfz.gegenstandzustand}</span>
                                        <span class="feld-name ms-2">Beschreibung:</span><span class="feld-wert">${kfz.kategorie}</span>
                                    </div>
                                    </a>
                                </li>`;
                        }
                    }

                    if (response.benutzerListe && response.benutzerListe.length > 0) 
                    {
                        for (let benutzer of response.benutzerListe) 
                        {
                            html += `
                                <li class="list-group-item bg-dark border-bottom">
                                <a href="#kraftfahrzeugDetail?aid=${benutzer.benutzer_id}" class="text-decoration-none">
                                    <div class="d-flex">
                                        <span class="feld-name">Typ:</span><span class="feld-wert">Person</span>
                                    </div>
                                    <div class="d-flex">
                                        <span class="feld-name">Name:</span><span class="feld-wert">${benutzer.vorname} ${benutzer.nachname}</span>
                                    </div>
                                </li>`;
                        }
                    }
                    ulSearchResult.innerHTML = html;
			    }, (ex) => 
                {

			    }, searchTerm.value);
            })
		});
    }
}