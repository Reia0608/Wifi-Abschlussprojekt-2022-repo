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

			const buttonClose = document.getElementById('buttonClose');
			const buttonOpen = document.getElementById('buttonOpen');
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
					sideBar.classList.remove("sidenav-opened");
					buttonClose.classList.remove("sidenav-button-close");
					sideBar.classList.add("sidenav-close-animation");
					buttonClose.classList.add("sidenav-button-close-animation");
					setTimeout(() => 
					{ 
						sideBar.classList.remove("sidenav-close-animation");
						buttonClose.classList.remove("sidenav-button-close-animation");
						sideBar.classList.add("sidenav-closed");
						buttonClose.classList.add("d-none");
						buttonOpen.classList.remove("d-none");
					}, 1000);
				}
				else
				{
					sideBar.classList.remove("sidenav-closed");
					buttonOpen.classList.remove("sidenav-button-open");
					sideBar.classList.add("sidenav-open-animation");
					buttonOpen.classList.add("sidenav-button-open-animation");
					setTimeout(() => 
					{ 
						sideBar.classList.remove("sidenav-open-animation");
						buttonOpen.classList.remove("sidenav-button-open-animation");
						sideBar.classList.add("sidenav-opened");
						buttonClose.classList.remove("d-none");
						buttonOpen.classList.add("d-none");
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