using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Fahrer: IFahrer
    {
        //************************************************************************
        #region properties
        public int? UserId { get; set; }
        public string? Vorname { get; set; }

        public string? Nachname { get; set; }

        public GeschlechtsTyp Geschlecht { get; set; }

        public DateTime? Geburtsdatum { get; set; }

        public string? GeburtsOrt { get; set; }

        public string? UserName { get; set; }

        public string? Passwort { get; set; }

        public string? PasswortHash { get; set; }

        public RollenTyp Rolle { get; set; }

        public DateTime? RegistrierungsTag { get; set; }

        public DateTime? LetzteAnmeldung { get; set; }

        public string? BenutzerMerkmal { get; set; }

        public DateTime? MerkmalGiltBis { get; set; }

        public byte[]? FahrerFoto { get; set; }

        public DateTime? FuehrerscheinAusstellungsDatum { get; set; }

        public DateTime? FuehrerscheinAblaufDatum { get; set; }

        public string? FuehrerscheinNummer { get; set; }

        public List<FuehrerscheinKlasse>? FuehrerscheinKlassenList { get; set; }
        #endregion
        //************************************************************************
    }
}
