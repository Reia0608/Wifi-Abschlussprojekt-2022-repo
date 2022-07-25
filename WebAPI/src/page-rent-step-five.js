import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";


export default class PageRentStepFive
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-five.html', appArgs.app.Main, () => 
		{
            // Initialisierung
            const inputButtonZurueck = this.app.Main.querySelector('#inputButtonZurueck');
            const inputButtonMieten = this.app.Main.querySelector('#inputButtonMieten');

            // Event Listeners
            inputButtonZurueck.addEventListener('click', ()=>
            {
                location.hash = '#rentstepfour';
            });

            inputButtonMieten.addEventListener('click', ()=>
            {
                location.hash = '#main';
            });
		});
	}
}