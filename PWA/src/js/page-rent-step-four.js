
import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";


export default class PageRentStepFour
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-four.html', appArgs.app.Main, () => 
		{
            // Initialisierung

            const inputButtonZurueck1 = document.querySelector('#inputButtonZurueck1');
            const inputButtonZurueck2 = document.querySelector('#inputButtonZurueck2');
            const inputButtonWeiter1 = document.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = document.querySelector('#inputButtonWeiter2');

            // Variablen

            // Event Listeners

            inputButtonZurueck1.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent-step-three.html', '_self');
            });

            inputButtonZurueck2.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent-step-three.html', '_self');
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent-step-five.html', '_self');
            });

            inputButtonWeiter2.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent-step-five.html', '_self');
            });
        });
    }
}
