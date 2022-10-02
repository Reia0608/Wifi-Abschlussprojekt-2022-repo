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

        // GET: api/<BilderController>/benutzer/5
        [HttpGet("benutzer/{id}")]
        public IEnumerable<Bild> SelectAllFromBenutzer(int id)
        {
            return Bild.GetBenutzerBildList(id);
        }

        // GET: api/<BilderController>/kfz/5
        [HttpGet("kfz/{id}")]
        public IEnumerable<Bild> SelectAllFromKfz(int id)
        {
            return Bild.GetKfzBildList(id);
        }

        // GET: api/<BilderController>/kfz
        [HttpGet("kfz")]
        public IEnumerable<Bild> SelectAllForKFZ()
        {
            return Bild.GetAllKfzBildList();
        }

        // GET: api/<BilderController>/anhaenger
        [HttpGet("anhaenger")]
        public IEnumerable<Bild> SelectAllForAnhaenger()
        {
            return Bild.GetAllAnhaengerBildList();
        }

        // GET: api/<BilderController>/specifickfz
        [HttpGet("specifickfz/{kfzlist}")]
        public IEnumerable<Bild> GetAllBildBySpecificKfzList(string kfzlist)
        {
            return Bild.GetAllBildBySpecificKfzList(kfzlist);
        }

        // GET: api/<BilderController>/specificanhaenger
        [HttpGet("specificanhaenger/{anhaengerlist}")]
        public IEnumerable<Bild> GetAllBildBySpecificAnhaengerList(string anhaengerlist)
        {
            return Bild.GetAllBildBySpecificAnhaengerList(anhaengerlist);
        }

        // GET: api/<BilderController>/anhaenger/5
        [HttpGet("anhaenger/{id}")]
        public IEnumerable<Bild> SelectAllFromAnhaenger(int id)
        {
            return Bild.GetAnhaengerBildList(id);
        }

        // GET: api/<BilderController>/availablefahrer/5_24_45_
        [HttpGet("availablefahrer/{fahrerlist}")]
        public IEnumerable<Bild> SelectAllAvailableFahrer(string fahrerlist)
        {
            return Bild.GetAllBildByAvailableFahrerList(fahrerlist);
        }

        // GET: api/<BilderController>/5
        [HttpGet("{id}")]
        public Bild Get(int id) => Bild.Get(id);

        // GET: api/<BilderController>/singlekfz/5
        [HttpGet("singlekfz/{id}")]
        public Bild GetBildByKfz(int id) => Bild.GetBildByKfz(id);

        // GET: api/<BilderController>/singlekfz/schaden/5
        [HttpGet("singlekfz/schaden/{id}")]
        public IEnumerable<Bild> GetBildAllSchadenByKfz(int id) => Bild.GetBildAllSchadenByKfz(id);

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
        
        // PUT: api/<BilderController>/kfz
        [HttpPut("kfz")]
        public IActionResult PutByKraftfahrzeugId([FromBody] Bild bild)
        {
            IActionResult result = null;
            try
            {
                Bild dbBild = Bild.GetByKraftfahrzeugId(bild.KraftfahrzeugId);
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

        // PUT: api/<BilderController>/
        [HttpPut]
        public IActionResult Put([FromBody] Bild bild)
        {
            IActionResult result = null;
            try
            {
                Bild dbBild = Bild.Get(bild.Bilder_Id);
                if (dbBild == null)
                {
                    dbBild = Bild.GetByKraftfahrzeugId(bild.KraftfahrzeugId);
                    if(dbBild == null)
                    {
                        result = NotFound();
                    }
                    else
                    {
                        if (bild.Save() >= 1)
                        {
                            result = Ok();
                        }
                        else
                        {
                            result = NoContent();
                        }
                    }
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
