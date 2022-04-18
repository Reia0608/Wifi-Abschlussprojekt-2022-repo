
export default class PageSignup {
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-signup.html', args.app.Main, () => 
		{
			const inputVorname = this.app.Main.querySelector('#inputVorname');
			const inputNachname = this.app.Main.querySelector('#inputNachname');
			const inputBenutzer = this.app.Main.querySelector('#inputBenutzer');
			const inputPasswordFirst = this.app.Main.querySelector('#inputPasswordFirst');
			const inputPasswordSecond = this.app.Main.querySelector('#inputPasswordSecond');

			const buttonSave = this.app.Main.querySelector('#buttonSave');

			buttonSave.addEventListener( 'click', (e) => 
			{

				if (inputPasswordFirst.value == inputPasswordSecond.value) 
				{
					let benutzer = 
					{
						vorname: inputVorname.value,
						nachname: inputNachname.value,
						username: inputBenutzer.value,
						passwort: inputPasswordFirst.value
					};

					this.app.ApiBenutzerSet(() => 
					{
						window.open('#login?benutzer=' + inputBenutzer.value, '_self');
					}, (ex) => 
					{
						alert(ex);
					}, benutzer);

				}
				else 
				{
					alert('Passwort Wiederholung passt nicht');
				}


			});
		});
	}

}