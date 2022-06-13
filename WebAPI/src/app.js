
import PageLogin from './page-login.js';
import PageMain from './page-home.js';
import PageSignup from './page-signup.js';
import PageSearch from './page-search.js';
import PageProfile from './page-profile.js';
import PageCarsList from './page-cars-list.js';
import PageCarsDetails from './page-cars-details.js';
import LoginManager from './login-manager.js';
import PageAusgabenstellenList from './page-ausgabenstellen-list.js';
import PageAusgabenstellenDetails from './page-ausgabenstellen-details.js';
import PageTrailerList from './page-trailer-list.js';
import PageTrailerDetails from './page-trailer-details.js';



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
			case '#issuingofficelist':
				new PageAusgabenstellenList(args);
				break;
			case '#issuingofficedetails':
				new PageAusgabenstellenDetails(args);
				break;
			case '#trailerlist':
				new PageTrailerList(args);
				break;
			case '#trailerdetails':
				new PageTrailerDetails(args);
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
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'page/init' + (benutzerMerkmal ? '?bm=' + benutzerMerkmal : '') , 
		{
			method: 'GET'
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return response.json();
			}
			else
			{
				$('body').removeClass('waiting');
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
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/login', 
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json'}, // 'Content-Type': 'application/x-www-form-urlencoded',
			body: JSON.stringify(args),
			cache: 'no-cache',
			credentials: 'include'
		})
		.then((response)=>
		{
			if (response.status == 200 || response.status == 401)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		}).then(successCallback)
		.catch(errorCallback);
	}

	ApiBenutzerLogoff(successCallback, errorCallback) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/logoff', 
		{
			method: 'DELETE',
			cache: 'no-cache',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return successCallback();
			}
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.catch(errorCallback);
	}


	ApiBenutzerSet(successCallback, errorCallback, benutzer)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer', 
		{
			method: 'POST',
			cache: 'no-cache',
			headers: { 'content-Type': 'application/json'}, // 'Content-Type': 'application/x-www-form-urlencoded'
			body: JSON.stringify(benutzer)
		})
		.then((response)=>
		{
			if(response.status == 200) successCallback();
			else if (response.status == 204) errorCallback('Daten sind unvollständig!');
			else throw new Error(response.status + ' ' + response.statusText);
		}).catch(errorCallback);
	}

	ApiBenutzerGet(successCallback, errorCallback, id) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/' + id, 
		{
			method: 'GET'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiSearchByTerm(successCallback, errorCallback, term) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/search' + (term ? '/' + term : '') , 
		{
			method: 'GET'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
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
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'kraftfahrzeug', 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiKraftfahrzeugGet(successCallback, errorCallback, kraftfahrzeug_id) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'kraftfahrzeug/' + kraftfahrzeug_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}


	ApiKraftfahrzeugSet(successCallback, errorCallback, kraftfahrzeug) 
	{
		$('body').addClass('waiting');
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
				$('body').removeClass('waiting');
				return successCallback('Daten wurden erfolgreich geschickt!');
			}
			else if (response.status == 204) 
			{
				$('body').removeClass('waiting');
				errorCallback('Daten sind unvollständig!');
			}
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.catch(errorCallback);
	}

	ApiKraftfahrzeugDelete(successCallback, errorCallback, kraftfahrzeugList) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'kraftfahrzeug/', 
		{
			method: 'DELETE',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(kraftfahrzeugList)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				console.log("KfZ wurden gelöscht!");
			}
			else if (response.status == 204)
			{
				$('body').removeClass('waiting');
				errorCallback('Daten unvollständig!');
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	//==================================================================================
	// Anhänger

	ApiAnhaengerGetList(successCallback, errorCallback) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'anhaenger', 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiAnhaengerGet(successCallback, errorCallback, anhaenger_id) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'anhaenger/' + anhaenger_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}


	ApiAnhaengerSet(successCallback, errorCallback, anhaenger) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'anhaenger' + (anhaenger.anhaenger_id ? '/' + anhaenger.anhaenger_id : ''), 
		{
			method: anhaenger.anhaenger_id ? 'PUT' : 'POST',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(anhaenger)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return successCallback('Daten wurden erfolgreich geschickt!');
			}
			else if (response.status == 204) 
			{
				$('body').removeClass('waiting');
				errorCallback('Daten sind unvollständig!');
			}
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.catch(errorCallback);
	}

	ApiAnhaengerDelete(successCallback, errorCallback, anhaengerList) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'anhaenger/', 
		{
			method: 'DELETE',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(anhaengerList)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				console.log("Anhänger wurden gelöscht!");
			}
			else if (response.status == 204)
			{
				$('body').removeClass('waiting');
				errorCallback('Daten unvollständig!');
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	//==================================================================================
	// Schaden

	ApiSchadenGetList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'schaden', 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return response.json();
			}
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiSchadenGetKfzList(successCallback, errorCallback, kraftfahrzeug_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'schaden/kfz/' + kraftfahrzeug_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return response.json();
			}
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiSchadenGetAnhaengerList(successCallback, errorCallback, anhaenger_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'schaden/anhaenger/' + anhaenger_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return response.json();
			}
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiSchadenGet(successCallback, errorCallback, schaden_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'schaden' + schaden_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiSchadenSet(successCallback, errorCallback, schaden)
	{
		$('body').addClass('waiting');
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
				$('body').removeClass('waiting');
				return successCallback();
			}
			else if (response.status == 204) 
			{
				$('body').removeClass('waiting');
				errorCallback('Daten sind unvollständig!');
			}
			else throw new Error(response.status + ' ' + response.statusText);
		})
		.catch(errorCallback);
	}

	ApiSchadenDelete(successCallback, errorCallback, id) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'schaden/' + id, 
		{
			method: 'DELETE'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				successCallback();
			} 
			else if (response.status == 204)
			{
				$('body').removeClass('waiting');
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
	// Ausgabenstellen

	ApiAusgabenstellenGetList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'ausgabenstelle', 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiAusgabenstelleGet(successCallback, errorCallback, ausgabenstelle_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'ausgabenstelle/' + ausgabenstelle_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiAusgabenstelleSet(successCallback, errorCallback, ausgabenstelle)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'ausgabenstelle', 
		{
			method: ausgabenstelle.ausgabenstelle_id ? 'PUT' : 'POST',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ausgabenstelle)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return successCallback();
			}
			else if (response.status == 204) 
			{
				$('body').removeClass('waiting');
				errorCallback('Daten sind unvollständig!');
			}
			else throw new Error(response.status + ' ' + response.statusText);
		})
		.catch(errorCallback);
	}

	ApiAusgabenstelleDelete(successCallback, errorCallback, ausgabenstelleList) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'ausgabenstelle/', 
		{
			method: 'DELETE',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ausgabenstelleList)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				console.log("Ausgabestelle(n) gelöscht!");
			}
			else if (response.status == 204)
			{
				$('body').removeClass('waiting');
				errorCallback('Daten unvollständig!');
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
	// Bilder

	ApiBilderGetKfzList(successCallback, errorCallback, kraftfahrzeug_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/kfz/' + kraftfahrzeug_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return response.json();
			}
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiBilderGetAnhaengerList(successCallback, errorCallback, anhaenger_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/anhaenger/' + anhaenger_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return response.json();
			}
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiBilderSet(successCallback, errorCallback, bild)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder', 
		{
			method: bild.bilder_id ? 'PUT' : 'POST',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bild)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return response.json();
			}
			else if (response.status == 204) 
			{
				$('body').removeClass('waiting');
				errorCallback('Daten sind unvollständig!');
			}
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiBilderDelete(successCallback, errorCallback, bilder_id) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/' + bilder_id, 
		{
			method: 'DELETE'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return successCallback;
			} 
			else if (response.status == 204)
			{
				$('body').removeClass('waiting');
				errorCallback('Daten unvollständig!');
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.catch(errorCallback);
	}

	//==================================================================================
	// Adresse

	ApiAdresseGet(successCallback, errorCallback, adresse_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'adresse/' + adresse_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiAdresseGetOfAusgabenstelle(successCallback, errorCallback, ausgabenstelle_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'ausgabenstelle/adresse/' + ausgabenstelle_id, 
		{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => 
		{
			if (response.status == 200)
			{
				$('body').removeClass('waiting');
				return response.json();
			} 
			else
			{
				$('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
		.then(successCallback)
		.catch(errorCallback);
	}

	ApiAdresseSet(successCallback, errorCallback, adresse)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'adresse', 
		{
			method: adresse.adresse_id ? 'PUT' : 'POST',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(adresse)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				return successCallback();
			}
			else if (response.status == 204) 
			{
				$('body').removeClass('waiting');
				errorCallback('Daten sind unvollständig!');
			}
			else throw new Error(response.status + ' ' + response.statusText);
		})
		.catch(errorCallback);
	}
}
