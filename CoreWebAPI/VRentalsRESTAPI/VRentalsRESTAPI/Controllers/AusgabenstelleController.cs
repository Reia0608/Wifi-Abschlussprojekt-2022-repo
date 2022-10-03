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

        // GET: api/<AusgabenstelleController>/standort/5
        [HttpGet("standort/{ausgabenstelle_id}")]
        public IEnumerable<string> GetNameOfAusgabenstelle(int? ausgabenstelle_id)
        {
            return Ausgabenstelle.GetNameByAusgabenstelleId(ausgabenstelle_id);
        }

        // GET: api/<AusgabenstelleController>/bezeichnung/5
        [HttpGet("bezeichnung/{ausgabenstelle_bezeichnung}")]
        public int? GetNameOfAusgabenstelle(string? ausgabenstelle_bezeichnung)
        {
            return Ausgabenstelle.GetIdByName(ausgabenstelle_bezeichnung);
        }

        // GET: api/<AusgabenstelleController>/5/anhaenger
        [HttpGet("{ausgabenstelle_id}/anhaenger")]
        public IEnumerable<Anhaenger> GetAllAnhaengerInAusgabenstelle(int ausgabenstelle_id)
        {
            return Anhaenger.GetAllByAusgabenstelleId(ausgabenstelle_id);
        }

        // GET: api/<AusgabenstelleController>/5/kraftfahrzeug
        [HttpGet("{ausgabenstelle_id}/kraftfahrzeug")]
        public IEnumerable<Kraftfahrzeug> GetAllKraftfahrzeugInAusgabenstelle(int ausgabenstelle_id)
        {
            return Kraftfahrzeug.GetAllByAusgabenstelleId(ausgabenstelle_id);
        }

        // GET: api/<AusgabenstelleController>/getall
        [HttpGet("getallnames")]
        public IEnumerable<string> GetAllAusgabenstelleNames()
        {
            return Ausgabenstelle.GetAllNames(); ;
        }

        // GET: api/<AusgabenstelleController>/getall
        [HttpGet("getidbyname/{ausgabenstellename}")]
        public int? GetAusgabenstelleIdbyName(string ausgabenstellename)
        {
            return Ausgabenstelle.GetIdByName(ausgabenstellename); 
        }

        // GET: api/<AusgabenstelleController>/getbymarkemodell/porsche/911
        [HttpGet("getbymarkemodell/{marke}/{modell}")]
        public IEnumerable<string> GetAusgabenstelleByMarkeAndModell(string marke, string modell)
        {
            List<string> result = new List<string>();
            List<int?> tempresult = new List<int?>();

            tempresult = Kraftfahrzeug.GetAusgabenstelleByMarkeAndModell(marke, modell);
            if(tempresult.Count > 0)
            {
                result = Ausgabenstelle.GetByIdList(tempresult);
            }
            return result;
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
