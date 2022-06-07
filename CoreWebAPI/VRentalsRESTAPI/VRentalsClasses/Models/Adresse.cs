using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Adresse: IAdresse
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_adresse";
		private const string COLUMNS = "adresse_id, bezeichnung, land, stadt_ort, plz, strasse, strassennummer, anhaenger_id, kraftfahrzeug_id, ausgabenstelle_id, users_id";

		#endregion
		//************************************************************************
		#region static methods
		// WIP: if anhaenger_id does not exist in the db, creates a new entry with null values!
		public static Adresse Get(int adresse_id)
		{
			Adresse adresse = new Adresse();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where adresse_id = :aid";
			command.Parameters.AddWithValue("aid", adresse_id);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					adresse = new Adresse();
					{
						adresse = new Adresse(reader);
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
			return adresse;
		}

		public static List<Adresse> GetList()
		{
			List<Adresse> adresseListe = new List<Adresse>();
			Adresse adresse = new Adresse();

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
				adresseListe.Add(adresse = new Adresse(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return adresseListe;
		}
		#endregion
		//************************************************************************
		#region constructors#
		public Adresse()
		{

		}

		public Adresse(NpgsqlDataReader reader)
		{
			Adresse_Id = reader.GetInt32(0);
			Bezeichnung = reader.IsDBNull(1) ? null : reader.GetString(1);
			Land = reader.IsDBNull(2) ? null : reader.GetString(2);
			Stadt_Ort = reader.IsDBNull(3) ? null : reader.GetString(3);
			PLZ = reader.IsDBNull(4) ? null : reader.GetString(4);
			Strasse = reader.IsDBNull(5) ? null : reader.GetString(5);
			StrassenNummer = reader.IsDBNull(6) ? null : reader.GetString(6);
			Anhaenger_Id = reader.IsDBNull(7) ? null : reader.GetInt32(7);
			Kraftfahrzeug_Id = reader.IsDBNull(8) ? null : reader.GetInt32(8);
			Ausgabenstelle_Id = reader.IsDBNull(9) ? null : reader.GetInt32(9);
			Users_Id = reader.IsDBNull(10) ? null : reader.GetInt32(10);
		}

		#endregion
		//************************************************************************
		#region 
		[JsonPropertyName("adresse_id")]
		public int? Adresse_Id { get; set; }

		[JsonPropertyName("bezeichnung")]
		public string? Bezeichnung { get; set; }

		[JsonPropertyName("land")]
		public string? Land { get; set; }

		[JsonPropertyName("stadt_ort")]
		public string? Stadt_Ort { get; set; }

		[JsonPropertyName("plz")]
		public string? PLZ { get; set; }

		[JsonPropertyName("strasse")]
		public string? Strasse { get; set; }

		[JsonPropertyName("strassennummer")]
		public string? StrassenNummer { get; set; }

		[JsonPropertyName("anhaenger_id")]
		public int? Anhaenger_Id { get; set; }

		[JsonPropertyName("kraftfahrzeug_id")]
		public int? Kraftfahrzeug_Id { get; set; }

		[JsonPropertyName("ausgabenstelle_id")]
		public int? Ausgabenstelle_Id { get; set; }

		[JsonPropertyName("users_id")]
		public int? Users_Id { get; set; }



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

			if (this.Adresse_Id.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set bezeichnung = :bez, land = :lan, stadt_ort = :so, plz = :plz, strasse = :str, strassennummer = :stn, anhaenger_id = :ahid, kraftfahrzeug_id = :kid, ausgabenstelle_id = :asid, users_id = :uid where adresse_id = :aid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.Adresse_Id = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:aid, :bez, :lan, :so, :plz, :str, :stn, :ahid, :kid, :asid, :uid)";
			}

			command.Parameters.AddWithValue("aid", this.Adresse_Id);
			command.Parameters.AddWithValue("bez", String.IsNullOrEmpty(this.Bezeichnung) ? (object)DBNull.Value : (object)this.Bezeichnung);
			command.Parameters.AddWithValue("lan", String.IsNullOrEmpty(this.Land) ? (object)DBNull.Value : (object)this.Land);
			command.Parameters.AddWithValue("so", String.IsNullOrEmpty(this.Stadt_Ort) ? (object)DBNull.Value : (object)this.Stadt_Ort);
			command.Parameters.AddWithValue("plz", String.IsNullOrEmpty(this.PLZ) ? (object)DBNull.Value : (object)this.PLZ);
			command.Parameters.AddWithValue("str", String.IsNullOrEmpty(this.Strasse) ? (object)DBNull.Value : (object)this.Strasse);
			command.Parameters.AddWithValue("stn", String.IsNullOrEmpty(this.StrassenNummer) ? (object)DBNull.Value : (object)this.StrassenNummer);
			command.Parameters.AddWithValue("ahid", this.Anhaenger_Id.HasValue ? (object)this.Anhaenger_Id.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("kid", this.Kraftfahrzeug_Id.HasValue ? (object)this.Kraftfahrzeug_Id.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("asid", this.Ausgabenstelle_Id.HasValue ? (object)this.Ausgabenstelle_Id.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("uid", this.Users_Id.HasValue ? (object)this.Users_Id.Value : (object)DBNull.Value);
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
			command.CommandText = $"delete from {SCHEMA}.{TABLE} where adresse_id = :aid";
			command.Parameters.AddWithValue("aid", this.Adresse_Id);
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
