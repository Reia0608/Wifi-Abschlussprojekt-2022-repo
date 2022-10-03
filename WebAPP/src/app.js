
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
import PageClientList from './page-client-list.js';
import PageStaffList from './page-staff-list.js';
import PagePersonalProfile from './page-personal-profile.js';
import PageCars from './page-cars.js';
import PageClientCarDetails from './page-client-car-details.js';
import PageRentStepOne from './page-rent-step-one.js';
import PageRentStepTwo from './page-rent-step-two.js';
import PageRentStepThree from './page-rent-step-three.js';
import PageRentStepFour from './page-rent-step-four.js';
import PageRentStepFive from './page-rent-step-five.js';
import PageTransactionList from './page-transaction-list.js';
import PageTransactionToday from './page-transactions-today.js';
import PageTransactionDetails from './page-transaction-details.js';
import PageCarsOffice from './page-cars-office.js';
import PageTrailerClientList from './page-trailer-client-list.js';
import PageTrailerOffice from './page-trailer-office.js';
import PageTransactionFinished from './page-transactions-finished.js';
import PageTransactionOpen from './page-transactions-open.js';
import PageMaintenanceList from './page-maintenance-list.js';
import PageMaintenanceFinished from './page-maintenance-finished.js';
import PageMaintenanceOpen from './page-maintenance-open.js';
import PageMaintenanceToday from './page-maintenance-today.js';
import PageMaintenanceDetails from './page-maintenance-details.js';

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
			case '#clientlist':
				new PageClientList(args);
				break;
			case '#stafflist':
				new PageStaffList(args);
				break;
			case '#personaldetails':
				new PagePersonalProfile(args);
				break;
			case '#clientdetails':
				new PageProfile(args);
				break;
			case '#staffdetails':
				new PageProfile(args);
			case '#cars':
				new PageCars(args);
				break;
			case '#clientcardetails':
				new PageClientCarDetails(args);
				break;
			case '#rentstepone':
				new PageRentStepOne(args);
				break;
			case '#rentsteptwo':
				new PageRentStepTwo(args);
				break;
			case '#rentstepthree':
				new PageRentStepThree(args);
				break;
			case '#rentstepfour':
				new PageRentStepFour(args);
				break;
			case '#rentstepfive':
				new PageRentStepFive(args);
				break;
			case '#transactions':
				new PageTransactionList(args);
				break;
			case '#transactionstoday':
				new PageTransactionToday(args);
				break;
			case '#transactiondetails':
				new PageTransactionDetails(args);
				break;
			case '#carsoffice':
				new PageCarsOffice(args);
				break;
			case '#trailerclientlist':
				new PageTrailerClientList(args);
				break;
			case '#traileroffice':
				new PageTrailerOffice(args);
				break;
			case '#transactionsfinished':
				new PageTransactionFinished(args);
				break;
			case '#transactionsnew':
				new PageTransactionOpen(args);
				break;
			case '#maintenance':
				new PageMaintenanceList(args);
				break;
			case '#maintenancetoday':
				new PageMaintenanceToday(args);
				break;
			case '#maintenancefinished':
				new PageMaintenanceFinished(args);
				break;
			case '#maintenancenew':
				new PageMaintenanceOpen(args);
				break;
			case '#maintenancedetails':
				new PageMaintenanceDetails(args);
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
		fetch(this.apiBaseUrl + 'benutzer' + (benutzer.userid ? '/' + benutzer.userid : ''), 
		{
			method: benutzer.userid ? 'PUT' : 'POST',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(benutzer)
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

	ApiBenutzerSetWOP(successCallback, errorCallback, benutzer) 
{
	$('body').addClass('waiting');
	fetch(this.apiBaseUrl + 'benutzer/wop' + (benutzer.userid ? '/' + benutzer.userid : ''), 
	{
		method: benutzer.userid ? 'PUT' : 'POST',
		cache: 'no-cache',
		headers: 
		{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(benutzer)
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
			throw new Error(response.status + ' ' + response.statusText);
		} 
	})
	.catch(errorCallback);
}

	ApiBenutzerGetById(successCallback, errorCallback, pid) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/pid/' + pid, 
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

	ApiBenutzerGet(successCallback, errorCallback, id) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/' + id, 
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

	ApiBenutzerGetList(successCallback, errorCallback, role) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/allebenutzer/' + role, 
		{
			method: 'GET',
			cache: 'no-cache',
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

	ApiBenutzerDelete(successCallback, errorCallback, benutzerList) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/', 
		{
			method: 'DELETE',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(benutzerList)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				console.log("Benutzer wurden gelöscht!");
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

	ApiBenutzerCheck(successCallback, errorCallback, check) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/check/' + check, 
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

	ApiBenutzerGetFSKList(successCallback, errorCallback, pid)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/fsk/' + pid, 
		{
			method: 'GET',
			cache: 'no-cache',
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

	ApiBenutzerGetFSKObject(successCallback, errorCallback, pid)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/objfsk/' + pid, 
		{
			method: 'GET',
			cache: 'no-cache',
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

	ApiBenutzerFSKAdd(successCallback, errorCallback, pid ,fskList)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/fsk/' + pid,
		{
			method: pid ? 'PUT' : 'POST',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(fskList)
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

	ApiBenutzerGetStaff(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/allstaff', 
		{
			method: 'GET',
			cache: 'no-cache',
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

	ApiBenutzerFilterPersonalBy(successCallback, errorCallback, by, value) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/allstaff/filter/' + by + '/' + value, 
		{
			method: 'GET',
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

	ApiBenutzerGetSpecificList(successCallback, errorCallback, benutzerList)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'benutzer/specific/' + benutzerList, 
        {
            method: 'GET',
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

	ApiKraftfahrzeugGetSpecificList(successCallback, errorCallback, kraftfahrzeugList)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'kraftfahrzeug/specific/' + kraftfahrzeugList, 
        {
            method: 'GET',
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

	ApiGetKraftfahrzeugListByAusgabenstelle(successCallback, errorCallback, ausgabenstelle_id) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'ausgabenstelle/' + ausgabenstelle_id + '/kraftfahrzeug', 
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

	ApiKraftfahrzeugSetAusgabenstelle(successCallback, errorCallback, listToUpdate, ausgabenstelle_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'kraftfahrzeug/ausgabenstelle/' + ausgabenstelle_id, 
		{
			method: 'PUT',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(listToUpdate)
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

	ApiKraftfahrzeugFilterBy(successCallback, errorCallback, by, value) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'kraftfahrzeug/filter/' + by + '/' + value, 
		{
			method: 'GET',
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

	ApiGetAnhaengerListByAusgabenstelle(successCallback, errorCallback, ausgabenstelle_id) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'ausgabenstelle/' + ausgabenstelle_id + '/anhaenger', 
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

	ApiAnhaengerFilterBy(successCallback, errorCallback, by, value) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'anhaenger/filter/' + by + '/' + value, 
		{
			method: 'GET',
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

	ApiAnhaengerSetAusgabenstelle(successCallback, errorCallback, listToUpdate, ausgabenstelle_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'anhaenger/ausgabenstelle/' + ausgabenstelle_id, 
		{
			method: 'PUT',
			cache: 'no-cache',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(listToUpdate)
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

	ApiSchadenSetBild(successCallback, errorCallback, schaden) // WIP!!!!
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

	ApiAusgabenstelleGetList(successCallback, errorCallback)
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

	ApiAusgabenstelleGetIdByName(successCallback, errorCallback, ausgabenstelle_bezeichnung)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'ausgabenstelle/getidbyname/' + ausgabenstelle_bezeichnung, 
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

	ApiAusgabenstelleAllNames(successCallback, errorCallback)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'ausgabenstelle/getallnames', 
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

	ApiAusgabenstelleGetName(successCallback, errorCallback, ausgabenstelle_id)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'ausgabenstelle/standort/' + ausgabenstelle_id, 
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

	ApiAusgabenstelleNamesByKfz(successCallback, errorCallback, marke, modell)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'ausgabenstelle/getbymarkemodell/' + marke + '/' + modell, 
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

	ApiBilderGetBenutzerList(successCallback, errorCallback, users_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/benutzer/' + users_id, 
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

	ApiBilderGetAllKfzList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/kfz', 
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

	ApiBilderGetAllAnhaengerList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/anhaenger', 
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

	ApiKraftfahrzeugGetCardList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'kraftfahrzeug/karten', 
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

	ApiBilderGetKraftfahrzeug(successCallback, errorCallback, kraftfahrzeug_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/singlekfz/' + kraftfahrzeug_id, 
		{
			method: 'GET',
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

	ApiBilderGetSpecificKfzList(successCallback, errorCallback, kfzList)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/specifickfz/' + kfzList, 
		{
			method: 'GET',
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

	ApiBilderGetSpecificAnhaengerList(successCallback, errorCallback, anhaengerList)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/specificanhaenger/' + anhaengerList, 
		{
			method: 'GET',
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

	ApiBilderGetAnhaenger(successCallback, errorCallback, anhaenger_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bilder/anhaenger/' + anhaenger_id, 
		{
			method: 'GET',
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
			method: bild.kraftfahrzeug_id ? 'PUT' : 'POST',
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
				console.log('Daten wurden erfolgreich geschickt!');
			}
			else if (response.status == 204) 
			{
				$('body').removeClass('waiting');
				console.log('Daten sind unvollständig!');
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

	//==================================================================================
	// Bewegung

	ApiBewegungGetList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bewegung', 
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

	ApiBewegungGetTodayList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bewegung/today', 
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

	ApiBewegungGetOpenList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bewegung/open', 
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

	ApiBewegungGetFinishedList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bewegung/finished', 
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

	ApiBewegungSet(successCallback, errorCallback, rentObject)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'bewegung' + (rentObject.bewegung_id ? '/' + rentObject.bewegung_id : ''), 
        {
            method: rentObject.bewegung_id ? 'PUT' : 'POST',
            cache: 'no-cache',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rentObject)
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

    ApiBewegungGet(successCallback, errorCallback, bewegung_id)
    {  
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'bewegung/' + bewegung_id, 
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

    ApiBewegungGetById(successCallback, errorCallback, user_id)
    {  
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'bewegung/user/' + user_id, 
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

    ApiBewegungGetByFahrerId(successCallback, errorCallback, fahrer_id)
    {  
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'bewegung/fahrer/' + fahrer_id, 
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

	ApiBewegungDelete(successCallback, errorCallback, bewegungList) 
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'bewegung/', 
		{
			method: 'DELETE',
			headers: 
			{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bewegungList)
		})
		.then((response) => 
		{
			if (response.status == 200) 
			{
				$('body').removeClass('waiting');
				console.log("Bewegungen wurden gelöscht!");
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
	// Wartungstermin

	ApiWartungsterminGet(successCallback, errorCallback, wartungstermin_id)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'wartungstermin/'+ wartungstermin_id, 
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

	ApiWartungsterminGetList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'wartungstermin', 
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

	ApiWartungsterminGetTodayList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'wartungstermin/today', 
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

	ApiWartungsterminGetOpenList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'wartungstermin/open', 
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

	ApiWartungsterminGetFinishedList(successCallback, errorCallback)
	{
		$('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'wartungstermin/finished', 
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

	ApiWartungsterminSet(successCallback, errorCallback, wartungsTermin)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'wartungstermin' + (wartungsTermin.wartungstermin_id ? '/' + wartungsTermin.wartungstermin_id : ''), 
        {
            method: wartungsTermin.wartungstermin_id ? 'PUT' : 'POST',
            cache: 'no-cache',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rentObject)
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
}
