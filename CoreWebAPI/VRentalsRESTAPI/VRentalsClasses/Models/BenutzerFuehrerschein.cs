using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using Npgsql;

namespace VRentalsClasses.Models
{
    public class BenutzerFuehrerschein
    {
        #region constructor
        public BenutzerFuehrerschein()
        {

        }

        public BenutzerFuehrerschein(NpgsqlDataReader reader)
        {
            Fsk_Id = reader.IsDBNull(0) ? null : reader.GetInt32(0);
            Users_Id = reader.IsDBNull(1) ? null : reader.GetInt32(1);
            AM = reader.IsDBNull(2) ? false : reader.GetBoolean(2);
            A1 = reader.IsDBNull(3) ? false : reader.GetBoolean(3);
            A2 = reader.IsDBNull(4) ? false : reader.GetBoolean(4);
            A = reader.IsDBNull(5) ? false : reader.GetBoolean(5);
            B1 = reader.IsDBNull(6) ? false : reader.GetBoolean(6);
            B = reader.IsDBNull(7) ? false : reader.GetBoolean(7);
            C1 = reader.IsDBNull(8) ? false : reader.GetBoolean(8);
            C = reader.IsDBNull(9) ? false : reader.GetBoolean(9);
            D1 = reader.IsDBNull(10) ? false : reader.GetBoolean(10);
            D = reader.IsDBNull(11) ? false : reader.GetBoolean(11);
            BE = reader.IsDBNull(12) ? false : reader.GetBoolean(12);
            C1E = reader.IsDBNull(13) ? false : reader.GetBoolean(13);
            CE = reader.IsDBNull(14) ? false : reader.GetBoolean(14);
            D1E = reader.IsDBNull(15) ? false : reader.GetBoolean(15);
            DE = reader.IsDBNull(16) ? false : reader.GetBoolean(16);
            F = reader.IsDBNull(17) ? false : reader.GetBoolean(17);
        }
        #endregion

        #region properties
        [JsonPropertyName("fsk_id")]
        public int? Fsk_Id { get; set; }

        [JsonPropertyName("users_id")]
        public int? Users_Id { get; set; }

        [JsonPropertyName("am")]
        public bool? AM { get; set; }

        [JsonPropertyName("a1")]
        public bool? A1 { get; set; }

        [JsonPropertyName("a2")]
        public bool? A2 { get; set; }

        [JsonPropertyName("a")]
        public bool? A { get; set; }

        [JsonPropertyName("b1")]
        public bool? B1 { get; set; }

        [JsonPropertyName("b")]
        public bool? B { get; set; }

        [JsonPropertyName("c1")]
        public bool? C1 { get; set; }

        [JsonPropertyName("c")]
        public bool? C { get; set; }

        [JsonPropertyName("d1")]
        public bool? D1 { get; set; }

        [JsonPropertyName("d")]
        public bool? D { get; set; }

        [JsonPropertyName("be")]
        public bool? BE { get; set; }

        [JsonPropertyName("c1e")]
        public bool? C1E { get; set; }

        [JsonPropertyName("ce")]
        public bool? CE { get; set; }

        [JsonPropertyName("d1e")]
        public bool? D1E { get; set; }

        [JsonPropertyName("de")]
        public bool? DE { get; set; }

        [JsonPropertyName("f")]
        public bool? F { get; set; }
        #endregion
    }
}
