import  "./../../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";


export default class PageRentDone
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-rent-done.html', appArgs.app.Main, () => 
		{
            // Initialisierung

            
            // Event Listeners

            
        });
    }
}