using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using VRentalsClasses;

namespace VRentalsRESTAPI.Controllers
{
    public class PageController : Controller
    {
		[HttpGet("init")]
		public dynamic InitPage(string bm)
		{
			return new
			{
				//gruppelist = Gruppe.GetList(), WIP Was ist die gruppe?
				benutzer = Benutzer.Get(bm)
			};
		}

		[HttpGet("search")]
		public dynamic Search(string term)
		{
			return new
			{
				//fzlist = Kraftfahrzeug.GetList(term),
				//benutzerlist = Benutzer.GetList(term)
			};
		}
	}
}
