using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using VRentalsClasses;

namespace VRentalsRESTAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BenutzerController : ControllerBase
	{
		[HttpGet()]
		public IEnumerable<Benutzer> SelectAll()
		{
			Benutzer benutzer = Benutzer.Get(this);
            if (benutzer?.Rolle == RollenTyp.Admin)
            {
                return Benutzer.GetList();
			}
			return null;
		}

		[HttpGet("{id}")]
		public Benutzer SelectOne(string id) => Benutzer.Get(id);

		[HttpDelete("logoff")]
		public IActionResult LogoffPerson()
		{
			Benutzer benutzer = Benutzer.Get(this);
			Response.Cookies.Delete("benutzermerkmal");
			benutzer.BenutzerMerkmal = String.Empty;
			benutzer.MerkmalGiltBis = DateTime.Now.AddMinutes(-1);
			benutzer.Save();
			return Ok();
		}

		[HttpPost("login")]
		public IActionResult LoginPerson([FromBody] Dictionary<string, string> loginData)
		{
			IActionResult result = null;
			try
			{
				Benutzer benutzer = Benutzer.Get(loginData["benutzer"], loginData["pwd"]);
				result = Ok(new
				{
					success = true,
					message = "ok",
					benutzer = benutzer
				});

				benutzer.BenutzerMerkmal = Guid.NewGuid().ToString("N");
				benutzer.MerkmalGiltBis = DateTime.Now.AddHours(24);
				benutzer.Save();

				this.Response.Cookies.Append("benutzermerkmal", benutzer.BenutzerMerkmal, new CookieOptions()
				{
					Expires = benutzer.MerkmalGiltBis.Value,
					SameSite = SameSiteMode.Unspecified,
					Secure = true
				});


			}
			catch (System.Exception ex)
			{
				result = Unauthorized(new
				{
					success = false,
					message = ex.Message
				});
			}

			return result;
		}


		[HttpPost()]
		public IActionResult InsertBenutzer([FromBody] Benutzer benutzer)
		{
			IActionResult result = null;
			try
			{
				if (benutzer.Save() == 1) result = Ok();
				else result = new StatusCodeResult(StatusCodes.Status204NoContent);

			}
			catch (Exception ex)
			{
				result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
				Debug.WriteLine(ex.Message);
			}
			return result;
		}

	}
}