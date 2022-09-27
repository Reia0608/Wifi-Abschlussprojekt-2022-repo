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
    public class BewegungController : Controller
    {
        // GET: api/<BewegungController>/5
        [HttpGet("{id}")]
        public Bewegung Get(int id) => Bewegung.Get(id);

        // GET: api/<BewegungController>/user/5
        [HttpGet("user/{id}")]
        public IEnumerable<Bewegung> GetAllByBenutzerId(int id)
        {
            return Bewegung.GetAllByBenutzerId(id);
        }

        // GET: api/<BewegungController>/fahrer/5
        [HttpGet("fahrer/{id}")]
        public IEnumerable<Bewegung> GetAllByFahrerId(int id)
        {
            return Bewegung.GetAllByFahrerId(id);
        }

        // POST: api/<BewegungController>
        [HttpPost]
        public IActionResult Post([FromBody] Bewegung bewegung)
        {
            IActionResult result = null;
            try
            {
                if (bewegung.Save() == 1)
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

        // PUT: api/<BewegungController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Bewegung bewegung)
        {
            IActionResult result = null;
            try
            {
                Bewegung dbBewegung = Bewegung.Get(id);
                if (dbBewegung == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (bewegung.Save() == 1)
                    {
                        result = Ok(bewegung);
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
    }
}
