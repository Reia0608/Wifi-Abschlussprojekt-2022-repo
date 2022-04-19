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

        public byte[]? Foto { get; set; }

        public DateTime? AusstellungsDatum { get; set; }

        public DateTime? AblaufDatum { get; set; }

        public string? FuehrerscheinNummer { get; set; }

        public List<FuehrerscheinKlasse>? FuehrerscheinKlassenList { get; set; }
        #endregion

    }
}
