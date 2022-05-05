using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace VRentalsClasses.Models
{
    public class Kontakt
    {
        //************************************************************************
        #region properties
        [JsonPropertyName("kontaktid")]
        public int? KontaktId { get; set; }
        [JsonPropertyName("kategorie")]
        public string? Kategorie { get; set; }
        [JsonPropertyName("wert")]
        public string? Wert { get; set; }
        #endregion 
        //************************************************************************
    }

}
