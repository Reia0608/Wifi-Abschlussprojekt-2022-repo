import "./../node_modules/@iconify/iconify/dist/iconify.min.js";
import Sidebar from './component-sidebar.js';
import Banner from './component-banner.js';
import LoginManager from "./login-manager.js";

export default class PageLogin 
{
	constructor(args) 
	{
		this.app = args.app;
		
		args.app.LoadHTML('./page-login.html', args.app.Main, () => 
		{
			const inputUserName = document.getElementById('inputUserName');
			const inputPassword = document.getElementById('inputPassword');
			const passwordButton = document.getElementById('passwordButton');
			const buttonRegister = this.app.Main.querySelector('#buttonRegister');
			const buttonLogin = document.getElementById('buttonLogin');

			//this.app.Sidebar.Display = false;

			// if(args.benutzer)
			// {
			// 	inputUserName.value = args.benutzer;
			// }

			//======================================================================
			// events
			// buttonRegister
			buttonRegister.addEventListener('click', (e) => {
				window.open('#signup', '_self');
			});

			//======================================================================
			// login
			buttonLogin.addEventListener( 'click', () => 
			{
				if (inputUserName.value && inputPassword.value) 
				{
					this.app.ApiBenutzerLogin((response) => 
					{
						if (response.success) 
						{
							console.log('login fetch successful!');
							new LoginManager();
						}
						else 
						{
							alert(response.message);
						}
					}, (ex) => 
					{
						alert(ex);
					}, 
					{
						benutzer: inputUserName.value,
						pwd: inputPassword.value
					});
				}
				else
				{
					alert('Benutzer/Passwort fehlt!!!');
				} 
			})

			//======================================================================
			// eye-con

			passwordButton.addEventListener('click', (e)=>
			{
				if(passwordButton.dataset.view == 'off')
				{
					passwordButton.dataset.view = 'on';
					passwordButton.innerHTML = '<span class="iconify" data-icon="mdi-eye-outline"></span>';
					inputPassword.type = "text";
				}
				else
				{
					passwordButton.dataset.view = 'off';
					passwordButton.innerHTML = '<span class="iconify" data-icon="mdi-eye-off-outline"></span>';
					inputPassword.type = "password";
				}
			});

		});
	}

}