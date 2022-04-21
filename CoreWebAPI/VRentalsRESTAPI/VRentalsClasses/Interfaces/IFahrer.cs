using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VRentalsClasses.Models;

namespace VRentalsClasses.Interfaces
{
    public interface IFahrer: IPerson
    {
        //************************************************************************
        #region properties

        public byte[]? FahrerFoto { get; set; }

        public DateTime? FuehrerscheinAusstellungsDatum { get; set; }

        public DateTime? FuehrerscheinAblaufDatum { get; set; }

        public string? FuehrerscheinNummer { get; set; }

        public List<FuehrerscheinKlasse>? FuehrerscheinKlassenList { get; set; }
        #endregion

    }
}
