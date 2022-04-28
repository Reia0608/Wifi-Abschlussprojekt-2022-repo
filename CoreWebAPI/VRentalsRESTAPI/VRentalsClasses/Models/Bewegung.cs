using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using VRentalsClasses.Interfaces;
namespace VRentalsClasses.Models
{
    internal class Bewegung
    {
		//************************************************************************
		#region constants
		#endregion
		//************************************************************************
		//************************************************************************
		#region properties

		[JsonPropertyName("bewegungid")]
		public int? BewegungId { get; set; }

		[JsonPropertyName("gemietetegegenstaendelist")]
		public List<IMietgegenstand>? GemieteteGegenstaendeList { get; set; }

		[JsonPropertyName("benutzerid")]
		public int? BenutzerId { get; set; }

		[JsonPropertyName("bewegungsdatum")]
		public DateTime? BewegungsDatum { get; set; }

		[JsonPropertyName("beschreibung")]
		public string? Beschreibung { get; set; }

		[JsonPropertyName("grund")]
		public string? Grund { get; set; }

		#endregion
		//************************************************************************
	}
}
