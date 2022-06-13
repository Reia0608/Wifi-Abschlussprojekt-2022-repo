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
    public class KraftfahrzeugController : ControllerBase
    {
        // GET: api/<FahrzeugController>
        [HttpGet()]
        public IEnumerable<Kraftfahrzeug> SelectAll()
        {
            return Kraftfahrzeug.GetList();
        }

        // GET: api/<KraftfahrzeugController>/5
        [HttpGet("{id}")]
        public Kraftfahrzeug Get(int id) => Kraftfahrzeug.Get(id);

        // POST: api/<KraftfahrzeugController>
        [HttpPost]
        public IActionResult Post([FromBody] Kraftfahrzeug kraftfahrzeug)
        {
            IActionResult result = null;
            try
            {
                if (kraftfahrzeug.Save() == 1)
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

        // PUT: api/<KraftfahrzeugController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Kraftfahrzeug kraftfahrzeug)
        {
            IActionResult result = null;
            try
            {
                Kraftfahrzeug dbKraftfahrzeug = Kraftfahrzeug.Get(id);
                if (dbKraftfahrzeug == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (kraftfahrzeug.Save(id) == 1)
                    {
                        result = Ok(kraftfahrzeug);
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

        [HttpPut("{id}/bild")]
        public IActionResult PutBild(int id, IFormFile file)
        {
            IActionResult result = null;
            try
            {
                Kraftfahrzeug kraftfahrzeug = Kraftfahrzeug.Get(id);
                if (kraftfahrzeug == null) result = NotFound();
                else
                {
                    int iterator = 0;
                    foreach (Bild bild in kraftfahrzeug.BildListe)
                    {
                        MemoryStream memoryStream = new MemoryStream();
                        file.CopyTo(memoryStream);
                        kraftfahrzeug.BildListe[iterator].BildBytes = memoryStream.ToArray();
                        iterator++;
                    }
                    if (kraftfahrzeug.Save() == 1) result = Ok(kraftfahrzeug);
                    else result = NoContent();
                }
            }
            catch (Exception ex)
            {
                result = StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
            }
            return result;
        }

        //DELETE: api/<KraftfahrzeugController>/
        [HttpDelete()]
        public IActionResult Delete([FromBody] List<int> listToDelete)
        {
            IActionResult result = null;
            try
            {
                if(Kraftfahrzeug.Delete(listToDelete) > 0)
                {
                    result = Ok("Car entries deleted!");
                }
                else
                {
                    result = NotFound("cars not found!");
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
