using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VRentalsClasses
{
    public class Schaden
    {
        string SchadensArt { get; set; }

        string Beschreibung { get; set; }

        int AnfallendeKosten { get; set; }

        byte[] SchadenBild { get; set; }
    }
}
