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
    public class Kraftfahrzeug: ILandfahrzeug, IMietgegenstand
    {
        //************************************************************************
        #region constants
        private const string SCHEMA = "rentals";
        private const string TABLE = "tbl_kraftfahrzeuge";
		private const string BILDER = "tbl_bilder";
        private const string COLUMNS = "kraftfahrzeuge_id, mietpreis, gegenstandzustand, kategorie, marke, modell, bilder_id";
        #endregion

        //************************************************************************
        #region static methods

        public static Kraftfahrzeug Get(int kraftfahrzeug_id)
        {
			Kraftfahrzeug kraftfahrzeug = new Kraftfahrzeug();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where kraftfahrzeuge_id = :kid";
            command.Parameters.AddWithValue("kid", kraftfahrzeug_id);
            NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					kraftfahrzeug = new Kraftfahrzeug();
					{
						kraftfahrzeug = kraftfahrzeug.CreateKraftfahrzeug(reader);
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
            return kraftfahrzeug;
        }

        public static List<Kraftfahrzeug> GetList()
        {
			List<Kraftfahrzeug> kraftfahrzeugListe = new List<Kraftfahrzeug>();
			Kraftfahrzeug kraftfahrzeug = new Kraftfahrzeug();

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
				kraftfahrzeugListe.Add(kraftfahrzeug = kraftfahrzeug.CreateKraftfahrzeug(reader));	
            }
            reader.Close();
            DBConnection.GetConnection().Close();
            return kraftfahrzeugListe;
        }
		#endregion
		//************************************************************************
		#region constructors#
		public Kraftfahrzeug()
		{

		}

		public Kraftfahrzeug(NpgsqlDataReader reader)
		{
			KraftfahrzeugId = reader.GetInt32(0);
			MietPreis = reader.IsDBNull(1) ? null : reader.GetInt32(1);
			GegenstandZustand = reader.IsDBNull(2) ? GegenstandZustandTyp.frei : (GegenstandZustandTyp)reader.GetInt32(2);
			Kategorie = reader.IsDBNull(3) ? null : reader.GetString(3);
			//SchadenListe = reader.IsDBNull(5) ? null : reader.GetString(5);
			//BildBytesList = reader.IsDBNull(6) ? RollenTyp.Kunde : (RollenTyp)reader.GetInt32(6);
			//BildVorhanden = reader.IsDBNull(4) ? null : reader.GetBool(4);
			//AdressenList = reader.IsDBNull(8) ? null : reader.GetString(8);
			//AktuellerStandort = reader.IsDBNull(9) ? null : (DateTime?)reader.GetDateTime(9);
			Marke = reader.IsDBNull(4) ? null : reader.GetString(4);
			Modell = reader.IsDBNull(5) ? null : reader.GetString(5);
			Bilder_Id = reader.IsDBNull(6) ? null : (int?)reader.GetInt32(6);
		}

		#endregion
		//************************************************************************
		#region properties
		[JsonPropertyName("kraftfahrzeugid")]
		public int? KraftfahrzeugId { get; set; }

		[JsonPropertyName("mietpreis")]
		public double? MietPreis { get; set; }

		[JsonPropertyName("gegenstandzustand")]
		public GegenstandZustandTyp GegenstandZustand { get; set; } = GegenstandZustandTyp.frei;

		[JsonPropertyName("kategorie")]
		public string? Kategorie { get; set; }

		[JsonPropertyName("kostenliste")]
		public List<Ausgaben>? KostenListe { get; set; }

		[JsonPropertyName("schadenliste")]
		public List<Schaden>? SchadenListe { get; set; }
		[JsonPropertyName("bilder_id")]
		public int? Bilder_Id { get; set; }

		[JsonIgnore()]
		public List<byte[]>? BildBytesList { get; set; }

		[JsonIgnore()]
		public bool BildVorhanden
		{
			get
			{
				return BildBytesList != null && BildBytesList[0].Length > 0;
			}
			set
			{
				bool x = value;
			}
		}

		public List<Adresse>? AdressenList { get; set; }
		public IAdresse? AktuellerStandort { get; set; }
		[JsonPropertyName("marke")]
		public string? Marke { get; set; }
		[JsonPropertyName("modell")]
		public string? Modell { get; set; }

		#endregion

		//************************************************************************
		#region public methods

		public Kraftfahrzeug CreateKraftfahrzeug(NpgsqlDataReader reader)
		{
			Kraftfahrzeug kraftfahrzeug = new Kraftfahrzeug();

			kraftfahrzeug = new Kraftfahrzeug()
			{
				KraftfahrzeugId = reader.GetInt32(0),
				MietPreis = reader.IsDBNull(1) ? null : reader.GetDouble(1),
				GegenstandZustand = reader.IsDBNull(2) ? GegenstandZustandTyp.frei : (GegenstandZustandTyp)reader.GetInt32(2),
				Kategorie = reader.IsDBNull(3) ? null : reader.GetString(3),
				Marke = reader.IsDBNull(4) ? null : reader.GetString(4),
				Modell = reader.IsDBNull(5) ? null : reader.GetString(5),
				Bilder_Id = reader.IsDBNull(6) ? null : reader.GetInt32(6),
			};
			return kraftfahrzeug;
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

			if (this.KraftfahrzeugId.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set mietpreis = :mp, gegenstandzustand = :gz, kategorie = :k, marke = :ma, modell = :mo, bilder_id = :bil where kraftfahrzeuge_id = :kid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.KraftfahrzeugId = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:kid, :mp, :gz, :k, :ma, :mo)";
			}

			command.Parameters.AddWithValue("kid", this.KraftfahrzeugId);
			command.Parameters.AddWithValue("mp", this.MietPreis.HasValue ? (double)this.MietPreis : 9999);
			command.Parameters.AddWithValue("gz", (int)this.GegenstandZustand);
			command.Parameters.AddWithValue("k", String.IsNullOrEmpty(this.Kategorie) ? (object)DBNull.Value : (object)this.Kategorie);
			command.Parameters.AddWithValue("ma", String.IsNullOrEmpty(this.Marke) ? (object)DBNull.Value : (object)this.Marke);
			command.Parameters.AddWithValue("mo", String.IsNullOrEmpty(this.Modell) ? (object)DBNull.Value : (object)this.Modell);
			command.Parameters.AddWithValue("bil", this.Bilder_Id.HasValue ? (int)this.Bilder_Id : null);

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

			command.CommandText = $"update {SCHEMA}.{TABLE} set mietpreis = :mp, gegenstandzustand = :gz, kategorie = :k, marke = :ma, modell = :mo, bilder_id = :bil where kraftfahrzeuge_id = :kid";
			//WIP: WARNING! Potential security danger! User could change the id to what he wants?!
			command.Parameters.AddWithValue("kid", id);
			command.Parameters.AddWithValue("mp", this.MietPreis.HasValue ? (double)this.MietPreis : 9999);
			command.Parameters.AddWithValue("gz", (int)this.GegenstandZustand);
			command.Parameters.AddWithValue("k", String.IsNullOrEmpty(this.Kategorie) ? (object)DBNull.Value : (object)this.Kategorie);
			command.Parameters.AddWithValue("ma", String.IsNullOrEmpty(this.Marke) ? (object)DBNull.Value : (object)this.Marke);
			command.Parameters.AddWithValue("mo", String.IsNullOrEmpty(this.Modell) ? (object)DBNull.Value : (object)this.Modell);
			command.Parameters.AddWithValue("bil", this.Bilder_Id.HasValue ? (int)this.Bilder_Id : null);

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
			command.CommandText = $"delete from {SCHEMA}.{TABLE} where kraftfahrzeuge_id = :kid";
			command.Parameters.AddWithValue("kid", this.KraftfahrzeugId);
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
