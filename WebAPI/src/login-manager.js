import './app.js';
import Sidebar from './component-sidebar.js';
import Banner from './component-banner.js';
import PageLogin from './page-login.js';


export default class LoginManager
{
    constructor(args)
    {
        //=====================================================
		// local constants

        const loginArgs = args;

        //=====================================================
		// local variables

        let sidebarArgs = 
		{
			app: this,
			loggedin: false,
			displayFull: false,
			logoffClick: () =>
			{
				this.logoff();
			}
		};

		let bannerArgs =
		{
			app: this,
			Benutzer: null,
			leggedin: this,
			displayBanner: false,
			displayLogoff: false,
			userName: '',
			logoffClick: () => 
			{
				this.Logoff();
			}
		}

        //=====================================================
		// login logic

        if (document.cookie) 
		{
            const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];
			if (benutzerMerkmal) 
            {
                this.app.ApiPageInit((response) => 
                {
                    bannerArgs.loggedin = true;
                    sidebarArgs.loggedin = true;
                    bannerArgs.displayBanner = true;
                    bannerArgs.displayLogoff = true;
                    bannerArgs.Benutzer = response.benutzer;
                    // this.GruppeList = r.gruppelist;
                    switch(response.benutzer.rolle) 
                    {
                        case 1:
                            bannerArgs.userName = response.benutzer.nachname + ' ' + response.benutzer.vorname + ' (' + response.benutzer.rolle.toString() + ')';
                            break;
                        case 2:
                            bannerArgs.userName = response.benutzer.nachname + ' ' + response.benutzer.vorname + ' (' + response.benutzer.rolle.toString() + ')';
                            break;
                        default:
                            bannerArgs.userName = response.benutzer.nachname + ' ' + response.benutzer.vorname;
                            break;
                    }
                    // navArgs.recht = this.Benutzer.rechttext;
                    // this.GruppeList = r.gruppelist;
                    loginArgs.Sidebar = new Sidebar(sidebarArgs);
                    loginArgs.Banner = new Banner(bannerArgs)
                    if (!location.hash) location.hash = '#main';
                    loginArgs.Navigate(location.hash);
                    console.log("angemeldet!");

                }, (ex) => 
                {
                    alert(ex);
                }, benutzerMerkmal);
            }
            else 
            {
                this.Sidebar = new Sidebar(sidebarArgs);
                this.Banner = new Banner(bannerArgs);
                if (location.hash) loginArgs.Navigate(location.hash);
                else loginArgs.Navigate('#main');
            }
		}
		else 
		{
			this.Sidebar = new Sidebar(sidebarArgs);
			this.Banner = new Banner(bannerArgs);
			if (location.hash) loginArgs.Navigate(location.hash);
			else loginArgs.Navigate('#main');
		}

        
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
    }

    //=============================================================================
	// public methods
	//=============================================================================

    // Bad Solution! Copied from app.js!
    LoadHTML(url, target, loadEvent) 
	{
    	return fetch(url).then(response => response.text()).then((html) => 
		{
			target.innerHTML = html;
			loadEvent();
		});
	}


    // Bad Solution! Copied from app.js!
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
			case '#profile':
				new PageProfile(args);
			default:
				this.Main.innerHTML = '<div class="alert alert-danger">Fehler! Kein Modul Geladen!</div>'
				break;
		}
	}
}