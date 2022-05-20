using Npgsql;
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
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_kontakt";
		private const string COLUMNS = "kontakt_id, kategorie, wert";

		#endregion
		//************************************************************************
		#region static methods
		// WIP: if anhaenger_id does not exist in the db, creates a new entry with null values!
		public static Kontakt Get(int kontakt_id)
		{
			Kontakt kontakt = new Kontakt();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where kontakt_id = :kid";
			command.Parameters.AddWithValue("kid", kontakt_id);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					kontakt = new Kontakt();
					{
						kontakt = new Kontakt(reader);
					};
				}
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
			return kontakt;
		}

		public static List<Kontakt> GetList()
		{
			List<Kontakt> kontaktListe = new List<Kontakt>();
			Kontakt kontakt = new Kontakt();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE}"; // WIP: order by?
			NpgsqlDataReader reader = command.ExecuteReader();

			while (reader.Read())
			{
				kontaktListe.Add(kontakt = new Kontakt(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return kontaktListe;
		}
		#endregion
		//************************************************************************
		#region constructors#
		public Kontakt()
		{

		}

		public Kontakt(NpgsqlDataReader reader)
		{
			KontaktId = reader.GetInt32(0);
			Kategorie = reader.IsDBNull(1) ? null : reader.GetString(1);
			Wert = reader.IsDBNull(2) ? null : reader.GetString(2);
		}
		#endregion
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

			if (this.KontaktId.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set kategorie = :kat, wert = :wer where kontakt_id = :kid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.KontaktId = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:kid, :kat, :wer)";
			}

			command.Parameters.AddWithValue("kid", this.KontaktId);
			command.Parameters.AddWithValue("kat", String.IsNullOrEmpty(this.Kategorie) ? (object)DBNull.Value : (object)this.Kategorie);
			command.Parameters.AddWithValue("wer", String.IsNullOrEmpty(this.Wert) ? (object)DBNull.Value : (object)this.Wert);
			
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

		public int Delete()
		{
			int result = -1;
			NpgsqlCommand command = new NpgsqlCommand();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}
			command.CommandText = $"delete from {SCHEMA}.{TABLE} where kontakt_id = :kid";
			command.Parameters.AddWithValue("aid", this.KontaktId);
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
	}
}
