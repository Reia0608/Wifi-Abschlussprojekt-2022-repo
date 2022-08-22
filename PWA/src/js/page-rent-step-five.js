import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";


export default class PageRentStepFive
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-five.html', appArgs.app.Main, () => 
		{
            // Initialisierung

            const inputButtonZurueck = document.querySelector('#inputButtonZurueck');
            const inputButtonMieten = document.querySelector('#inputButtonMieten');

            // Event Listeners

            inputButtonZurueck.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent-step-four.html', '_self');
            });

            inputButtonMieten.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent.html', '_self');
            });
        });
    }
}