import "./../../node_modules/@iconify/iconify/dist/iconify.min.js";
import Navbar from './component-navbar.js';
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

            //======================================================================
            // Initialization

            if(document.cookie)
            {
                const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];
                localStorage.setItem("bm", benutzerMerkmal);
            }

            //======================================================================
            // events

            // buttonRegister
            buttonRegister.addEventListener('click', (e) => 
            {
                location.hash = '#signup';
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
                            new LoginManager(this.app);
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