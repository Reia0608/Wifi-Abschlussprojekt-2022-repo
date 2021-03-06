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

			this.sideNavButtonLogin = this.target.querySelector('#sideNavButtonLogin');
			this.sideNavButtonLogoff = this.target.querySelector('#sideNavButtonLogoff');
			this.sideNavButtonHome = this.target.querySelector('#sideNavButtonHome');
			this.sideNavButtonSearch = this.target.querySelector('#sideNavButtonSearch');
			this.sideNavButtonProfile = this.target.querySelector('#sideNavButtonProfile');
			this.sideNavButtonKfzList = this.target.querySelector('#sideNavButtonKfzList');
			this.sideNavButtonCarList = this.target.querySelector('#sideNavButtonCarList');

			// WIP parse component-sidebar.html for the active command and put the correspondent element in activeSideNavButton.
			let activeSideNavButton = this.sideNavButtonHome;
			
			if(args.loggedin)
			{
				this.sideNavButtonProfile.classList.remove('d-none');
				this.sideNavButtonLogin.classList.add('d-none');
				this.sideNavButtonLogoff.classList.remove('d-none');
			}
			else
			{
				this.sideNavButtonProfile.classList.add('d-none');
				this.sideNavButtonLogin.classList.remove('d-none');
				this.sideNavButtonLogoff.classList.add('d-none');
			}

			if(args.rolle == 1)
			{
				this.sideNavButtonKfzList.classList.remove('d-none');
			}
			else
			{
				this.sideNavButtonKfzList.classList.add('d-none');
			}

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

			this.sideNavButtonProfile.addEventListener('click', (e)=>
			{
				location.hash = '#personaldetails';
				if(activeSideNavButton != this.sideNavButtonProfile)
				{
					this.sideNavButtonProfile.classList.add("active");
					activeSideNavButton.classList.remove("active");
					activeSideNavButton = this.sideNavButtonProfile;
				}
			});

			
			this.sideNavButtonKfzList.addEventListener('click', (e)=>
			{
				location.hash = '#carlist';
				if(activeSideNavButton != this.sideNavButtonKfzList)
				{
					this.sideNavButtonKfzList.classList.add("active");
					activeSideNavButton.classList.remove("active");
					activeSideNavButton = this.sideNavButtonKfzList;
				}
			});

			this.sideNavButtonCarList.addEventListener('click', (e)=>
			{
				location.hash = '#cars';
				if(activeSideNavButton != this.sideNavButtonCarList)
				{
					this.sideNavButtonCarList.classList.add("active");
					activeSideNavButton.classList.remove("active");
					activeSideNavButton = this.sideNavButtonCarList;
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
				this.sideNavButtonLogoff.addEventListener('click', () => 
				{
					// Does not work as intended. Abmelden button only becomes active after canceling the confirm. WIP
					this.sideNavButtonLogoff.classList.add("active");
					activeSideNavButton.classList.remove("active");
					activeSideNavButton = this.sideNavButtonLogoff;
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
	get DisplaySidebar() 
	{
		return this.displaySidebar;
	}
	set DisplaySidebar(value) 
	{
		this.displaySidebar = value;
		if (this.displaySidebar) this.nav.classList.remove('d-none');
		else this.nav.classList.add('d-none');
	}

	get DisplayLogoff()
	{
		return this.displayLogoff;
	}
	// unnecessary?
	set DisplayLogoff(value) 
	{
		this.displayLogoff = value;

		if (this.displayLogoff) 
		{
			this.sideNavButtonLogin.classList.add('d-none');
			this.sideNavButtonLogoff.classList.remove('d-none');
		}
		else 
		{
			this.sideNavButtonLogin.classList.remove('d-none');
			this.sideNavButtonLogoff.classList.add('d-none');
		}
	}

	get DisplayCarList()
	{
		return this.DisplayCarList;
	}
	set DisplayCarList(value)
	{
		this.DisplayCarList = value;

		if(this.displayCarList)
		{
			this.sideNavButtonCarList.classList.add('d-none');
		}
		else
		{
			this.sideNavButtonCarList.classList.remove('d-none');
		}
	}
}