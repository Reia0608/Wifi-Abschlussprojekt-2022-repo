using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using VRentalsClasses;
using VRentalsClasses.Models;

namespace VRentalsRESTAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PageController : Controller
	{
		[HttpGet("init")]
		public dynamic InitPage(string bm)
		{
			return new
			{
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
