﻿using Microsoft.AspNetCore.Http;
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
    public class AnhaengerController : ControllerBase
    {
        // GET: api/<AnhaengerController>
        [HttpGet()]
        public IEnumerable<Anhaenger> SelectAll()
        {
            return Anhaenger.GetList();
        }

        // GET: api/<AnhaengerController>/byausgabenstelle
        [HttpGet("byausgabenstelle/{ausgabenstelle_id}")]
        public IEnumerable<Anhaenger> SelectByAusgabenstelle(int ausgabenstelle_id)
        {
            return Anhaenger.GetByAusgabenstelleIdAndAvailability(ausgabenstelle_id);
        }

        // GET: api/<AnhaengerController>/5
        [HttpGet("{id}")]
        public Anhaenger Get(int id) => Anhaenger.Get(id);

        [HttpGet("{id}/bild")]
        public FileStreamResult GetBild(int id)
        {
            Anhaenger anhaenger = Anhaenger.Get(id);
            if (anhaenger?.BildListe != null)
            {
                foreach (Bild bild in anhaenger.BildListe)
                {
                    MemoryStream memoryStream = new MemoryStream(bild.BildBytes);
                    return new FileStreamResult(memoryStream, "image/jpeg");
                }
            }
            return null;
        }

        // GET: api/<BenutzerController>/filter/klasse/unbekannt
        [HttpGet("filter/{by}/{value}")]
        public IEnumerable<Anhaenger> FilteredBy(string by, string value)
        {
            return Anhaenger.FilterBy(by, value);
        }

        // GET: api/<AnhaengerController>/karten
        [HttpGet("karten")]
        public IEnumerable<Anhaengerkarte> SelectAllCards()
        {
            return Anhaengerkarte.GetList();
        }

        // GET: api/<AnhaengerController>/karte/5
        [HttpGet("karte/{id}")]
        public Anhaengerkarte SelectOneCard(int id)
        {
            return Anhaengerkarte.Get(id);
        }

        // POST: api/<AnhaengerController>
        [HttpPost]
        public IActionResult Post([FromBody] Anhaenger anhaenger)
        {
            IActionResult result = null;
            try
            {
                if (anhaenger.Save() == 1)
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

        // PUT: api/<AnhaengerController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Anhaenger anhaenger)
        {
            IActionResult result = null;
            try
            {
                Anhaenger dbAnhaenger = Anhaenger.Get(id);
                if (dbAnhaenger == null)
                {
                    result = NotFound();
                }
                else
                {
                    if (anhaenger.Save(id) == 1)
                    {
                        result = Ok(anhaenger);
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

        //PUT: api/<AnhaengerController>/ausgabenstelle/5
        [HttpPut("ausgabenstelle/{ausgabenstelle_id}")]
        public IActionResult UpdateAusgabenstelleEntry([FromBody] ListToUpdate listToUpdate, int ausgabenstelle_id)
        {
            IActionResult result = null;
            try
            {
                if (Anhaenger.AddRemoveFromAusgabenstelle(listToUpdate.ListToAdd, listToUpdate.ListToRemove, ausgabenstelle_id) > 0)
                {
                    result = Ok("Trailer entries updated!");
                }
                else
                {
                    result = NotFound("An error has occured! Cars not found?");
                }
            }
            catch (Exception ex)
            {
                result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
                Debug.WriteLine(ex.Message);
            }
            return result;
        }

        [HttpPut("{id}/bild")]
        public IActionResult PutBild(int id, IFormFile file)
        {
            IActionResult result = null;
            try
            {
                Anhaenger anhaenger= Anhaenger.Get(id);
                if (anhaenger == null) result = NotFound();
                else
                {
                    int iterator = 0;
                    foreach (Bild bild in anhaenger.BildListe)
                    {
                        MemoryStream memoryStream = new MemoryStream();
                        file.CopyTo(memoryStream);
                        anhaenger.BildListe[iterator].BildBytes = memoryStream.ToArray();
                        iterator++;
                    }
                    if (anhaenger.Save() == 1) result = Ok(anhaenger);
                    else result = NoContent();
                }
            }
            catch (Exception ex)
            {
                result = StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
            }
            return result;
        }

        //DELETE: api/<AnhaengerController>/
        [HttpDelete()]
        public IActionResult Delete([FromBody] List<int> listToDelete)
        {
            IActionResult result = null;
            try
            {
                if (Anhaenger.Delete(listToDelete) > 0)
                {
                    result = Ok("trailer entries deleted!");
                }
                else
                {
                    result = NotFound("trailer(s) not found!");
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
