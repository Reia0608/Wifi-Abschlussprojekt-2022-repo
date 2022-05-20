﻿using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Schaden
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_schaden";
		private const string COLUMNS = "schaden_id, schadensart, beschreibung, anfallendekosten, schaden_datum";
		#endregion

		//************************************************************************
		#region static methods
		// WIP: if anhaenger_id does not exist in the db, creates a new entry with null values!
		public static Schaden Get(int schaden_id)
		{
			Schaden schaden = new Schaden();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where schaden_id = :sid";
			command.Parameters.AddWithValue("sid", schaden_id);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					schaden = new Schaden();
					{
						schaden = new Schaden(reader);
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
			return schaden;
		}

		public static List<Schaden> GetList()
		{
			List<Schaden> schadenListe = new List<Schaden>();
			Schaden schaden = null;

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
				schadenListe.Add(schaden = new Schaden(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return schadenListe;
		}
		#endregion
		//************************************************************************
		#region constructors#
		public Schaden()
		{

		}

		public Schaden(NpgsqlDataReader reader)
		{
			Schaden_Id = reader.GetInt32(0);
			SchadensArt = reader.IsDBNull(1) ? null : reader.GetString(1);
			Beschreibung = reader.IsDBNull(2) ? null : reader.GetString(2);
			AnfallendeKosten = reader.IsDBNull(3) ? null : reader.GetDouble(3);
			SchadensDatum = reader.IsDBNull(4) ? null : (DateTime?)reader.GetDateTime(4);
		}

		#endregion
		//************************************************************************
		#region properties
		[JsonPropertyName("schaden_id")]
		public int? Schaden_Id { get; set; }

		[JsonPropertyName("schadensart")]
		public string? SchadensArt { get; set; }

		[JsonPropertyName("beschreibung")]
		public string? Beschreibung { get; set; }

		[JsonPropertyName("anfallendekosten")]
		public double? AnfallendeKosten { get; set; }

		[JsonIgnore()]
		public List<byte[]>? SchadenBildListe { get; set; }

		[JsonPropertyName("schaden_datum")]
		public DateTime? SchadensDatum { get; set; }


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

			if (this.Schaden_Id.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set schadensart = :sart, beschreibung = :bes, anfallendekosten = :afk, schaden_datum = :sd where schaden_id = :sid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.Schaden_Id = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:sid, :sart, :bes, :afk, :sd)";
			}

			command.Parameters.AddWithValue("sid", this.Schaden_Id);
			command.Parameters.AddWithValue("sart", String.IsNullOrEmpty(this.SchadensArt) ? (object)DBNull.Value : (object)this.SchadensArt);
			command.Parameters.AddWithValue("bes", String.IsNullOrEmpty(this.Beschreibung) ? (object)DBNull.Value : (object)this.Beschreibung);
			command.Parameters.AddWithValue("afk", this.AnfallendeKosten.HasValue ? (object)this.AnfallendeKosten.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("sd", !this.SchadensDatum.HasValue ? (object)DBNull.Value : (object)this.SchadensDatum.Value);
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

		public int Save(int id)
		{
			int result = -1;
			NpgsqlCommand command = new NpgsqlCommand();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}

			command.CommandText = $"update {SCHEMA}.{TABLE} set schadensart = :sart, beschreibung = :bes, anfallendekosten = :afk, schaden_datum = :sd where schaden_id = :sid";
			//WIP: WARNING! Potential security danger! User could change the id to what he wants?!
			command.Parameters.AddWithValue("sid", id);
			command.Parameters.AddWithValue("sart", String.IsNullOrEmpty(this.SchadensArt) ? (object)DBNull.Value : (object)this.SchadensArt);
			command.Parameters.AddWithValue("bes", String.IsNullOrEmpty(this.Beschreibung) ? (object)DBNull.Value : (object)this.Beschreibung);
			command.Parameters.AddWithValue("afk", this.AnfallendeKosten.HasValue ? (object)this.AnfallendeKosten.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("sd", !this.SchadensDatum.HasValue ? (object)DBNull.Value : (object)this.SchadensDatum.Value);

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
			command.CommandText = $"delete from {SCHEMA}.{TABLE} where schaden_id = :sid";
			command.Parameters.AddWithValue("sid", this.Schaden_Id);
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
