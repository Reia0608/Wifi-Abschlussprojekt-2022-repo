using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;
using Google.Cloud.Firestore;

namespace VRentalsClasses.Models
{
    public class Bild
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_bilder";
		private const string COLUMNS = "bilder_id, bild, bild_url";
		#endregion

		//************************************************************************
		#region static methods
		// WIP: if anhaenger_id does not exist in the db, creates a new entry with null values!
		public static Anhaenger Get(int bilder_id)
		{
			Anhaenger anhaenger = new Anhaenger();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where bilder_id = :bid";
			command.Parameters.AddWithValue("bid", bilder_id);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					anhaenger = new Anhaenger();
					{
						anhaenger = anhaenger.CreateAnhaenger(reader);
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
			return anhaenger;
		}

		public static List<Bild> GetList()
		{
			List<Bild> bilderListe = new List<Bild>();
			Bild bild = new Bild();

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
				bilderListe.Add(bild = bild.CreateBild(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return bilderListe;
		}
		#endregion
		//************************************************************************
		#region constructors#
		public Bild()
		{

		}

		public Bild(NpgsqlDataReader reader)
		{
			Bilder_Id = reader.GetInt32(0);
			BildBytes = reader.IsDBNull(1) ? null : (byte[])reader.GetValue(1);
			Bild_Url = reader.IsDBNull(2) ? null : reader.GetString(2);
		}

		#endregion
		//************************************************************************
		#region properties
		[JsonPropertyName("bilder_id")]
		public int? Bilder_Id { get; set; }
		[JsonPropertyName("bildbyte")]
		public byte[]? BildBytes { get; set; }
		[JsonPropertyName("bild_url")]
		public string? Bild_Url { get; set; }



		#endregion

		//************************************************************************
		#region public methods

		public Bild CreateBild(NpgsqlDataReader reader)
		{
			Bild bild = new Bild();

			bild = new Bild()
			{
				Bilder_Id = reader.GetInt32(0),
				BildBytes = reader.IsDBNull(1) ? null : (byte[])reader.GetValue(1),
				Bild_Url = reader.IsDBNull(2) ? null : reader.GetString(2),
		};
			return bild;
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

			if (this.Bilder_Id.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set bild = :bil, bild_url = :url where bilder_id = :bid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.Bilder_Id = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:bid, :bil, :url)";
			}

			command.Parameters.AddWithValue("bid", this.Bilder_Id);
			command.Parameters.AddWithValue("bil", this.BildBytes == null ? (object)DBNull.Value : this.BildBytes);
			command.Parameters.AddWithValue("url", String.IsNullOrEmpty(this.Bild_Url) ? (object)DBNull.Value : (object)this.Bild_Url);

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

			command.CommandText = $"update {SCHEMA}.{TABLE} set bild = :bil, bild_url = :url where bilder_id = :bid";
			//WIP: WARNING! Potential security danger! User could change the id to what he wants?!
			command.Parameters.AddWithValue("bid", id);
			command.Parameters.AddWithValue("bil", this.BildBytes == null ? (object)DBNull.Value : this.BildBytes);
			command.Parameters.AddWithValue("url", String.IsNullOrEmpty(this.Bild_Url) ? (object)DBNull.Value : (object)this.Bild_Url);

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
			command.CommandText = $"delete from {SCHEMA}.{TABLE} where bilder_id = :bid";
			command.Parameters.AddWithValue("bid", this.Bilder_Id);
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

		//public override string ToString()
		//{
		//	return this.Art;
		//}

		public void Refresh()
		{
			//this.BewegungList = Bewegung.GetList(this);
		}

		#endregion
	}
}

