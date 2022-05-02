
import Sidebar from './component-sidebar.js';
import Banner from './component-banner.js';

export default class PageMain 
{
	constructor(args) 
	{
		args.app.LoadHTML('./page-home.html', args.app.Main, () => 
		{

		});
	}
}