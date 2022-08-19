using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Bewegung
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_bewegung";
		private const string COLUMNS = "bewegung_id, benutzer_id, bewegungsdatum, beschreibung, grund";
        #endregion
        //************************************************************************
        #region static methods
        #endregion
        //************************************************************************
        #region constructor
        public Bewegung()
		{

		}

		public Bewegung(NpgsqlDataReader reader)
		{
			Bewegung_Id = reader.GetInt32(0);
			GemieteteGegenstaendeList = reader.IsDBNull(1) ? null : reader.GetInt32(1);
			Benutzer_Id = reader.IsDBNull(2) ? null : reader.GetInt32(2);
			BewegungsDatum = reader.IsDBNull(3) ? null : reader.GetDateTime(3);
			Beschreibung = reader.IsDBNull(4) ? null : reader.GetString(4);
			Grund = reader.IsDBNull(5) ? null : reader.GetString(5);
			AbholOrt = reader.IsDBNull(6) ? null : reader.GetString(6);
			RueckgabeOrt = reader.IsDBNull(7) ? null : reader.GetString(7);
			AbholDatum = reader.IsDBNull(8) ? null : reader.GetDateTime(8);


		}
		#endregion
		//************************************************************************
		#region properties

		[JsonPropertyName("bewegungid")]
		public int? Bewegung_Id { get; set; }

		[JsonPropertyName("gemietetegegenstaendelist")]
		public int? GemieteteGegenstaendeList { get; set; }

		[JsonPropertyName("benutzerid")]
		public int? Benutzer_Id { get; set; }

		[JsonPropertyName("bewegungsdatum")]
		public DateTime? BewegungsDatum { get; set; }

		[JsonPropertyName("beschreibung")]
		public string? Beschreibung { get; set; }

		[JsonPropertyName("grund")]
		public string? Grund { get; set; }

        [JsonPropertyName("abholort")]
        public string? AbholOrt { get; set; }

        [JsonPropertyName("rueckgabeort")]
        public string? RueckgabeOrt { get; set; }

        [JsonPropertyName("abholdatum")]
        public DateOnly? AbholDatum { get; set; }

        [JsonPropertyName("abholzeit")]
        public DateTime? AbholZeit { get; set; }

        [JsonPropertyName("rueckgabedatum")]
        public DateOnly? RueckgabeDatum { get; set; }

        [JsonPropertyName("rueckgabezeit")]
        public DateTime? RueckgabeZeit { get; set; }

        #endregion
        //************************************************************************
        #region public methods
        #endregion
        //************************************************************************
    }
}
