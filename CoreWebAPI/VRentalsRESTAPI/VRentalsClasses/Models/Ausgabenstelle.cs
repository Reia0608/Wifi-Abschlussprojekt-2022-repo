using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VRentalsClasses.Models
{
    public class Ausgabenstelle
    {
        public Adresse? AusgabenstelleAdresse { get; set; }
        public List<Anhaenger>? AnhaengerListe { get; set; }
        public List<Kraftfahrzeug>? KraftfahrzeugListe { get; set; }
    }
}
