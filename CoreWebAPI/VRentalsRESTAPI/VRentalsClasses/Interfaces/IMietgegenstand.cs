using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VRentalsClasses.Models;

namespace VRentalsClasses.Interfaces
{
    public enum GegenstandZustandTyp 
    {
        frei = 0,
        vermietet = 1, 
        reparatur = 2,
        wartung = 3
    }
    public interface IMietgegenstand
    {
        //************************************************************************
        #region properties
        // Eine Liste der Ausgaben für die Wartung und Reparatur des Gegenstands.
        public List<Ausgaben>? KostenListe { get; set; }

        // Eine Liste der Schaden an dem Gegenstand.
        public List<Schaden>? SchadenListe { get; set; }

        // Für welchen Preis wird es vermietet?
        public double? MietPreis { get; set; }
        // Was ist der jetzige Zustand des Gegenstands? Ist es vermietbar? Wird es gerade gewartet? etc... 
        public GegenstandZustandTyp GegenstandZustand { get; set; }
        // Gehört der Gegenstand einer Kategorie an?
        public string? Kategorie { get; set; }
        // Eine von Fotos des Gegenstands.
        public List<Bild>? BildListe { get; set; }
        // Wo ist der Gegenstand vorzufinden?
        public List<Adresse>? AdressenListe { get; set; }

        #endregion
        //************************************************************************
    }
}
