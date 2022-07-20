using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Bild
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_bilder";
		private const string COLUMNS = "bilder_id, bild_bytes, bild_url, kraftfahrzeug_id, anhaenger_id, users_id, schaden_id";
		#endregion

		//************************************************************************
		#region static methods
		// WIP: if anhaenger_id does not exist in the db, creates a new entry with null values!
		public static Bild? Get(int? bilder_id)
		{
			Bild? bild = new Bild();
			if (bilder_id == null)
            {
				bild = null;
            }
			else
            {
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
						bild = new Bild();
						{
							bild = new Bild(reader);
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
			}
			return bild;
		}

		public static Bild GetByKraftfahrzeugId(int? kraftfahrzeug_id)
		{
			Bild bild = new Bild();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where kraftfahrzeug_id = :kid";
			command.Parameters.AddWithValue("kid", kraftfahrzeug_id);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					bild = new Bild();
					{
						bild = new Bild(reader);
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
			return bild;
		}

		public static List<Bild> GetBenutzerBildList(int? users_id)
		{
			List<Bild> bilderListe = new List<Bild>();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where users_id = :uid"; // WIP: order by?
			command.Parameters.AddWithValue("uid", users_id);
			NpgsqlDataReader reader = command.ExecuteReader();

			while (reader.Read())
			{
				bilderListe.Add(new Bild(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return bilderListe;
		}

		public static Bild GetBildByKfz(int kraftfahrzeug_id)
		{
			Bild kfzBild = new Bild();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"SELECT {COLUMNS} FROM {SCHEMA}.{TABLE} WHERE kraftfahrzeug_id = :kid";
			command.Parameters.AddWithValue("kid", kraftfahrzeug_id);
			NpgsqlDataReader reader = command.ExecuteReader();

			reader.Read();
			
			kfzBild = new Bild(reader);
			
			reader.Close();
			DBConnection.GetConnection().Close();
			return kfzBild;
		}

		public static List<Bild> GetAllKfzBildList()
        {
			List<Bild> bilderListe = new List<Bild>();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"SELECT {COLUMNS} FROM {SCHEMA}.{TABLE} WHERE kraftfahrzeug_id IS NOT NULL"; // WIP: order by?
			NpgsqlDataReader reader = command.ExecuteReader();

			while (reader.Read())
			{
				bilderListe.Add(new Bild(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return bilderListe;
		}

		public static List<Bild> GetAllBildBySpecificKfzList(string kfzString)
		{
			string Condition = $"";
			kfzString = kfzString.Remove(kfzString.Length - 1, 1);
			string[] kfzList = kfzString.Split("_");
			List<Bild> bilderListe = new List<Bild>();
			foreach (string kfz_id in kfzList)
            {
				if(kfz_id.Equals(kfzList.Last()))
                {
					Condition += "kraftfahrzeug_id = " + kfz_id;
				}
				else
                {
					Condition += "kraftfahrzeug_id = " + kfz_id + " OR ";
				}	
            }
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"SELECT {COLUMNS} FROM {SCHEMA}.{TABLE} WHERE {Condition}"; // WIP: order by?
			NpgsqlDataReader reader = command.ExecuteReader();

			while (reader.Read())
			{
				bilderListe.Add(new Bild(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return bilderListe;
		}

		public static List<Bild> GetKfzBildList(int? kraftfahrzeug_id)
		{
			List<Bild> bilderListe = new List<Bild>();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select distinct {COLUMNS} from {SCHEMA}.{TABLE} where kraftfahrzeug_id = :kid"; // WIP: order by?
			command.Parameters.AddWithValue("kid", kraftfahrzeug_id);
			NpgsqlDataReader reader = command.ExecuteReader();

			while (reader.Read())
			{
				bilderListe.Add(new Bild(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return bilderListe;
		}

		public static List<Bild> GetAnhaengerBildList(int? anhaenger_id)
		{
			List<Bild> bilderListe = new List<Bild>();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where anhaenger_id = :aid"; // WIP: order by?
			command.Parameters.AddWithValue("aid", anhaenger_id);
			NpgsqlDataReader reader = command.ExecuteReader();

			while (reader.Read())
			{
				bilderListe.Add(new Bild(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return bilderListe;
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
				bilderListe.Add(bild = new Bild(reader));
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
			KraftfahrzeugId = reader.IsDBNull(3) ? null : reader.GetInt32(3);
			AnhaengerId = reader.IsDBNull(4) ? null : reader.GetInt32(4);
			UsersId = reader.IsDBNull(5) ? null : reader.GetInt32(5);
			SchadenId = reader.IsDBNull(6) ? null : reader.GetInt32(6);
		}

		#endregion
		//************************************************************************
		#region properties
		[JsonPropertyName("bilder_id")]
		public int? Bilder_Id { get; set; }

		[JsonPropertyName("bild_bytes")]
		public byte[]? BildBytes { get; set; }

		[JsonPropertyName("bild_url")]
		public string? Bild_Url { get; set; }

		[JsonPropertyName("kraftfahrzeug_id")]
		public int? KraftfahrzeugId { get; set; }

		[JsonPropertyName("anhaenger_id")]
		public int? AnhaengerId { get; set; }

		[JsonPropertyName("users_id")]
		public int? UsersId { get; set; }

		[JsonPropertyName("schaden_id")]
		public int? SchadenId { get; set; }



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

			if (this.Bilder_Id.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set bild_bytes = :bbs, bild_url = :url, kraftfahrzeug_id = :kid, anhaenger_id = :aid, users_id = :uid, schaden_id = :sid where bilder_id = :bid";
			}
			else if (this.KraftfahrzeugId.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set bild_bytes = :bbs, bild_url = :url, anhaenger_id = :aid, users_id = :uid, schaden_id = :sid where kraftfahrzeug_id = :kid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.Bilder_Id = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:bid, :bbs, :url, :kid, :aid, :uid, :sid)";
			}

			if(this.Bilder_Id != null)
            {
				command.Parameters.AddWithValue("bid", this.Bilder_Id);
			}
			command.Parameters.AddWithValue("bbs", this.BildBytes == null ? (object)DBNull.Value : this.BildBytes);
			command.Parameters.AddWithValue("url", String.IsNullOrEmpty(this.Bild_Url) ? (object)DBNull.Value : (object)this.Bild_Url);
			command.Parameters.AddWithValue("kid", this.KraftfahrzeugId.HasValue ? (object)this.KraftfahrzeugId.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("aid", this.AnhaengerId.HasValue ? (object)this.AnhaengerId.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("uid", this.UsersId.HasValue ? (object)this.UsersId.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("sid", this.SchadenId.HasValue ? (object)this.SchadenId.Value : (object)DBNull.Value);
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

			command.CommandText = $"update {SCHEMA}.{TABLE} set bild_bytes = :bbs, bild_url = :url, kraftfahrzeug_id = :kid, anhaenger_id = :aid, users_id = :uid, schaden_id = :sid where bilder_id = :bid";
			//WIP: WARNING! Potential security danger! User could change the id to what he wants?!
			command.Parameters.AddWithValue("bid", id);
			command.Parameters.AddWithValue("bbs", this.BildBytes == null ? (object)DBNull.Value : this.BildBytes);
			command.Parameters.AddWithValue("url", String.IsNullOrEmpty(this.Bild_Url) ? (object)DBNull.Value : (object)this.Bild_Url);
			command.Parameters.AddWithValue("kid", this.KraftfahrzeugId.HasValue ? (object)this.KraftfahrzeugId.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("aid", this.AnhaengerId.HasValue ? (object)this.AnhaengerId.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("uid", this.UsersId.HasValue ? (object)this.UsersId.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("sid", this.SchadenId.HasValue ? (object)this.SchadenId.Value : (object)DBNull.Value);

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

