import "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "./../../node_modules/@iconify/iconify/dist/iconify.min.js";
import "./app.js";

export default class Navbar 
{
	constructor(args) 
	{
		args.app.LoadHTML('./component-navbar.html', args.app.Header, () => 
		{
			this.target = args.app.Header;

            this.linkHome = this.target.querySelector('#linkHome');
			this.linkAnmelden = this.target.querySelector('#linkAnmelden');
			this.linkProfil = this.target.querySelector('#linkProfil');
			this.linkUnsereKFZ = this.target.querySelector('#linkUnsereKFZ');
			this.linkAbmelden = this.target.querySelector('#linkAbmelden');
			this.linkRegistrieren = this.target.querySelector('#linkRegistrieren');
			this.linkImpressum = this.target.querySelector('#linkImpressum');

			// WIP parse component-sidebar.html for the active command and put the correspondent element in activeSideNavButton.
			let activeLink = this.linkHome;
			
			if(args.loggedin)
			{
				this.linkProfil.classList.remove('d-none');
				this.linkAnmelden.classList.add('d-none');
				this.linkAbmelden.classList.remove('d-none');
                this.linkRegistrieren.classList.add('d-none');
			}
			else
			{
				this.linkProfil.classList.add('d-none');
				this.linkAnmelden.classList.remove('d-none');
				this.linkAbmelden.classList.add('d-none');
                this.linkRegistrieren.classList.remove('d-none');
			}

            // WIP: not needed right now

			// if(args.rolle == 1)
			// {
			// 	this.sideNavButtonKfzList.classList.remove('d-none');
			// }
			// else
			// {
			// 	this.sideNavButtonKfzList.classList.add('d-none');
			// }

			this.linkHome.addEventListener('click', (e)=>
			{
				if(activeLink != this.linkHome)
				{
					this.linkHome.classList.add("active");
					activeLink.classList.remove("active");
					activeLink = this.linkHome;
				}
                location.hash = '#home';
			});

            if(this.linkAnmelden)
			{
                this.linkAnmelden.addEventListener('click', (e)=>
                {
                    if(activeLink != this.linkAnmelden)
                    {
                        this.linkAnmelden.classList.add("active");
                        activeLink.classList.remove("active");
                        activeLink = this.linkAnmelden;
                    }
                    location.hash = '#login';
                });
            }

			this.linkProfil.addEventListener('click', (e)=>
			{
				if(activeLink != this.linkProfil)
				{
					this.linkProfil.classList.add("active");
					activeLink.classList.remove("active");
					activeLink = this.linkProfil;
				}
                location.hash = '#profile';
			});

			
			this.linkUnsereKFZ.addEventListener('click', (e)=>
			{
				if(activeLink != this.linkUnsereKFZ)
				{
					this.linkUnsereKFZ.classList.add("active");
					activeLink.classList.remove("active");
					activeLink = this.linkUnsereKFZ;
				}
                location.hash = '#cars';
			});

            if(this.linkAbmelden)
			{
                this.linkAbmelden.addEventListener('click', (e)=>
                {
                    if(activeLink != this.linkAbmelden)
                    {
                        this.linkAbmelden.classList.add("active");
                        activeLink.classList.remove("active");
                        activeLink = this.linkAbmelden;
                    }
                    if (confirm('Wollen Sie sich wirklich abmelden?')) 
                    {
						location.hash = '#logout';
					}
                });
            }

            if(this.linkRegistrieren)
            {
                this.linkRegistrieren.addEventListener('click', (e)=>
                {
                    if(activeLink != this.linkRegistrieren)
                    {
                        this.linkRegistrieren.classList.add("active");
                        activeLink.classList.remove("active");
                        activeLink = this.linkRegistrieren;
                    }
                    location.hash = '#signup';
                });
            }

            this.linkImpressum.addEventListener('click', () => 
            {
                if(activeLink != this.linkImpressum)
                {
                    this.linkImpressum.classList.add("active");
                    activeLink.classList.remove("active");
                    activeLink = this.linkImpressum;
                }
                location.hash = '#imprint';
            });
		});		
	}

	//================================================
	// properties
	//================================================
	
}