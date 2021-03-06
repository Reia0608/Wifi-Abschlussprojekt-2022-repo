import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./../node_modules/jquery/dist/jquery.min.js";
import "./app.js";


export default class PageRentStepThree
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-three.html', appArgs.app.Main, () => 
		{
            // Initialisierung
            const inputButtonZurueck1 = this.app.Main.querySelector('#inputButtonZurueck1');
            const inputButtonZurueck2 = this.app.Main.querySelector('#inputButtonZurueck2');
            const inputButtonWeiter1 = this.app.Main.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = this.app.Main.querySelector('#inputButtonWeiter2');

            // Variablen
            var gleicherRueckgabeort = false;

            // Event Listeners
            inputButtonZurueck1.addEventListener('click', ()=>
            {
                location.hash = '#rentsteptwo';
            });

            inputButtonZurueck2.addEventListener('click', ()=>
            {
                location.hash = '#rentsteptwo';
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                location.hash = '#rentstepfour';
            });

            inputButtonWeiter2.addEventListener('click', ()=>
            {
                location.hash = '#rentstepfour';
            });
		});
	}
}