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
        });
    }
}