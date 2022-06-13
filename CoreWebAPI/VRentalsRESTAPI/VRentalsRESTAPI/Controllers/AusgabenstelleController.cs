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
        // GET: api/<AusgabenstelleController>
        [HttpGet()]
        public IEnumerable<Ausgabenstelle> SelectAll()
        {
            return Ausgabenstelle.GetList();
        }

        // GET: api/<AusgabenstelleController>/5
        [HttpGet("{id}")]
        public Ausgabenstelle Get(int id) => Ausgabenstelle.Get(id);

        // GET: api/<AusgabenstelleController>/adresse/5
        [HttpGet("adresse/{ausgabenstelle_id}")]
        public Adresse GetAdresseOfAusgabenstelle(int? ausgabenstelle_id)
        {
            return Adresse.GetByAusgabenstelleId(ausgabenstelle_id);
        }

        // POST: api/<AusgabenstelleController>
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

        // PUT: api/<AusgabenstelleController>
        [HttpPut]
        public IActionResult Put([FromBody] Ausgabenstelle ausgabenstelle)
        {
            IActionResult result = null;
            try
            {
                Ausgabenstelle dbAusgabenstelle = Ausgabenstelle.Get(ausgabenstelle.Ausgabenstelle_Id);
                if (dbAusgabenstelle == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (ausgabenstelle.Save() == 1)
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

        //DELETE: api/<AusgabenstelleController>/5
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

        //DELETE: api/<AusgabenstelleController>/5
        [HttpDelete]
        public IActionResult Delete([FromBody] List<int> listToDelete)
        {
            IActionResult result = null;
            try
            {
                if (Ausgabenstelle.Delete(listToDelete)  > 0)
                {
                    result = Ok("issuing office entries and their addresses deleted!");
                }
                else
                {
                    result = NotFound("one or more issuing offices not found!");
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
