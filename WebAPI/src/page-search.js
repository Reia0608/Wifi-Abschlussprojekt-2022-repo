export default class pageSearch
{
    constructor(args)
    {
        this.app = args.app;

        args.app.LoadHTML('./page-search.html', args.app.Main, () => 
		{

		});
    }
}