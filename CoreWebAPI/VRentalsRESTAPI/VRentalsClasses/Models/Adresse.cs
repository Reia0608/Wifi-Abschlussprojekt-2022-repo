using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Adresse: IAdresse
    {
        public string? Bezeichnung { get; set; }
        public string? Land { get; set; }
        public string? Stadt_Ort { get; set; }
        public string? PLZ { get; set; }
        public string? Strasse { get; set; }
        public string? StrassenNummer { get; set; }
    }
}
