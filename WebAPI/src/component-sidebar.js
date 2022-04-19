import "./../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "./../node_modules/@iconify/iconify/dist/iconify.min.js";
import "./app.js";

export default class Sidebar 
{
	constructor(args) 
	{
		args.app.LoadHTML('./component-sidebar.html', args.app.Aside, () => 
		{
			this.target = args.app.Aside;

			const buttonOpenClose = document.getElementById('buttonOpenClose');
			this.sideNavButtonLogin = this.target.querySelector('#sideNavButtonLogin');
			this.sideNavButtonLogoff = this.target.querySelector('#sideNavButtonLogoff');
			this.sideNavButtonHome = this.target.querySelector('#sideNavButtonHome');
			this.sideNavButtonSearch = this.target.querySelector('#sideNavButtonSearch');
			const sideBar = document.getElementById('sideBar');
			
			var isOpen = true;
			// WIP parse component-sidebar.html for the active command and put the correspondent element in activeSideNavButton.
			let activeSideNavButton = this.sideNavButtonHome;

			buttonOpenClose.addEventListener('click', (e)=>
			{
				if(sideBar.classList.contains("sidenav-opened"))
				{
					// WIP problem: is it possible to animate the button and the sidenav at the same time?
					sideBar.classList.replace("sidenav-opened", "sidenav-close-animation");
					buttonOpenClose.classList.remove("sidenav-button-close");
					buttonOpenClose.classList.add("sidenav-button-close-animation");
					setTimeout(() => 
					{ 
						// WIP problem: when computer is slow, shows the sidenav for a frame.
						sideBar.classList.replace("sidenav-close-animation", "sidenav-closed");
						buttonOpenClose.classList.remove("sidenav-button-close-animation");
						buttonOpenClose.classList.add("sidenav-button-open");
					}, 1000);
				}
				else
				{
					sideBar.classList.replace("sidenav-closed", "sidenav-open-animation");
					buttonOpenClose.classList.remove("sidenav-button-open");
					buttonOpenClose.classList.add("sidenav-button-open-animation");
					setTimeout(() => 
					{ 
						sideBar.classList.replace("sidenav-open-animation", "sidenav-opened");
						buttonOpenClose.classList.remove("sidenav-button-open-animation");
						buttonOpenClose.classList.add("sidenav-button-close");
					}, 1000);
				}

			});

			this.sideNavButtonHome.addEventListener('click', (e)=>
			{
				location.hash = '#main';
				if(activeSideNavButton != this.sideNavButtonHome)
				{
					this.sideNavButtonHome.classList.add("active");
					activeSideNavButton.classList.remove("active");
					activeSideNavButton = this.sideNavButtonHome;
				}
			});

			this.sideNavButtonSearch.addEventListener('click', (e)=>
			{
				location.hash = '#search';
				if(activeSideNavButton != this.sideNavButtonSearch)
				{
					this.sideNavButtonSearch.classList.add("active");
					activeSideNavButton.classList.remove("active");
					activeSideNavButton = this.sideNavButtonSearch;
				}
			});

			if(this.sideNavButtonLogin)
			{
				this.sideNavButtonLogin.addEventListener('click', (e)=>
				{
					location.hash = '#login';
					if(activeSideNavButton != this.sideNavButtonLogin)
					{
						this.sideNavButtonLogin.classList.add("active");
						activeSideNavButton.classList.remove("active");
						activeSideNavButton = this.sideNavButtonLogin;
					}
				});
			}
			
			if(this.sideNavButtonLogoff)
			{
				this.sideNavButtonLogoff.addEventListener('click', () => {
					if (confirm('Wollen Sie sich wirklich abmelden?')) {
						this.DisplayLogoff = false;
						args.logoffClick();
					}
				});
			}





		});		


	}


	//================================================
	// properties
	//================================================
	get DisplayFull() 
	{
		return this.displayFull;
	}
	set DisplayFull(val) 
	{
		this.displayFull = val;
		if (this.displayFull) this.nav.classList.remove('d-none');
		else this.nav.classList.add('d-none');
	}

	get DisplayLogoff()
	{
		return this.displayLogoff;
	}

	set DisplayLogoff(val) 
	{
		this.displayLogoff = val;

		if (this.displayLogoff) {
			this.sideNavButtonLogin.classList.add('d-none');
			this.sideNavButtonLogoff.classList.remove('d-none');
		}
		else {
			this.sideNavButtonLogin.classList.remove('d-none');
			this.sideNavButtonLogoff.classList.add('d-none');
		}
	}






}