using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Ausgaben
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_ausgaben";
		private const string COLUMNS = "ausgaben_id, kosten_art, kosten";
		#endregion

		//************************************************************************
		#region static methods
		// WIP: if anhaenger_id does not exist in the db, creates a new entry with null values!
		public static Ausgaben Get(int ausgaben_id)
		{
			Ausgaben ausgaben = new Ausgaben();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where ausgaben_id = :aid";
			command.Parameters.AddWithValue("aid", ausgaben_id);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					ausgaben = new Ausgaben();
					{
						ausgaben = ausgaben.CreateAusgaben(reader);
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
			return ausgaben;
		}

		public static List<Ausgaben> GetList()
		{
			List<Ausgaben> ausgabenListe = new List<Ausgaben>();
			Ausgaben ausgaben = new Ausgaben();

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
				ausgabenListe.Add(ausgaben= ausgaben.CreateAusgaben(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return ausgabenListe;
		}
		#endregion
		//************************************************************************
		#region constructors#
		public Ausgaben()
		{

		}

		public Ausgaben(NpgsqlDataReader reader)
		{
			Ausgaben_Id = reader.GetInt32(0);
			KostenArt = reader.IsDBNull(1) ? null : reader.GetString(1);
			Kosten = reader.IsDBNull(2) ? null : reader.GetDouble(2);
		}

		#endregion
		//************************************************************************
		#region properties
		public int? Ausgaben_Id { get; set; }
		public string? KostenArt { get; set; }

        public double? Kosten { get; set; }
		#endregion
		//************************************************************************
		#region public methods

		public Ausgaben CreateAusgaben(NpgsqlDataReader reader)
		{
			Ausgaben ausgaben = new Ausgaben();

			ausgaben = new Ausgaben()
			{
				Ausgaben_Id = reader.GetInt32(0),
				KostenArt = reader.IsDBNull(1) ? null : reader.GetString(1),
				Kosten = reader.IsDBNull(2) ? null : reader.GetDouble(2),
			};
			return ausgaben;
		}

		public int Save()
		{
			int result = -1;
			NpgsqlCommand command = new NpgsqlCommand();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}

			if (this.Ausgaben_Id.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set kosten_art = :ka, kosten = :ko where ausgaben_id = :aid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.Ausgaben_Id = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:aid, :ka, :ko)";
			}

			command.Parameters.AddWithValue("aid", this.Ausgaben_Id);
			command.Parameters.AddWithValue("ka", String.IsNullOrEmpty(this.KostenArt) ? (object)DBNull.Value : (object)this.KostenArt);
			command.Parameters.AddWithValue("ko", this.Kosten.HasValue ? (double)this.Kosten : 9999);

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

			command.CommandText = $"update {SCHEMA}.{TABLE} set kosten_art = :ka, kosten = :ko where anhaenger_id = :aid";
			//WIP: WARNING! Potential security danger! User could change the id to what he wants?!
			command.Parameters.AddWithValue("aid", id);
			command.Parameters.AddWithValue("ka", String.IsNullOrEmpty(this.KostenArt) ? (object)DBNull.Value : (object)this.KostenArt);
			command.Parameters.AddWithValue("ko", this.Kosten.HasValue ? (double)this.Kosten : 9999);

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
			command.CommandText = $"delete from {SCHEMA}.{TABLE} set kosten_art = :ka, kosten = :ko where anhaenger_id = :aid";
			command.Parameters.AddWithValue("aid", this.Ausgaben_Id);
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

	}
}
