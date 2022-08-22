import './app.js';
import Navbar from './component-navbar.js';
//import Helper from './helper.js';


export default class LoginManager
{
    constructor(appArgs)
    {
        //=====================================================
		// local constants


        //=====================================================
		// local variables

        let navbarArgs = 
		{
			app: appArgs,
			loggedin: false,
			rolle: 0,
		};

        //======================================================================
        // Initialization

        if (document.cookie) 
		{
            const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];
			if (benutzerMerkmal) 
            {
                appArgs.ApiPageInit((response) => 
                {
                    navbarArgs.loggedin = true;
                    navbarArgs.rolle = response.benutzer.rolle;
                    // switch(response.benutzer.rolle) 
                    // {
                    //     case 1:
                    //         bannerArgs.userName = response.benutzer.nachname + ' ' + response.benutzer.vorname + ' (' + new Helper().RolleConverter(response.benutzer.rolle)  + ')';
                    //         break;
                    //     case 2:
                    //         bannerArgs.userName = response.benutzer.nachname + ' ' + response.benutzer.vorname + ' (' + new Helper().RolleConverter(response.benutzer.rolle) + ')';
                    //         break;
                    //     default:
                    //         bannerArgs.userName = response.benutzer.nachname + ' ' + response.benutzer.vorname;
                    //         break;
                    // }
                    appArgs.Navbar = new Navbar(navbarArgs);
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
                this.Navbar = new Navbar(navbarArgs);
                if (location.hash) appArgs.Navigate(location.hash);
                else appArgs.Navigate('#main');
            }
		}
		else 
		{
			navbarArgs.loggedin = false;
			this.Navbar = new Navbar(navbarArgs);
			if (location.hash) appArgs.Navigate(location.hash);
			else appArgs.Navigate('#main');
		}

        //======================================================================
        // events

        

        //======================================================================
        // login


        //======================================================================
        // API
    
    }

    //=============================================================================
	// public methods
	//=============================================================================

	Logoff(appArgs) 
	{
		appArgs.ApiBenutzerLogoff(() => 
		{
			let navbarArgs = 
			{
				app: appArgs,
				loggedin: false,
				rolle: 3,
			};

			this.Navbar = new Navbar(navbarArgs);
			window.open('#logout', '_self');
			console.log("abgemeldet!");
		}, (ex) => 
		{
			alert(ex);
		});
	}
}