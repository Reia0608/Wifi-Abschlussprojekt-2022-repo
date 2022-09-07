import LoginManager from './login-manager.js';
import PageHome from './page-home.js';
import PageSignup from './page-signup.js';
import Helper from './helper.js';
import PageLogin from './page-login.js';
import PageProfile from './page-profile.js';
import PageCarsList from './page-car-list.js';
import PageCarDetails from './page-car-details.js';
import PageCars from './page-car-list.js';
import PageRentStepOne from './page-rent-step-one.js';
import PageRentStepTwo from './page-rent-step-two.js';
import PageRentStepThree from './page-rent-step-three.js';
import PageRentStepFour from './page-rent-step-four.js';
import PageRentStepFive from './page-rent-step-five.js';
import PageImprint from './page-imprint.js';
import PageLogout from './page-logout.js';
import Navbar from './component-navbar.js';

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

        if('serviceWorker' in navigator) 
        {
            navigator.serviceWorker
                .register("service-worker.js")
                .then(function() 
                {
                    console.log('SERVICE WORKER registerd!');
                });
        }

		new LoginManager(this);

		//=====================================================
		// common events
		// horcht auf den change des hash parts in der url
		window.addEventListener('hashchange', (e) => 
		{
			this.Navigate(location.hash);
			if(this.displayLogoff)
			{
				this.Navbar = new Navbar(navbarArgs);
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
            case '#logout':
                new PageLogout(args);
                break;
			case '#signup':
				new PageSignup(args);
				break;
			case '#home':
				new PageHome(args);
				break;
			case '#profile':
				new PageProfile(args);
				break;
			case '#carlist':
				new PageCarsList(args);
				break;
			case '#cardetails':
				new PageCarDetails(args);
				break;
			case '#clientdetails':
				new PageProfile(args);
				break;
			case '#profile':
				new PageProfile(args);
			case '#cars':
				new PageCars(args);
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
            case '#imprint':
                new PageImprint(args);
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
	// API Page

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
	// API Benutzer

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
			else if(response.status == 204)
			{
                $('body').removeClass('waiting');
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
                $('body').removeClass('waiting');
				throw new Error(response.status + ' ' + response.statusText);
			} 
		})
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

    ApiBenutzerGetFahrer(successCallback, errorCallback) 
	{
        $('body').addClass('waiting');
		fetch(this.apiBaseUrl + 'benutzer/fahrer', 
		{
			method: 'GET',
			credentials: 'include',
            cache: 'no-cache'
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

    //==================================================================================
	// API Kraftfahrzeug

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
	// API Ausgabenstelle

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

    ApiAusgabenstelleGetId(successCallback, errorCallback, ausgabenstellename)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'ausgabenstelle/getidbyname/' + ausgabenstellename, 
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

    //==================================================================================
	// API Schaden

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
        fetch(apiBaseUrl + 'schaden/' + id, 
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
                $('body').removeClass('waiting');
                throw new Error(response.status + ' ' + response.statusText);
            } 
        })
        .catch(errorCallback);
    }

    // WIP: ApiSchadenSetBild needs to be implemented!

    //==================================================================================
	// API Bilder

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
                return response.json();
            }
            else if (response.status == 204) 
            {
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

    ApiBilderGetAvailableFahrerList(successCallback, errorCallback, fahrerList)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'bilder/availablefahrer/' + fahrerList, 
        {
            method: 'GET',
            // credentials: 'include',
            cache: 'no-cache'
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
				return response.json();
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
		.then(successCallback)
		.catch(errorCallback);
	}

    //==================================================================================
	// API Anhaenger

    ApiAnhaengerGetByAusgabenstelle(successCallback, errorCallback, ausgabenstelle_id)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'anhaenger/byausgabenstelle/' + ausgabenstelle_id, 
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

    //==================================================================================
	// API Bewegung

    ApiRentObjectSet(successCallback, errorCallback, rentObject)
    {
        $('body').addClass('waiting');
        fetch(this.apiBaseUrl + 'bewegung' + (rentObject.mietgegenstand_liste ? '/' + rentObject.mietgegenstand_liste : ''), 
        {
            method: rentObject.kraftfahrzeug_id ? 'PUT' : 'POST',
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

    ApiRentObjectGet(successCallback, errorCallback, bewegung_id)
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
}