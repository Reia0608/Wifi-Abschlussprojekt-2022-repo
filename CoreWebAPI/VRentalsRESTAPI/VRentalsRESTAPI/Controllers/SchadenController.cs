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

        // GET: api/<SchadenController>/5
        [HttpGet("{id}")]
        public Schaden Get(int id) => Schaden.Get(id);

        // POST: api/<SchadenController>
        [HttpPost]
        public IActionResult Post([FromBody] Schaden schaden)
        {
            IActionResult result = null;
            try
            {
                if (schaden.Save() == 1)
                {
                    result = Ok(schaden);
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

        // PUT: api/<SchadenController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Schaden schaden)
        {
            IActionResult result = null;
            try
            {
                Schaden dbSchaden = Schaden.Get(id);
                if (dbSchaden == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (schaden.Save(id) == 1)
                    {
                        result = Ok(schaden);
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
                    result = Ok("damage entry deleted!");
                }
                else
                {
                    result = NotFound("damage entry not found!");
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
