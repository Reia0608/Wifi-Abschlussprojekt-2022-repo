using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VRentalsClasses.Models
{
    public class Schaden
    {
        //************************************************************************
        #region properties
        public string? SchadensArt { get; set; }

        public string? Beschreibung { get; set; }

        public int? AnfallendeKosten { get; set; }

        public List<byte[]>? SchadenBildListe { get; set; }
        #endregion
        //************************************************************************
    }
}
