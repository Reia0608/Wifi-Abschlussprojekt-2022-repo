using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Anhaenger: ILandfahrzeug
    {
        public IAdresse? AktuellerStandort { get; set; }
        public List<Ausgaben>? KostenListe { get; set; }

        public List<Schaden>? SchadenListe { get; set; }

        public string? Art { get; set; } = "Anhänger";

        public int? MietPreis { get; set; }

        public GegenstandZustandTyp GegenstandZustand { get; set; }
        public string? Kategorie { get; set; }
        public List<byte[]>? BildBytesList { get; set; }
        public List<Adresse>? AdressenList { get; set; }
    }
}
