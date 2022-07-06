using Microsoft.AspNetCore.Mvc;

namespace VRentalsRESTAPI.Controllers
{
    public class PersonalController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
