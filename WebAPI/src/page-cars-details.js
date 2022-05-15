import "./app.js";

export default class PageCarsDetails 
{
	constructor(args) 
	{
        this.app = args.app;
		args.app.LoadHTML('./page-cars-details.html', args.app.Main, () => 
		{
            
		});
	}
}