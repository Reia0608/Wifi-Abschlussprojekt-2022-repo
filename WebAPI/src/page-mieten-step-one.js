import  "./../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import "./app.js";

export default class PageRentStepOne
{
    constructor(appArgs)
    {
        this.app = appArgs.app;

        appArgs.app.LoadHTML('./page-mieten-step-one.html', appArgs.app.Main, () => 
		{
            // Initialisierung
		});
	}
}