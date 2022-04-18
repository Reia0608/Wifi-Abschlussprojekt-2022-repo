using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VRentalsClasses
{
    public enum GegenstandZustandTyp 
    {
        frei = 0,
        vermietet = 1, 
        reparatur = 2,
    }
    public interface IMietgegenstand
    {
        public List<Ausgaben>? KostenListe { get; set; }

        public List<Schaden>? SchadenListe { get; set; }

        public string? Art { get; set; }

        public int? MietPreis { get; set; }
        
        public GegenstandZustandTyp GegenstandZustand { get; set; }
        public string? Kategorie { get; set; }
        public byte[]? BildBytes { get; set; }

    }
}
