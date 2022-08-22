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
		private const string COLUMNS = "bewegung_id, benutzer_id, bewegungsdatum, beschreibung, grund, abholort, rueckgabeort, abholdatum, abholzeit, rueckgabedatum, rueckgabezeit";
        #endregion
        //************************************************************************
        #region static methods

        public static Bewegung Get(int id)
        {
            Bewegung bewegung = new Bewegung();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where bewegung_id = :bwid";
            command.Parameters.AddWithValue("bwid", id);

            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                reader.Read();
                bewegung = new Bewegung(reader);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                reader.Close();
                DBConnection.GetConnection().Close();
            }
            return bewegung;
        }

        public static Bewegung GetByBenutzerId(int id)
        {
            Bewegung bewegung = new Bewegung();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where benutzer_id = :bid";
            command.Parameters.AddWithValue("bid", id);

            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                reader.Read();
                bewegung = new Bewegung(reader);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                reader.Close();
                DBConnection.GetConnection().Close();
            }
            return bewegung;
        }

        public static Bewegung GetByKraftfahrzeugId(int id)
        {
            Bewegung bewegung = new Bewegung();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where {SCHEMA}.{TABLE} kraftfahrzeug_id = :kid";
            command.Parameters.AddWithValue("bid", id);

            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                reader.Read();
                bewegung = new Bewegung(reader);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                reader.Close();
                DBConnection.GetConnection().Close();
            }
            return bewegung;
        }

        #endregion
        //************************************************************************
        #region constructor
        public Bewegung()
		{

		}

		public Bewegung(NpgsqlDataReader reader)
		{
			Bewegung_Id = reader.GetInt32(0);
			Mietgegenstand_Id = reader.IsDBNull(1) ? null : reader.GetInt32(1);
			Benutzer_Id = reader.IsDBNull(2) ? null : reader.GetInt32(2);
			BewegungsDatum = reader.IsDBNull(3) ? null : reader.GetDateTime(3);
			Beschreibung = reader.IsDBNull(4) ? null : reader.GetString(4);
			Grund = reader.IsDBNull(5) ? null : reader.GetString(5);
			AbholOrt = reader.IsDBNull(6) ? null : reader.GetString(6);
			RueckgabeOrt = reader.IsDBNull(7) ? null : reader.GetString(7);
			AbholDatum = reader.IsDBNull(8) ? null : reader.GetDateTime(8);
			AbholZeit = reader.IsDBNull(9) ? null : reader.GetDateTime(9);
			RueckgabeDatum = reader.IsDBNull(10) ? null : reader.GetDateTime(10);
			RueckgabeZeit = reader.IsDBNull(11) ? null : reader.GetDateTime(11);
		}
		#endregion
		//************************************************************************
		#region properties

		[JsonPropertyName("bewegung_id")]
		public int? Bewegung_Id { get; set; }

		[JsonPropertyName("mietgegenstand_id")]
		public int? Mietgegenstand_Id { get; set; }

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
        public DateTime? AbholDatum { get; set; }

        [JsonPropertyName("abholzeit")]
        public DateTime? AbholZeit { get; set; }

        [JsonPropertyName("rueckgabedatum")]
        public DateTime? RueckgabeDatum { get; set; }

        [JsonPropertyName("rueckgabezeit")]
        public DateTime? RueckgabeZeit { get; set; }

        #endregion
        //************************************************************************
        #region public methods

        public int Save()
        {
            int result = -1;
            NpgsqlCommand command = new NpgsqlCommand();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                command.Connection = DBConnection.GetConnection();
                command.Connection.Open();
            }

            if (this.Bewegung_Id.HasValue)
            {
                command.CommandText = $"update {SCHEMA}.{TABLE} set benutzer_id = :bid, beschreibung = :bes, grund = :gru, abholort = :ao, rueckgabeort = :ro, abholdatum = :ad, abholzeit = :az, rueckgabedatum = :rd, rueckgabezeit = :rz where bewegung_id = :bwid";
            }
            else
            {
                this.BewegungsDatum = DateTime.Now;
                command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
                this.Bewegung_Id = (int)((long)command.ExecuteScalar());
                command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:bwid, :bid, :bes, :gru, :ao, :ro, :ad, :az, :rd, :ro)";
            }

            command.Parameters.AddWithValue("bwid", this.Bewegung_Id);
            command.Parameters.AddWithValue("bid", this.Benutzer_Id.HasValue ? (int)this.Benutzer_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("bes", String.IsNullOrEmpty(this.Beschreibung) ? (object)DBNull.Value : (object)this.Beschreibung);
            command.Parameters.AddWithValue("gru", String.IsNullOrEmpty(this.Grund) ? (object)DBNull.Value : (object)this.Grund);
            command.Parameters.AddWithValue("ao", String.IsNullOrEmpty(this.AbholOrt) ? (object)DBNull.Value : (object)this.AbholOrt);
            command.Parameters.AddWithValue("ro", String.IsNullOrEmpty(this.RueckgabeOrt) ? (object)DBNull.Value : (object)this.RueckgabeOrt);
            command.Parameters.AddWithValue("ad", this.AbholDatum.HasValue ? (object)this.AbholDatum.Value : (object)DBNull.Value);
            command.Parameters.AddWithValue("az", this.AbholZeit.HasValue ? (object)this.AbholZeit.Value : (object)DBNull.Value);
            command.Parameters.AddWithValue("rd", this.RueckgabeDatum.HasValue ? (object)this.RueckgabeDatum.Value : (object)DBNull.Value);
            command.Parameters.AddWithValue("rz", this.RueckgabeZeit.HasValue ? (object)this.RueckgabeZeit.Value : (object)DBNull.Value);
          
            try
            {
                result = command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                command.Connection.Close();
            }
            return result;
        }

        #endregion
        //************************************************************************
    }
}
