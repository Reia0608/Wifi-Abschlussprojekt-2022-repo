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
    public class AdresseController : ControllerBase
    {
        // GET: api/<AdresseController>
        [HttpGet()]
        public IEnumerable<Adresse> SelectAll()
        {
            return Adresse.GetList();
        }

        // GET: api/<AdresseController>/5
        [HttpGet("{id}")]
        public Adresse Get(int id) => Adresse.Get(id);

        // POST: api/<AdresseController>
        [HttpPost]
        public IActionResult Post([FromBody] Adresse adresse)
        {
            IActionResult result = null;
            try
            {
                if (adresse.Save() == 1)
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

        // PUT: api/<AdresseController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Adresse adresse)
        {
            IActionResult result = null;
            try
            {
                Adresse dbAdresse = Adresse.Get(id);
                if (dbAdresse == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (adresse.Save() == 1)
                    {
                        result = Ok(adresse);
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

        //DELETE: api/<AdresseController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Adresse adresse = Adresse.Get(id);
            IActionResult result = null;
            try
            {
                if (adresse.Delete() == 1)
                {
                    result = Ok("address entry deleted!");
                }
                else
                {
                    result = NotFound("address not found!");
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
