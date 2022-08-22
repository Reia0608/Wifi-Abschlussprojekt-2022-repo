
export default class PageImprint 
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-imprint.html', args.app.Main, () => 
		{

		});
	}
}