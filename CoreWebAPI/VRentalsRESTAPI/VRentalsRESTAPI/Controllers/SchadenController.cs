using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using VRentalsClasses.Models;

namespace VRentalsRESTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchadenController : ControllerBase
    {
        // GET: api/<SchadenController>
        [HttpGet()]
        public IEnumerable<Schaden> SelectAll()
        {
            return Schaden.GetList();
        }

        [HttpGet("kfz/{id}")]
        public IEnumerable<Schaden> SelectAllFromKfz(int id)
        {
            return Schaden.GetKfzSchaden(id);
        }

        [HttpGet("anhaenger/{id}")]
        public IEnumerable<Schaden> SelectAllFromAnhaenger(int id)
        {
            return Schaden.GetAnhaengerSchaden(id);
        }

        // GET: api/<SchadenController>/5
        [HttpGet("{id}")]
        public Schaden Get(int id) => Schaden.Get(id);

        // GET: api/<SchadenController>/getid/5456654456
        [HttpGet("getid/{foto_datum}")]
        public int GetID(long foto_datum) => Schaden.GetID(foto_datum);

        // GET: api/<SchadenController>/getuserschadenonkraftfahrzeug/5/55
        [HttpGet("getuserschadenonkraftfahrzeug/{kraftfahrzeug_id}/{user_id}")]
        public IEnumerable<Schaden> GetSchadenOnKraftfahrzeugByUser(int kraftfahrzeug_id, int user_id) => Schaden.GetSchadenOnKraftfahrzeugByUser(kraftfahrzeug_id, user_id);

        // POST: api/<SchadenController>
        [HttpPost]
        public IActionResult Post([FromBody] Schaden schaden)
        {
            IActionResult result = null;
            Benutzer benutzer = Benutzer.Get(this);
            try
            {
                if(benutzer.Rolle == VRentalsClasses.Interfaces.RollenTyp.Kunde)
                {
                    schaden.UsersId = benutzer.UserId;
                    if (schaden.Save() == 1)
                    {
                        result = Ok();
                    }
                    else
                    {
                        result = NoContent();
                    }
                }
                else if(benutzer.Rolle == VRentalsClasses.Interfaces.RollenTyp.User)
                {
                    // WIP: needs to be able to add the client's UserId
                    if (schaden.Save() == 1)
                    {
                        result = Ok();
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

        // PUT: api/<SchadenController>/5
        [HttpPut]
        public IActionResult Put([FromBody] Schaden schaden)
        {
            IActionResult result = null;
            try
            {
                Schaden dbSchaden = Schaden.Get(schaden.Schaden_Id);
                if (dbSchaden == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (schaden.Save() == 1)
                    {
                        result = Ok();
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

        //DELETE: api/<SchadenController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Schaden schaden = Schaden.Get(id);
            IActionResult result = null;
            try
            {
                if (schaden.Delete() == 1)
                {
                    result = Ok();
                }
                else
                {
                    result = NotFound();
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
