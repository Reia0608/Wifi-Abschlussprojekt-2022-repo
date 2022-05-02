export default class PageProfile
{
    constructor(args)
    {
        this.app = args.app;

        args.app.LoadHTML('./page-profile.html', args.app.Main, () => 
		{

		});
    }
}