
export default class PageHome
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-home.html', args.app.Main, () => 
		{

		});
	}
}