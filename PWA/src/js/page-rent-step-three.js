
import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
//import "./../node_modules/jquery/dist/jquery.min.js";
import "./app.js";


export default class PageRentStepThree
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-three.html', appArgs.app.Main, () => 
		{
            // Initialisierung

            const inputButtonZurueck1 = document.querySelector('#inputButtonZurueck1');
            const inputButtonZurueck2 = document.querySelector('#inputButtonZurueck2');
            const inputButtonWeiter1 = document.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = document.querySelector('#inputButtonWeiter2');

            // Variablen

            var gleicherRueckgabeort = false;

            // Event Listeners

            inputButtonZurueck1.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent-step-two.html', '_self');
            });

            inputButtonZurueck2.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent-step-two.html', '_self');
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent-step-four.html', '_self');
            });

            inputButtonWeiter2.addEventListener('click', ()=>
            {
                window.open('http://localhost:5500/src/rent-step-four.html', '_self');
            });
        });
    }
}
