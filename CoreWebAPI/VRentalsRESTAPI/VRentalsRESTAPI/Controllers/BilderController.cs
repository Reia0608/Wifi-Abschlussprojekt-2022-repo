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
    public class BilderController : ControllerBase
    {
        // GET: api/<BilderController>
        [HttpGet()]
        public IEnumerable<Bild> SelectAll()
        {
            return Bild.GetList();
        }

        [HttpGet("kfz/{id}")]
        public IEnumerable<Bild> SelectAllFromKfz(int id)
        {
            return Bild.GetKfzBildList(id);
        }

        [HttpGet("anhaenger/{id}")]
        public IEnumerable<Bild> SelectAllFromAnhaenger(int id)
        {
            return Bild.GetAnhaengerBildList(id);
        }

        // GET: api/<BilderController>/5
        [HttpGet("{id}")]
        public Bild Get(int id) => Bild.Get(id);

        // POST: api/<BilderController>
        [HttpPost]
        public IActionResult Post([FromBody] Bild bild)
        {
            IActionResult result = null;
            try
            {
                if (bild.Save() == 1)
                {
                    result = Ok(bild);
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

        // PUT: api/<BilderController>/5
        [HttpPut]
        public IActionResult Put([FromBody] Bild bild)
        {
            IActionResult result = null;
            try
            {
                Bild dbBild = Bild.Get(bild.Bilder_Id);
                if (dbBild == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (bild.Save() == 1)
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

        //DELETE: api/<BilderController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Bild bild = Bild.Get(id);
            IActionResult result = null;
            try
            {
                if (bild.Delete() == 1)
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
