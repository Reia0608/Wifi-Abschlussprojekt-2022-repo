using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using static Npgsql.Replication.PgOutput.Messages.RelationMessage;

namespace VRentalsClasses.Models
{
    public class Fuehrerscheincouplet
    {
        //************************************************************************
        #region constructors#
        public Fuehrerscheincouplet()
        {

        }

        public Fuehrerscheincouplet(int? fahrer_Id, string? fuehrerscheinString)
        {
            Fahrer_Id = fahrer_Id;
            FuehrerscheinString = fuehrerscheinString;
        }

        #endregion
        //************************************************************************
        #region properties

        [JsonPropertyName("fahrer_id")]
        public int? Fahrer_Id { get; set; }

        [JsonPropertyName("fuehrerscheinstring")]
        public string? FuehrerscheinString { get; set; }

        #endregion

        //************************************************************************
        #region public methods

        #endregion
    }
}
