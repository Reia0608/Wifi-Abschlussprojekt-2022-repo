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
			Benutzer_Id = reader.IsDBNull(1) ? null : reader.GetInt32(1);
			BewegungsDatum = reader.IsDBNull(2) ? null : reader.GetDateTime(2);
			Beschreibung = reader.IsDBNull(3) ? null : reader.GetString(3);
			Grund = reader.IsDBNull(4) ? null : reader.GetString(4);
		}
		#endregion
		//************************************************************************
		#region properties

		[JsonPropertyName("bewegungid")]
		public int? Bewegung_Id { get; set; }

		[JsonPropertyName("gemietetegegenstaendelist")]
		public List<IMietgegenstand>? GemieteteGegenstaendeList { get; set; }

		[JsonPropertyName("benutzerid")]
		public int? Benutzer_Id { get; set; }

		[JsonPropertyName("bewegungsdatum")]
		public DateTime? BewegungsDatum { get; set; }

		[JsonPropertyName("beschreibung")]
		public string? Beschreibung { get; set; }

		[JsonPropertyName("grund")]
		public string? Grund { get; set; }

		#endregion
		//************************************************************************
		#region public methods
		#endregion
		//************************************************************************
	}
}
