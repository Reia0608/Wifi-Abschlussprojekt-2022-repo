using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;
using Google.Cloud.Firestore;
using System.Diagnostics;

namespace VRentalsClasses.Models
{
    public class Kraftfahrzeug: ILandfahrzeug, IMietgegenstand
    {
        //************************************************************************
        #region constants
        private const string SCHEMA = "rentals";
        private const string TABLE_KFZ = "tbl_kraftfahrzeug";
		private const string TABLE_BILDER = "tbl_bilder";
		private const string COLUMNS_BILDER = "bilder_id, bild_bytes, bild_url, kraftfahrzeug_id, anhaenger_id, users_id, schaden_id";
		private const string COLUMNS_KFZ = "kraftfahrzeug_id, mietpreis, gegenstandzustand, kategorie, marke, modell, ausgabenstelle_id, aktueller_standort_id, kennzeichen";
		#endregion

		//************************************************************************
		#region static methods
		public static void Truncate(Kraftfahrzeug kraftfahrzeug)
		{
			NpgsqlCommand command = new NpgsqlCommand();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}
			command.CommandText = $"delete from {SCHEMA}.{TABLE_KFZ} where kraftfahrzeug_id = :kid";
			command.Parameters.AddWithValue("kid", kraftfahrzeug.KraftfahrzeugId);
			try
            {
				command.ExecuteNonQuery();
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

		public static Kraftfahrzeug Get(int kraftfahrzeug_id)
        {
			Kraftfahrzeug kraftfahrzeug = null;

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS_KFZ} from {SCHEMA}.{TABLE_KFZ} where kraftfahrzeug_id = :kid";
            command.Parameters.AddWithValue("kid", kraftfahrzeug_id);
            NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					kraftfahrzeug = new Kraftfahrzeug();
					{
						kraftfahrzeug = new Kraftfahrzeug(reader);
					};
				}
			}
			catch (Exception ex)
			{
				Debug.WriteLine(ex.Message);
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
            command.CommandText = $"select {COLUMNS_KFZ} from {SCHEMA}.{TABLE_KFZ} order by marke";
            NpgsqlDataReader reader = command.ExecuteReader();
            
            while (reader.Read())
            {
				kraftfahrzeugListe.Add(kraftfahrzeug = new Kraftfahrzeug(reader));	
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
			MietPreis = reader.IsDBNull(1) ? null : reader.GetDouble(1);
			GegenstandZustand = reader.IsDBNull(2) ? GegenstandZustandTyp.frei : (GegenstandZustandTyp)reader.GetInt32(2);
			Kategorie = reader.IsDBNull(3) ? null : reader.GetString(3);
			Marke = reader.IsDBNull(4) ? null : reader.GetString(4);
			Modell = reader.IsDBNull(5) ? null : reader.GetString(5);
			Ausgabenstelle_Id = reader.IsDBNull(6) ? null: reader.GetInt32(6);
			AktuellerStandort = reader.IsDBNull(7) ? null : reader.GetInt32(7);
			Kennzeichen = reader.IsDBNull(8) ? null : reader.GetString(8);
		}

		#endregion
		//************************************************************************
		#region properties
		[JsonPropertyName("kraftfahrzeug_id")]
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

		[JsonPropertyName("bildliste")]
		public List<Bild>? BildListe { get; set; }

		[JsonPropertyName("adressenlist")]
		public List<Adresse>? AdressenListe { get; set; }

		[JsonPropertyName("aktuellerstandort")]
		public int? AktuellerStandort { get; set; }

		[JsonPropertyName("marke")]
		public string? Marke { get; set; }

		[JsonPropertyName("modell")]
		public string? Modell { get; set; }

		[JsonPropertyName("ausgabenstelle_id")]
		public int? Ausgabenstelle_Id{ get; set; }

		[JsonPropertyName("kennzeichen")]
		public string? Kennzeichen { get; set; }

		#endregion

		//************************************************************************
		#region public methods

		public int Save()
		{
			int result = -1;
			NpgsqlCommand command = new NpgsqlCommand();
			System.Data.ConnectionState x = DBConnection.GetConnection().FullState;


			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}

			if (this.KraftfahrzeugId.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE_KFZ} set mietpreis = :mp, gegenstandzustand = :gz, kategorie = :k, marke = :ma, modell = :mo, ausgabenstelle_id = :asid, aktueller_standort_id = :aso, kennzeichen = :ken where kraftfahrzeug_id = :kid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE_KFZ}_seq')";
				this.KraftfahrzeugId = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE_KFZ} ({COLUMNS_KFZ}) values (:kid, :mp, :gz, :k, :ma, :mo, :asid, :aso, :ken)";
			}

			command.Parameters.AddWithValue("kid", this.KraftfahrzeugId);
			command.Parameters.AddWithValue("mp", this.MietPreis.HasValue ? (double)this.MietPreis : 9999);
			command.Parameters.AddWithValue("gz", (int)this.GegenstandZustand);
			command.Parameters.AddWithValue("k", String.IsNullOrEmpty(this.Kategorie) ? (object)DBNull.Value : (object)this.Kategorie);
			command.Parameters.AddWithValue("ma", String.IsNullOrEmpty(this.Marke) ? (object)DBNull.Value : (object)this.Marke);
			command.Parameters.AddWithValue("mo", String.IsNullOrEmpty(this.Modell) ? (object)DBNull.Value : (object)this.Modell);
			command.Parameters.AddWithValue("asid", this.Ausgabenstelle_Id.HasValue ? (int)this.Ausgabenstelle_Id : (object)DBNull.Value);
			command.Parameters.AddWithValue("aso", this.AktuellerStandort.HasValue ? (int)this.AktuellerStandort : (object)DBNull.Value);
			command.Parameters.AddWithValue("ken", String.IsNullOrEmpty(this.Kennzeichen) ? (object)DBNull.Value : (object)this.Kennzeichen);

			try
			{
				result = command.ExecuteNonQuery();
				if (result == 1)
				{
					if (this.KostenListe != null && this.KostenListe.Count > 0)
					{
						int iterator = 0;
						foreach (Ausgaben ausgaben in this.KostenListe)
						{
							ausgaben.Ausgaben_Id = this.KraftfahrzeugId;
							iterator += ausgaben.Save();
						}

						if (iterator == this.KostenListe.Count)
						{
							result = 1;
						}
						else
						{
							result = -2;
						}
					}

					if (this.SchadenListe != null && this.SchadenListe.Count > 0)
					{
						int iterator = 0;
						foreach (Schaden schaden in this.SchadenListe)
						{
							schaden.Schaden_Id = this.KraftfahrzeugId;
							iterator += schaden.Save();
						}

						if (iterator == this.SchadenListe.Count)
						{
							result = 1;
						}
						else
						{
							result = -3;
						}
					}

					if (this.BildListe != null && this.BildListe.Count > 0)
					{
						int iterator = 0;
						foreach (Bild bild in this.BildListe)
						{
							bild.Bilder_Id = this.KraftfahrzeugId;
							iterator += bild.Save();
						}

						if (iterator == this.BildListe.Count)
						{
							result = 1;
						}
						else
						{
							result = -4;
						}
					}

					if (this.AdressenListe != null && this.AdressenListe.Count > 0)
					{
						int iterator = 0;
						foreach (Adresse adresse in this.AdressenListe)
						{
							adresse.Adresse_Id = this.KraftfahrzeugId;
							iterator += adresse.Save();
						}

						if (iterator == this.AdressenListe.Count)
						{
							result = 1;
						}
						else
						{
							result = -5;
						}
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

			command.CommandText = $"update {SCHEMA}.{TABLE_KFZ} set mietpreis = :mp, gegenstandzustand = :gz, kategorie = :k, marke = :ma, modell = :mo, ausgabenstelle_id = :asid, aktueller_standort_id = :aso, kennzeichen = :ken where kraftfahrzeug_id = :kid";
			//WIP: WARNING! Potential security danger! User could change the id to what he wants?!
			command.Parameters.AddWithValue("kid", id);
			command.Parameters.AddWithValue("mp", this.MietPreis.HasValue ? (double)this.MietPreis : 9999);
			command.Parameters.AddWithValue("gz", (int)this.GegenstandZustand);
			command.Parameters.AddWithValue("k", String.IsNullOrEmpty(this.Kategorie) ? (object)DBNull.Value : (object)this.Kategorie);
			command.Parameters.AddWithValue("ma", String.IsNullOrEmpty(this.Marke) ? (object)DBNull.Value : (object)this.Marke);
			command.Parameters.AddWithValue("mo", String.IsNullOrEmpty(this.Modell) ? (object)DBNull.Value : (object)this.Modell);
			command.Parameters.AddWithValue("asid", this.Ausgabenstelle_Id.HasValue ? (int)this.Ausgabenstelle_Id : (object)DBNull.Value);
			command.Parameters.AddWithValue("aso", this.AktuellerStandort.HasValue ? (int)this.AktuellerStandort : (object)DBNull.Value);
			command.Parameters.AddWithValue("ken", String.IsNullOrEmpty(this.Kennzeichen) ? (object)DBNull.Value : (object)this.Kennzeichen);

			try
			{
				result = command.ExecuteNonQuery();
				if (result == 1)
				{
					if (this.KostenListe != null && this.KostenListe.Count > 0)
					{
						int iterator = 0;
						foreach (Ausgaben ausgaben in this.KostenListe)
						{
							ausgaben.Ausgaben_Id = this.KraftfahrzeugId;
							iterator += ausgaben.Save();
						}

						if (iterator == this.KostenListe.Count)
						{
							result = 1;
						}
						else
						{
							result = -2; 
						}
					}

					if (this.SchadenListe != null && this.SchadenListe.Count > 0)
					{
						int iterator = 0;
						foreach (Schaden schaden in this.SchadenListe)
						{
							schaden.Schaden_Id = this.KraftfahrzeugId;
							iterator += schaden.Save();
						}

						if (iterator == this.SchadenListe.Count)
						{
							result = 1;
						}
						else
						{
							result = -3;
						}
					}

					if (this.BildListe != null && this.BildListe.Count > 0)
					{
						int iterator = 0;
						foreach (Bild bild in this.BildListe)
						{
							bild.Bilder_Id = this.KraftfahrzeugId;
							iterator += bild.Save();
						}

						if (iterator == this.BildListe.Count)
						{
							result = 1;
						}
						else
						{
							result = -4;
						}
					}

					if (this.AdressenListe != null && this.AdressenListe.Count > 0)
					{
						int iterator = 0;
						foreach (Adresse adresse in this.AdressenListe)
						{
							adresse.Adresse_Id = this.KraftfahrzeugId;
							iterator += adresse.Save();
						}

						if (iterator == this.AdressenListe.Count)
						{
							result = 1;
						}
						else
						{
							result = -5;
						}
					}

					//if (this.KraftfahrzeugList != null && this.KraftfahrzeugList.Count > 0)
					//{
					//	int iterator = 0;
					//	//Kraftfahrzeug.Truncate();
					//	foreach (Kraftfahrzeug kraftfahrzeug in this.KraftfahrzeugList)
					//	{
					//		kraftfahrzeug.Ausgabenstelle_Id = this.Ausgabenstelle_Id;
					//		iterator += kraftfahrzeug.Save();
					//	}
					//}
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
			command.CommandText = $"delete from {SCHEMA}.{TABLE_KFZ} where kraftfahrzeug_id = :kid";
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
