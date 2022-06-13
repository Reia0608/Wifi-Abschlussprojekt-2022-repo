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
	public class Anhaenger: ILandfahrzeug, IMietgegenstand
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_anhaenger";
		private const string COLUMNS = "anhaenger_id, art, gegenstandzustand, kategorie, marke, modell, mietpreis";
		#endregion

		//************************************************************************
		#region static methods
		// WIP: if anhaenger_id does not exist in the db, creates a new entry with null values!
		public static Anhaenger Get(int anhaenger_id)
		{
			Anhaenger anhaenger = new Anhaenger();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where anhaenger_id = :aid";
			command.Parameters.AddWithValue("aid", anhaenger_id);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					anhaenger = new Anhaenger();
					{
						anhaenger = new Anhaenger(reader);
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

		public static List<Anhaenger> GetList()
		{
			List<Anhaenger> anhaengerListe = new List<Anhaenger>();
			Anhaenger anhaenger = new Anhaenger();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} order by marke";
			NpgsqlDataReader reader = command.ExecuteReader();

			while (reader.Read())
			{
				anhaengerListe.Add(anhaenger = new Anhaenger(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return anhaengerListe;
		}
		#endregion
		//************************************************************************
		#region constructors#
		public Anhaenger()
		{

		}

		public Anhaenger(NpgsqlDataReader reader)
		{
			Anhaenger_Id = reader.GetInt32(0);
			Art = reader.IsDBNull(1) ? null : reader.GetString(1);
			GegenstandZustand = reader.IsDBNull(2) ? GegenstandZustandTyp.frei : (GegenstandZustandTyp)reader.GetInt32(2);
			Kategorie = reader.IsDBNull(3) ? null : reader.GetString(3);
			Marke = reader.IsDBNull(4) ? null : reader.GetString(4);
			Modell = reader.IsDBNull(5) ? null : reader.GetString(5);
			MietPreis = reader.IsDBNull(6) ? null : reader.GetDouble(6);
		}

		#endregion
		//************************************************************************
		#region properties
		[JsonPropertyName("anhaenger_id")]
		public int? Anhaenger_Id { get; set; }
		[JsonPropertyName("art")]
		public string? Art { get; set; } = "Anhänger";
		[JsonPropertyName("gegenstandzustand")]
		public GegenstandZustandTyp GegenstandZustand { get; set; }
		[JsonPropertyName("kategorie")]
		public string? Kategorie { get; set; } = "Anhänger";
		[JsonPropertyName("marke")]
		public string? Marke { get; set; }
		[JsonPropertyName("modell")]
		public string? Modell { get; set; }
		[JsonPropertyName("mietpreis")]
		public double? MietPreis { get; set; }
		[JsonIgnore]
		public List<Bild>? BildListe { get; set; }

        // In welchen Ausgabestellen befindet sich diese Art/ Kategorie von Anhänger?
        public List<Adresse>? AdressenListe { get; set; }
		public int? AktuellerStandort { get; set; }
		public List<Ausgaben>? KostenListe { get; set; }

		public List<Schaden>? SchadenListe { get; set; }
		public int? Ausgabenstelle_Id { get; set; }

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

			if (this.Anhaenger_Id.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set art = :art, gegenstandzustand = :gz, kategorie = :k, marke = :ma, modell = :mo, mietpreis = :mp where anhaenger_id = :aid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.Anhaenger_Id = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:aid, :art, :gz, :k, :ma, :mo, :mp)";
			}

			command.Parameters.AddWithValue("aid", this.Anhaenger_Id);
			command.Parameters.AddWithValue("art", String.IsNullOrEmpty(this.Art) ? (object)DBNull.Value : (object)this.Art);
			command.Parameters.AddWithValue("gz", (int)this.GegenstandZustand);
			command.Parameters.AddWithValue("k", String.IsNullOrEmpty(this.Kategorie) ? (object)DBNull.Value : (object)this.Kategorie);
			command.Parameters.AddWithValue("ma", String.IsNullOrEmpty(this.Marke) ? (object)DBNull.Value : (object)this.Marke);
			command.Parameters.AddWithValue("mo", String.IsNullOrEmpty(this.Modell) ? (object)DBNull.Value : (object)this.Modell);
			command.Parameters.AddWithValue("mp", this.MietPreis.HasValue ? (double)this.MietPreis : 9999);

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

			command.CommandText = $"update {SCHEMA}.{TABLE} set art = :art, gegenstandzustand = :gz, kategorie = :k, marke = :ma, modell = :mo, mietpreis = :mp where anhaenger_id = :aid";
			//WIP: WARNING! Potential security danger! User could change the id to what he wants?!
			command.Parameters.AddWithValue("aid", id);
			command.Parameters.AddWithValue("art", String.IsNullOrEmpty(this.Art) ? (object)DBNull.Value : (object)this.Art);
			command.Parameters.AddWithValue("gz", (int)this.GegenstandZustand);
			command.Parameters.AddWithValue("k", String.IsNullOrEmpty(this.Kategorie) ? (object)DBNull.Value : (object)this.Kategorie);
			command.Parameters.AddWithValue("ma", String.IsNullOrEmpty(this.Marke) ? (object)DBNull.Value : (object)this.Marke);
			command.Parameters.AddWithValue("mo", String.IsNullOrEmpty(this.Modell) ? (object)DBNull.Value : (object)this.Modell);
			command.Parameters.AddWithValue("mp", this.MietPreis.HasValue ? (double)this.MietPreis : 9999);

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
			command.CommandText = $"delete from {SCHEMA}.{TABLE} where anhaenger_id = :aid";
			command.Parameters.AddWithValue("aid", this.Anhaenger_Id);
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

		public static int Delete(List<int> listToDelete)
		{
			int result = 0;
			NpgsqlCommand command = new NpgsqlCommand();

			if(listToDelete != null)
            {
				try
				{
					if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
					{
						command.Connection = DBConnection.GetConnection();
						command.Connection.Open();
					}

					foreach (int entry in listToDelete)
					{
						command.CommandText = $"delete from {SCHEMA}.{TABLE} where anhaenger_id = :aid;";
						command.Parameters.AddWithValue("aid", entry);
						try
						{
							result += command.ExecuteNonQuery();
							command.Parameters.Clear();
						}
						catch (Exception ex)
						{
							Console.WriteLine(ex.Message);
						}
					}
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
				}
				finally
				{
					command.Connection.Close();
				}
			}
			
			return result;
		}

		//public override string ToString()
		//{
		//	return this.Art;
		//}

		//public override int GetHashCode()
		//{
		//	int result = 0;
		//	//result ^= this.Nummer.GetHashCode();
		//	result ^= this.Art.GetHashCode();
		//	//result ^= this.Beschreibung.GetHashCode();

		//	return result;
		//}

		public void Refresh()
		{
			//this.BewegungList = Bewegung.GetList(this);
		}

		#endregion
	}
}
