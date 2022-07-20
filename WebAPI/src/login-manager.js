import './app.js';
import Sidebar from './component-sidebar.js';
import Banner from './component-banner.js';
import Helper from './helper.js';


export default class LoginManager
{
    constructor(appArgs)
    {
        //=====================================================
		// local constants


        //=====================================================
		// local variables

        let sidebarArgs = 
		{
			app: appArgs,
			loggedin: false,
			displaySidebar: false,
			rolle: 0,
			logoffClick: () =>
			{
				this.Logoff(appArgs);
			}
		};

		let bannerArgs =
		{
			app: appArgs,
			Benutzer: null,
			loggedin: false,
			displayBanner: false,
			displayLogoff: false,
			userName: '',
			logoffClick: () => 
			{
			 	this.Logoff(appArgs);
			}
		}

        //=====================================================
		// login logic

        if (document.cookie) 
		{
            const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];
			if (benutzerMerkmal) 
            {
                appArgs.ApiPageInit((response) => 
                {
                    bannerArgs.loggedin = true;
                    sidebarArgs.loggedin = true;
                    bannerArgs.displayBanner = true;
                    bannerArgs.displayLogoff = true;
                    bannerArgs.Benutzer = response.benutzer;
                    sidebarArgs.rolle = response.benutzer.rolle;
                    switch(response.benutzer.rolle) 
                    {
                        case 1:
                            bannerArgs.userName = response.benutzer.nachname + ' ' + response.benutzer.vorname + ' (' + new Helper().RolleConverter(response.benutzer.rolle)  + ')';
                            break;
                        case 2:
                            bannerArgs.userName = response.benutzer.nachname + ' ' + response.benutzer.vorname + ' (' + new Helper().RolleConverter(response.benutzer.rolle) + ')';
                            break;
                        default:
                            bannerArgs.userName = response.benutzer.nachname + ' ' + response.benutzer.vorname;
                            break;
                    }
                    // navArgs.recht = this.Benutzer.rechttext;
                    // this.GruppeList = r.gruppelist;
                    appArgs.Sidebar = new Sidebar(sidebarArgs);
                    appArgs.Banner = new Banner(bannerArgs)
                    if (!location.hash) location.hash = '#main';
                    appArgs.Navigate(location.hash);
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
                if (location.hash) appArgs.Navigate(location.hash);
                else appArgs.Navigate('#main');
            }
		}
		else 
		{
			bannerArgs.loggedin = false;
			sidebarArgs.loggedin = false;
			bannerArgs.displayBanner = false;
			bannerArgs.displayLogoff = false;
			this.Sidebar = new Sidebar(sidebarArgs);
			this.Banner = new Banner(bannerArgs);
			if (location.hash) appArgs.Navigate(location.hash);
			else appArgs.Navigate('#main');
		}
    }

    //=============================================================================
	// public methods
	//=============================================================================

	Logoff(appArgs) 
	{
		appArgs.ApiBenutzerLogoff(() => 
		{
			let sidebarArgs = 
			{
				app: appArgs,
				loggedin: false,
				displaySidebar: true,
			};

			let bannerArgs =
			{
				app: appArgs,
				loggedin: false,
				displayBanner: true,
				displayLogoff: false,
			}

			this.Sidebar = new Sidebar(sidebarArgs);
			this.Banner = new Banner(bannerArgs);
			window.open('#main', '_self');
			console.log("abgemeldet!");
		}, (ex) => 
		{
			alert(ex);
		});
	}
}