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

        // GET: api/<AnhaengerController>/5
        [HttpGet("{id}")]
        public Anhaenger Get(int id) => Anhaenger.Get(id);

        [HttpGet("{id}/bild")]
        public FileStreamResult GetBild(int id)
        {
            Anhaenger anhaenger = Anhaenger.Get(id);
            if (anhaenger?.BildBytesList != null)
            {
                foreach (byte[] byteBild in anhaenger.BildBytesList)
                {
                    MemoryStream memoryStream = new MemoryStream(byteBild);
                    return new FileStreamResult(memoryStream, "image/jpeg");
                }
            }
            return null;
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
                    foreach (byte[] bildBytes in anhaenger.BildBytesList)
                    {
                        MemoryStream memoryStream = new MemoryStream();
                        file.CopyTo(memoryStream);
                        anhaenger.BildBytesList[iterator] = memoryStream.ToArray();
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

        //DELETE: api/<AnhaengerController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Anhaenger anhaenger = Anhaenger.Get(id);
            IActionResult result = null;
            try
            {
                if (anhaenger.Delete() == 1)
                {
                    result = Ok("trailer entry deleted!");
                }
                else
                {
                    result = NotFound("trailer not found!");
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
