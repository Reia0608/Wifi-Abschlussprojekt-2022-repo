using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using VRentalsClasses.Models;
using VRentalsClasses.Interfaces;
using System.Net;

namespace VRentalsRESTAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BenutzerController : ControllerBase
	{
		[HttpGet()]
		public IEnumerable<Benutzer> SelectAll()
		{
            //Benutzer benutzer = Benutzer.Get(this);
            //         if (benutzer?.Rolle == RollenTyp.Admin)
            //         {
            return Benutzer.GetList();
            //} 
            //return null;
        }

		[HttpGet("search/{suchbegriff}")]
		public List<Benutzer> SearchBenutzer(string suchbegriff)
        {
            //Benutzer benutzer = Benutzer.Get(this);
            //if (benutzer?.Rolle == RollenTyp.Admin || benutzer?.Rolle == RollenTyp.User)
            //{
            List<Benutzer> benutzerListe = Benutzer.SearchList(suchbegriff);
            return benutzerListe;
            //}
            //else
            //{
            //    return null;
            //}
        }

		[HttpGet("pid/{pid}")]
		public IActionResult GetBenutzerById(int pid)
		{
			IActionResult result = null;
			try
			{
				result = Ok(new
				{
					success = true,
					message = "ok",
					benutzer = Benutzer.Get(pid),
				});
				return result;
			}
			catch (Exception ex)
			{
				return NotFound(ex);
			}
		}

		[HttpGet("{id}")]
		public IActionResult GetBenutzer(string id)
		{
			IActionResult result = null;
			try
			{
				result = Ok(new
				{
					success = true,
					message = "ok",
					benutzer = Benutzer.Get(id),
				});
			return result;
			}
			catch (Exception ex)
			{
				return NotFound(ex);
			}
		}

        [HttpGet("check/{tocheck}")]
        public IActionResult CheckIfValidUserOrAdmin(string tocheck)
        {
            IActionResult result = null;

            try
            {
                if (Benutzer.CheckBenutzer(tocheck))
                {
                    result = Ok(new
                    {
                        success = true,
                        message = "ok"
                    });
                }
                else
                {
                    result = Unauthorized(new
                    {
                        success = false,
                        message = "Unauthorized!"
                    });
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }
            return result;
        }


        [HttpGet("{id}/bild")]
		public FileStreamResult GetBild(string benutzermerkmal)
		{
			Benutzer benutzer = Benutzer.Get(benutzermerkmal);
			if (benutzer?.ProfilBild != null)
			{
				MemoryStream memoryStream = new MemoryStream(benutzer.ProfilBild);
				return new FileStreamResult(memoryStream, "image/jpeg");
			}
			return null;
		}

		[HttpGet("allebenutzer/{role}")]
		public IEnumerable<Benutzer> GetUsersByRole(int role)
		{
            Benutzer benutzer = Benutzer.Get(this);
            if (benutzer?.Rolle == RollenTyp.Admin)
            {
                return Benutzer.GetList(role);
			} 
			else
            {
				return null;
			}
		}

		// GET: api/<BenutzerController>/allstaff
		[HttpGet("allstaff")]
		public IEnumerable<Personal> GetAllStaff()
		{
			Benutzer benutzer = Benutzer.Get(this);
			if (benutzer?.Rolle == RollenTyp.Admin)
			{
				return Personal.GetStaffList();
			}
			else
			{
				return null;
			}
		}

		// GET: api/<BenutzerController>/allstaff/filterby/status/unbekannt
		[HttpGet("allstaff/filter/{by}/{value}")]
		public IEnumerable<Personal> GetStaffFilteredBy(string by, string value)
		{
			Benutzer benutzer = Benutzer.Get(this);
			if (benutzer?.Rolle == RollenTyp.Admin)
			{
				return Personal.FilterBy(by, value);
			}
			else
			{
				return null;
			}
		}

		// GET: api/<BenutzerController>/fsk/5
		[HttpGet("fsk/{id}")]
		public List<string> GetFSKByUserId(int id)
		{
			BenutzerFuehrerschein benutzerFuehrerschein = BenutzerFuehrerschein.Get(id);
			Benutzer benutzer = Benutzer.Get(this);
			if (benutzer?.Rolle == RollenTyp.Admin || (benutzer?.Rolle == RollenTyp.Kunde && benutzerFuehrerschein.Users_Id == benutzer.UserId))
			{
				return BenutzerFuehrerschein.GetStringList(id);
			}
			else
			{
				return null;
			}
		}

		// GET: api/<BenutzerController>/fsk/5
		[HttpGet("objfsk/{id}")]
		public BenutzerFuehrerschein GetFSKObjectByUserId(int id)
		{
			BenutzerFuehrerschein benutzerFuehrerschein = BenutzerFuehrerschein.Get(id);
			Benutzer benutzer = Benutzer.Get(this);
			if (benutzer?.Rolle == RollenTyp.Admin || (benutzer?.Rolle == RollenTyp.Kunde && benutzer?.UserId == benutzerFuehrerschein.Users_Id))
			{
				return BenutzerFuehrerschein.Get(id);
			}
			else
			{
				return null;
			}
		}

		[HttpDelete("logoff")]
		public IActionResult LogoffPerson()
		{
			Benutzer benutzer = Benutzer.Get(this);
			Response.Cookies.Delete("benutzermerkmal");
			try
            {
				benutzer.BenutzerMerkmal = String.Empty;
				benutzer.MerkmalGiltBis = DateTime.Now.AddMinutes(-1);
				benutzer.Save();
				return Ok();
			}
			catch (Exception ex)
			{
				return NotFound("user not found!");
			}	
		}


		[HttpPost("login")]
		public IActionResult LoginPerson([FromBody] Dictionary<string, string> loginData)
		{
			IActionResult result = null;
			try
			{
				Benutzer benutzer = Benutzer.Get(loginData["benutzer"], loginData["pwd"]);
				if(benutzer != null)
                {
					result = Ok(new
					{
						success = true,
						message = "ok",
						benutzer = benutzer
					});

					benutzer.BenutzerMerkmal = Guid.NewGuid().ToString("N");
					benutzer.MerkmalGiltBis = DateTime.Now.AddHours(24);
					benutzer.LetzteAnmeldung = DateTime.Now;
					benutzer.Save();

					this.Response.Cookies.Append("benutzermerkmal", benutzer.BenutzerMerkmal, new CookieOptions()
					{
						Expires = benutzer.MerkmalGiltBis.Value,
						SameSite = SameSiteMode.Unspecified,
						Secure = true
					});
				}
				else
                {
					result = Unauthorized(new
					{
						success = false,
						message = "Anmeldung fehlgeschlagen!"
					});
				}
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

		// PUT: api/<BenutzerController>/5
		[HttpPut("{userid}")]
		public IActionResult Put(int userid, [FromBody] Benutzer benutzer)
		{
			IActionResult result = null;
			try
			{
				Benutzer dbBenutzer = Benutzer.Get(userid);
				if (dbBenutzer == null)
				{
					result = NotFound();
				}
				else
				{
					if (benutzer.Save(userid) == 1)
					{
						result = Ok(benutzer);
					}
					else
					{
						result = NoContent();
					}
				}
			}
			catch (Exception ex)
			{
				result = StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
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

		//PUT: api/<BenutzerController>/fsk/5
		[HttpPut("fsk/{userid}")]
		public IActionResult UpdateFSK(int userid, [FromBody] List<bool?> listToUpdate)
		{
			IActionResult result = null;
			try
			{
				if (Benutzer.UpdateFSK(userid, listToUpdate) > 0)
				{
					result = Ok("Driver's licence updated!");
				}
				else
				{
					result = NotFound("user(s) not found!");
				}
			}
			catch (Exception ex)
			{
				result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
				Debug.WriteLine(ex.Message);
			}
			return result;
		}

		//DELETE: api/<BenutzerController>/
		[HttpDelete()]
		public IActionResult Delete([FromBody] List<int> listToDelete)
		{
			IActionResult result = null;
			try
			{
				if (Benutzer.Delete(listToDelete) > 0)
				{
					result = Ok("user entries deleted!");
				}
				else
				{
					result = NotFound("user(s) not found!");
				}
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