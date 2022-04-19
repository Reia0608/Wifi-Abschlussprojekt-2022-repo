using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class FuehrerscheinKlasse: IFuehrerscheinKlassen
    {
        //************************************************************************

        #region properties
        public FuehrerscheinKlassenTyp BesesseneFuehrerscheinKlasse { get; set; } = FuehrerscheinKlassenTyp.kein;
        public string? Beschreibung { get; set; }
        public int? GewichtInKg { get; set; }
        public int? RaederAnzahl { get; set; }
        public int? Sitzplaetze { get; set; }
        public int? GesamtMasseinKg { get; set; }

        public int? GeschwindigkeitInKmh { get; set; }

        public int? MotorLeistungInPS { get; set; }

        #endregion
        //************************************************************************
    }
}
