import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";


export default class PageRentStepFour
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-step-four.html', appArgs.app.Main, () => 
		{
            // Initialisierung
            const inputButtonZurueck1 = this.app.Main.querySelector('#inputButtonZurueck1');
            const inputButtonZurueck2 = this.app.Main.querySelector('#inputButtonZurueck2');
            const inputButtonWeiter1 = this.app.Main.querySelector('#inputButtonWeiter1');
            const inputButtonWeiter2 = this.app.Main.querySelector('#inputButtonWeiter2');

            // Variablen

            // Event Listeners
            inputButtonZurueck1.addEventListener('click', ()=>
            {
                location.hash = '#rentstepthree';
            });

            inputButtonZurueck2.addEventListener('click', ()=>
            {
                location.hash = '#rentstepthree';
            });            

            inputButtonWeiter1.addEventListener('click', ()=>
            {
                location.hash = '#rentstepfive';
            });

            inputButtonWeiter2.addEventListener('click', ()=>
            {
                location.hash = '#rentstepfive';
            });
		});
	}
}