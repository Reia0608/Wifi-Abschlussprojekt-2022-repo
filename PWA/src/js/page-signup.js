
export default class PageSignup 
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-signup.html', args.app.Main, () => 
		{
            const inputVorname = document.querySelector('#inputVorname');
            const inputNachname = document.querySelector('#inputNachname');
            const inputBenutzer = document.querySelector('#inputBenutzer');
            const inputPasswordFirst = document.querySelector('#inputPasswordFirst');
            const inputPasswordSecond = document.querySelector('#inputPasswordSecond');

            const buttonSave = document.querySelector('#buttonSave');

            //======================================================================
            // events

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
                        location.hash = '#login';
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