using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VRentalsClasses.Models;

namespace VRentalsClasses.Interfaces
{
    public enum FahrerStatus
    {
        unbekannt = 0,
        frei = 1,
        termin = 2,
        krank = 3,
        urlaub = 4,
        keinFahrer = 5,
    }
    public interface IFahrer: IPerson
    {
        //************************************************************************
        #region properties
        public bool IstFahrer { get; set; } 

        public FahrerStatus Status { get; set; }

        public byte[]? FahrerFoto { get; set; }

        public DateTime? FuehrerscheinAusstellungsDatum { get; set; }

        public DateTime? FuehrerscheinAblaufDatum { get; set; }

        public string? FuehrerscheinNummer { get; set; }

        public List<FuehrerscheinKlasse>? FuehrerscheinKlassenList { get; set; }
        #endregion

    }
}
