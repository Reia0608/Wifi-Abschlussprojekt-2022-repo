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
    public class AusgabenstelleController : ControllerBase
    {
        // GET: api/<AnhaengerController>
        [HttpGet()]
        public IEnumerable<Ausgabenstelle> SelectAll()
        {
            return Ausgabenstelle.GetList();
        }

        // GET: api/<AnhaengerController>/5
        [HttpGet("{id}")]
        public Ausgabenstelle Get(int id) => Ausgabenstelle.Get(id);

        // POST: api/<AnhaengerController>
        [HttpPost]
        public IActionResult Post([FromBody] Ausgabenstelle ausgabenstelle)
        {
            IActionResult result = null;
            try
            {
                if (ausgabenstelle.Save() == 1)
                {
                    result = Ok();
                }
                else
                {
                    result = NoContent();
                }
            }
            catch (Exception ex)
            {
                result = StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
            }
            return result;
        }

        // PUT: api/<AnhaengerController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Ausgabenstelle ausgabenstelle)
        {
            IActionResult result = null;
            try
            {
                Ausgabenstelle dbAusgabenstelle = Ausgabenstelle.Get(id);
                if (dbAusgabenstelle == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (ausgabenstelle.Save(id) == 1)
                    {
                        result = Ok(ausgabenstelle);
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

        //DELETE: api/<AnhaengerController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Ausgabenstelle ausgabenstelle = Ausgabenstelle.Get(id);
            IActionResult result = null;
            try
            {
                if (ausgabenstelle.Delete() == 1)
                {
                    result = Ok("issuing office entry deleted!");
                }
                else
                {
                    result = NotFound("issuing office not found!");
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
