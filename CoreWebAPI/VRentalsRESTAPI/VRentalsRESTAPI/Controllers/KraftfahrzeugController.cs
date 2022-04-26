using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using VRentalsClasses.Models;

namespace VRentalsRESTAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KraftfahrzeugController : ControllerBase
    {
        // GET: api/<FahrzeugController>
        [HttpGet()]
        public IEnumerable<Kraftfahrzeug> SelectAll() => Kraftfahrzeug.GetList();

        // GET: api/<KraftfahrzeugControler>/5
        [HttpGet("{id}")]
        public Kraftfahrzeug Get(int id) => Kraftfahrzeug.Get(id);

        [HttpGet("{id}/bild")]
        public FileStreamResult GetBild(int id)
        {
            Kraftfahrzeug kraftfahrzeug = Kraftfahrzeug.Get(id);
            if (kraftfahrzeug?.BildBytesList != null)
            {
                foreach(byte[] byteBild in kraftfahrzeug.BildBytesList)
                {
                    MemoryStream memoryStream = new MemoryStream(byteBild);
                    return new FileStreamResult(memoryStream, "image/jpeg");
                } 
            }
            return null;
        }

        // POST: api/<KraftfahrzeugController>
        [HttpPost]
        public IActionResult Post([FromBody] Kraftfahrzeug kraftfahrzeug)
        {
            IActionResult result = null;
            try
            {
                if (kraftfahrzeug.Save() == 1) result = Ok(kraftfahrzeug);
                else result = NoContent();
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
                if (dbKraftfahrzeug == null) result = NotFound();
                else
                {
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

        [HttpPut("{id}/bild")]
        public IActionResult PutBild(int id, IFormFile file)
        {
            IActionResult result = null;
            try
            {
                Kraftfahrzeug kraftfahrzeug = Kraftfahrzeug.Get(id);
                if(kraftfahrzeug == null) result = NotFound();
                else
                {
                    int iterator = 0;
                    foreach (byte[] bildBytes in kraftfahrzeug.BildBytesList)
                    {
                        MemoryStream memoryStream = new MemoryStream();
                        file.CopyTo(memoryStream);
                        kraftfahrzeug.BildBytesList[iterator] = memoryStream.ToArray();
                        iterator++;
                    }
                    if (kraftfahrzeug.Save() == 1) result = Ok(kraftfahrzeug);
                    else result=NoContent();
                }
            }
            catch(Exception ex)
            {
                result = StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
            }
            return result;
        }

        //DELETE: api/<KraftfahrzeugController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            // WIP
        }

            
    }
}
