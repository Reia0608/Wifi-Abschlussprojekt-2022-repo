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
    public class WartungsterminController : Controller
    {
        // GET: api/<WartungsterminController>
        [HttpGet]
        public List<Wartungstermin> SelectAll() => Wartungstermin.Get();

        // GET: api/<WartungsterminController>/5
        [HttpGet("{id}")]
        public Wartungstermin Get(int id) => Wartungstermin.Get(id);

        // GET: api/<WartungsterminController>/today
        [HttpGet("today")]
        public IEnumerable<Wartungstermin> GetToday() => Wartungstermin.GetToday();

        // GET: api/<WartungsterminController>/today
        [HttpGet("finished")]
        public IEnumerable<Wartungstermin> GetFinished() => Wartungstermin.GetFinished();

        // GET: api/<WartungsterminController>/today
        [HttpGet("open")]
        public IEnumerable<Wartungstermin> GetOpen() => Wartungstermin.GetOpen();

        // POST: api/<WartungsterminController>
        [HttpPost]
        public IActionResult Post([FromBody] Wartungstermin wartungstermin)
        {
            IActionResult result = null;
            try
            {
                if (wartungstermin.Save() == 1)
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
        public IActionResult Put(int id, [FromBody] Wartungstermin wartungstermin)
        {
            IActionResult result = null;
            try
            {
                Wartungstermin dbWartungstermin = Wartungstermin.Get(id);
                if (dbWartungstermin == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (wartungstermin.Save() == 1)
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
    }
}
