using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace VRentalsClasses.Models
{
    public class Funktionen
    {
        public string GetCookie(ControllerBase controller)
        {
            string bm;
            bm = controller.Request.Cookies["benutzermerkmal"];
            return bm;
        }
    }
}
