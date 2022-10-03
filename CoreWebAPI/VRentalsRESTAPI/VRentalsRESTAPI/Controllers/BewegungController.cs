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
        // GET: api/<BewegungController>
        [HttpGet]
        public List<Bewegung> SelectAll() => Bewegung.Get();

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

        // GET: api/<BewegungController>/today
        [HttpGet("today")]
        public IEnumerable<Bewegung> GetToday() => Bewegung.GetToday();

        // GET: api/<BewegungController>/today
        [HttpGet("finished")]
        public IEnumerable<Bewegung> GetFinished() => Bewegung.GetFinished();

        // GET: api/<BewegungController>/today
        [HttpGet("open")]
        public IEnumerable<Bewegung> GetOpen() => Bewegung.GetOpen();

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

        //DELETE: api/<BewegungController>/
        [HttpDelete()]
        public IActionResult Delete([FromBody] List<int> listToDelete)
        {
            IActionResult result = null;
            try
            {
                if (Bewegung.Delete(listToDelete) > 0)
                {
                    result = Ok("Transaction entries deleted!");
                }
                else
                {
                    result = NotFound("Transaction(s) not found!");
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
