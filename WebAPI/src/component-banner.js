import "./../node_modules/@iconify/iconify/dist/iconify.min.js";
import "./app.js";

export default class Banner 
{
	constructor(args) 
	{
		args.app.LoadHTML('./component-banner.html', args.app.Header, () => 
		{
			this.target = args.app.Header;

			this.bannerLogin = this.target.querySelector('#bannerLogin');
			this.bannerLogoff = this.target.querySelector('#bannerLogoff');
			this.bannerBenutzer = this.target.querySelector('#bannerBenutzer');
			this.divSignIn = this.target.querySelector('#divSignIn');

			if (args.loggedin) 
			{
				this.displayLogoff = true;
				this.bannerLogin.classList.add('d-none');
				this.bannerLogoff.classList.remove('d-none');
				this.bannerBenutzer.innerText = args.userName;
			}

			this.bannerLogin.addEventListener('click', (e)=>
			{
				location.hash = '#login';
			});

			this.bannerLogoff.addEventListener('click', () => {
				if (confirm('Wollen Sie sich wirklich abmelden?')) {
					this.displayLogoff = false;
					args.logoffClick();
				}
			});
		});		
	}

	//================================================
	// properties
	//================================================
	get BannerBenutzer() 
	{
		return this.bannerBenutzer.innerText;
	}
	
	set BannerBenutzer(value) 
	{
			this.bannerBenutzer.innerText = value;
	}
	
	// 	get RechtText() {
	// 	return this.rechtText.innerText;
	//   }
	
	//   set RechtText(value) {
	// 		this.rechtText.innerText = value;
	//   }	
	
		get DisplayTopLine() 
		{
			return this.displayTopLine;
		}
	
		set DisplayTopLine(val) 
		{
			this.displayTopLine = val;
	
			this.target.querySelectorAll('.top-line').forEach(element => {
				if (this.displayTopLine) element.classList.remove('d-none');
				else element.classList.add('d-none');
			});
		}
	
		get DisplayBanner() 
		{
			return this.displayBanner;
		}
		set DisplayBanner(val) 
		{
			this.displayBanner = val;
			if (this.displayBanner == true) this.divSignIn.classList.remove('d-none');
			else this.divSignIn.classList.add('d-none');
		}
	
		get DisplayLogoff()
		{
			return this.displayLogoff;
		}
	
		set DisplayLogoff(val) 
		{
			this.displayLogoff = val;
	
			if (this.displayLogoff) 
			{
				this.bannerLogin.classList.add('d-none');
				this.bannerLogoff.classList.remove('d-none');
			}
			else 
			{
				this.bannerLogin.classList.remove('d-none');
				this.bannerLogoff.classList.add('d-none');
			}
		}


}