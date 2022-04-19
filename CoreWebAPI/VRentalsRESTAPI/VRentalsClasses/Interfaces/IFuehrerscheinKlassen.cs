using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VRentalsClasses.Interfaces
{
    public enum FuehrerscheinKlassenTyp 
    {
        kein = 0,
        AM = 1,
        A1 = 2,
        A2 = 3,
        A = 4,
        B1 = 5,
        B = 6,
        C1 = 7,
        C = 8,
        D1 = 9,
        D = 10,
        BE = 11,
        C1E = 12,
        D1E = 13,
        DE = 14,
        F = 15   
    }
    public interface IFuehrerscheinKlassen
    {
        //************************************************************************
        #region properties
        public FuehrerscheinKlassenTyp BesesseneFuehrerscheinKlasse { get; set; }
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
