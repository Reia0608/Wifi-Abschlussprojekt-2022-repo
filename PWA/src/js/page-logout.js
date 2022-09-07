import Navbar from './component-navbar.js';

export default class PageLogout 
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-logout.html', args.app.Main, () => 
		{
            this.app.ApiBenutzerLogoff(() => 
            {
                let navbarArgs = 
                {
                    app: args.app,
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
        });
    }
}