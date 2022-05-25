
import PageLogin from './page-login.js';
import PageMain from './page-home.js';
import PageSignup from './page-signup.js';
import PageSearch from './page-search.js';
import PageProfile from './page-profile.js';
import PageCarsList from './page-cars-list.js';
import PageCarsDetails from './page-cars-details.js';
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
			case '#carlist':
				new PageCarsList(args);
				break;
			case '#cardetails':
				new PageCarsDetails(args);
				break;
			default:
				this.Main.innerHTML = '<div class="alert alert-danger">Fehler! Kein Modul Geladen!</div>'
				break;
		}
	}

	//==================================================================================
	// API calls
	//==================================================================================

	//==================================================================================
	// Seite

	ApiPageInit(successCallback, errorCallback, benutzerMerkmal) 
	{
		fetch(this.apiBaseUrl + 'page/init' + (benutzerMerkmal ? '?bm=' + benutzerMerkmal : '') , 
		{
			method: 'GET'
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				return response.json();
			}
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	//==================================================================================
	// Benutzer

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
			if (response.status == 200 || response.status == 401)
			{
				return response.json();
			} 
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		}).then(successCallback)
		.catch(errorCallback);
	}

	ApiBenutzerLogoff(successCallback, errorCallback) 
	{
		fetch(this.apiBaseUrl + 'benutzer/logoff', {
			method: 'DELETE',
			cache: 'no-cache',
			credentials: 'include'
		})
		.then((response) => {
			if (response.status == 200) 
			{
				return successCallback();
			}
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
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
			if (response.status == 200)
			{
				return response.json();
			} 
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
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
			if (response.status == 200)
			{
				return response.json();
			} 
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	//==================================================================================
	// Kraftfahrzeug

	ApiKraftfahrzeugGetList(successCallback, errorCallback) 
	{
		fetch(this.apiBaseUrl + 'kraftfahrzeug', 
		{
			method: 'GET',
			credentials: 'include'
		}).then((response) => 
		{
			if (response.status == 200)
			{
				return response.json();
			} 
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiKraftfahrzeugGet(successCallback, errorCallback, kraftfahrzeug_id) 
	{
		fetch(this.apiBaseUrl + 'kraftfahrzeug/' + kraftfahrzeug_id, 
		{
			method: 'GET',
			credentials: 'include'
		}).then((response) => 
		{
			if (response.status == 200)
			{
				return response.json();
			} 
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}


	ApiKraftfahrzeugSet(successCallback, errorCallback, kraftfahrzeug) 
	{
		fetch(this.apiBaseUrl + 'kraftfahrzeug' + (kraftfahrzeug.kraftfahrzeug_id ? '/' + kraftfahrzeug.kraftfahrzeug_id : ''), 
		{
			method: kraftfahrzeug.kraftfahrzeug_id ? 'PUT' : 'POST',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(kraftfahrzeug)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				return response.json();
			}
			else if (response.status == 204) 
			{
				errorCallback('Daten sind unvollständig!');
			}
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiKraftfahrzeugSetBild(successCallback, errorCallback, kraftfahrzeug, bild) 
	{
		let data = new FormData();
		data.append("file", bild);

		fetch(this.apiBaseUrl + 'kraftfahrzeug/' + kraftfahrzeug.kraftfahrzeug_id + '/bild', 
		{
			method: 'PUT',
			cache: 'no-cache',
			body: data
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				successCallback();
			}
			else if (response.status == 204) 
			{
				errorCallback('Daten sind unvollständig!');
			}
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.catch(errorCallback);
	}

	ApiKraftfahrzeugDelete(successCallback, errorCallback, id) 
	{
		fetch(this.apiBaseUrl + 'kraftfahrzeug/' + id, 
		{
			method: 'DELETE'
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				return successCallback;
			}
			else if (response.status == 204)
			{
				errorCallback('Daten unvollständig!');
			} 
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.catch(errorCallback);
	}

	//==================================================================================
	// Schaden

	ApiSchadenGetList(successCallback, errorCallback)
	{
		fetch(this.apiBaseUrl + 'schaden', 
		{
			method: 'GET',
			credentials: 'include'
		}).then((response) => 
		{
			if (response.status == 200) 
			{
				return response.json();
			}
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiSchadenGet(successCallback, errorCallback, schaden_id)
	{
		fetch(this.apiBaseUrl + 'schaden' + schaden_id, 
		{
			method: 'GET',
			credentials: 'include'
		}).then((response) => 
		{
			if (response.status == 200)
			{
				return response.json();
			} 
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiSchadenSet(successCallback, errorCallback, schaden)
	{
		fetch(this.apiBaseUrl + 'schaden', 
		{
			method: schaden.schaden_id ? 'PUT' : 'POST',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(schaden)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				return response.json();
			}
			else if (response.status == 204) 
			{
				errorCallback('Daten sind unvollständig!');
			}
			else throw new Error(response.status + ' ' + response.statusText);
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiSchadenSetBild(successCallback, errorCallback, schaden, bild) 
	{
		let data = new FormData();
		data.append("file", bild);

		fetch(this.apiBaseUrl + 'schaden/' + schaden.schaden_id + '/bild', 
		{
			method: 'PUT',
			cache: 'no-cache',
			body: data
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				successCallback();
			}
			else if (response.status == 204) 
			{
				errorCallback('Daten sind unvollständig!');
			}
			else throw new Error(response.status + ' ' + response.statusText);
		})
		.catch(errorCallback);
	}

	ApiSchadenDelete(successCallback, errorCallback, id) 
	{
		fetch(this.apiBaseUrl + 'schaden/' + id, 
		{
			method: 'DELETE'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				return successCallback;
			} 
			else if (response.status == 204)
			{
				errorCallback('Daten unvollständig!');
			} 
			else
			{
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.catch(errorCallback);
	}
}
