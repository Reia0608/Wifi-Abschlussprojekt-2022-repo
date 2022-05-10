
//import Sidebar from './component-sidebar.js';
//import Banner from './component-banner.js';
import PageLogin from './page-login.js';
import PageMain from './page-home.js';
import PageSignup from './page-signup.js';
import PageSearch from './page-search.js';
import PageProfile from './page-profile.js';
import LoginManager from './login-manager.js';


export default class Application 
{
	constructor() 
	{
		//=====================================================
		// init html parts from 
		this.Body = document.querySelector('body');
		this.Header = document.querySelector('header');
		this.Main = document.querySelector('main');
		this.Footer = document.querySelector('footer');
        this.Aside = document.querySelector('aside');
		this.apiBaseUrl = 'http://localhost:59968/api/';
		this.Benutzer = null;

		new LoginManager(this);

		//=====================================================
		// common events
		// horcht auf den change des hash parts in der url
		window.addEventListener('hashchange', (e) => 
		{
			this.Navigate(location.hash);
			if(this.displayLogoff)
			{
				this.Banner = new Banner(bannerArgs);
			}
		});

		// back navigation im browser
		window.onpopstate = (event) => 
		{
			if (event.state) 
			{
				//console.log(event.state);
				event.state.writeHistory = false;
				this.Navigate(event.state);
			}
		}
	}

	//=============================================================================
	// public methods
	//=============================================================================
	delayTimer(time) 
	{
		return new Promise(resolve => setTimeout(resolve, time));
	}

	LoadHTML(url, target, loadEvent) 
	{
    	return fetch(url).then(response => response.text()).then((html) => 
		{
			target.innerHTML = html;
			loadEvent();
		});
	}

	Navigate(href) 
	{
		let args = { app: this};
		let hrefPart = href.split('?');
		if(hrefPart.length > 1)
		{
			let pars = new URLSearchParams(hrefPart[1]);
			for (let key of pars.keys())
			{
				args[key] = pars.get(key);
			}
		}

		switch(hrefPart[0]) 
		{
			case '#login':
				new PageLogin(args);
				break;
			case '#signup':
				new PageSignup(args);
				break;
			case '#main':
				new PageMain(args);
				break;
			case '#search':
				new PageSearch(args);
				break;
			case '#profile':
				new PageProfile(args);
				break;
			default:
				this.Main.innerHTML = '<div class="alert alert-danger">Fehler! Kein Modul Geladen!</div>'
				break;
		}
	}

	//==================================================================================
	// API calls
	//==================================================================================

	ApiPageInit(successCallback, errorCallback, benutzerMerkmal) 
	{
		fetch(this.apiBaseUrl + 'page/init' + (benutzerMerkmal ? '?bm=' + benutzerMerkmal : '') , 
		{
			method: 'GET'
		})
		.then((response) => 
		{
			if (response.status == 200) return response.json();
			else throw new Error(response.status + ' ' + response.statusText);
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiBenutzerLogin(successCallback, errorCallback, args) 
	{
		fetch(this.apiBaseUrl + 'benutzer/login', 
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json'}, // 'Content-Type': 'application/x-www-form-urlencoded',
			body: JSON.stringify(args),
			cache: 'no-cache',
			credentials: 'include'
		}).then((response)=>
		{
			if (response.status == 200 || response.status == 401) return response.json();
			else throw new Error(response.status + ' ' + response.statusText);
		}).then(successCallback)
		.catch(errorCallback);
	}

	ApiBenutzerLogoff(successCallback, errorCallback) {
		fetch(this.apiBaseUrl + 'benutzer/logoff', {
			method: 'DELETE',
			cache: 'no-cache',
			credentials: 'include'
		})
		.then((r) => {
			if (r.status == 200) successCallback();
			else throw new Error(r.status + ' ' + r.statusText);
		})
		.catch(errorCallback);
	}


	ApiBenutzerSet(successCallback, errorCallback, benutzer)
	{
		fetch(this.apiBaseUrl + 'benutzer', 
		{
			method: 'POST',
			cache: 'no-cache',
			headers: { 'content-Type': 'application/json'}, // 'Content-Type': 'application/x-www-form-urlencoded'
			body: JSON.stringify(benutzer)
		}).then((response)=>
		{
			if(response.status == 200) successCallback();
			else if (response.status == 204) errorCallback('Daten sind unvollständig!');
			else throw new Error(response.status + ' ' + response.statusText);
		}).catch(errorCallback);
	}

	ApiBenutzerGet(successCallback, errorCallback, id) 
	{
		fetch(this.apiBaseUrl + 'benutzer/' + id, 
		{
			method: 'GET'
		})
		.then((response) => 
		{
			if (response.status == 200) return response.json();
			else throw new Error(response.status + ' ' + response.statusText);
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiSearchByTerm(successCallback, errorCallback, term) 
	{
		fetch(this.apiBaseUrl + 'benutzer/search' + (term ? '/' + term : '') , 
		{
			method: 'GET'
		})
		.then((response) => 
		{
			if (response.status == 200) return response.json();
			else throw new Error(response.status + ' ' + response.statusText);
		})
		.then(successCallback)
		.catch(errorCallback);
	}
}
