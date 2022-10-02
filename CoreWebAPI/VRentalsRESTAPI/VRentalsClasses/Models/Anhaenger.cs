using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
	public class Anhaenger: ILandfahrzeug, IMietgegenstand
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_anhaenger";
		private const string COLUMNS = "anhaenger_id, aktueller_standort_id, ausgaben_id, schaden_id, art, gegenstandzustand, kategorie, bilder_id, adresse_id, marke, modell, mietpreis, ausgabenstelle_id, kennzeichen";
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

			try
			{
                while (reader.Read())
                {
                    anhaengerListe.Add(anhaenger = new Anhaenger(reader));
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

			return anhaengerListe;
		}

		public static List<Anhaenger> GetAllByAusgabenstelleId(int Ausgabenstelle_Id)
		{
			List<Anhaenger> anhaengerListe = new List<Anhaenger>();
			Anhaenger anhaenger = new Anhaenger();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where ausgabenstelle_id = :asid order by marke";
			command.Parameters.AddWithValue("asid", Ausgabenstelle_Id);
			NpgsqlDataReader reader = command.ExecuteReader();

			try
			{
                while (reader.Read())
                {
                    anhaengerListe.Add(anhaenger = new Anhaenger(reader));
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

			return anhaengerListe;
		}

        public static List<Anhaenger> GetByAusgabenstelleIdAndAvailability(int Ausgabenstelle_Id)
        {
            List<Anhaenger> anhaengerListe = new List<Anhaenger>();
            Anhaenger anhaenger = new Anhaenger();

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }
            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where ausgabenstelle_id = :asid and gegenstandzustand = 0 order by marke";
            command.Parameters.AddWithValue("asid", Ausgabenstelle_Id);
            NpgsqlDataReader reader = command.ExecuteReader();

			try
			{
                while (reader.Read())
                {
                    anhaengerListe.Add(anhaenger = new Anhaenger(reader));
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

            return anhaengerListe;
        }

        public static List<Anhaenger> FilterBy(string by, string value)
        {
            List<Anhaenger> anhaengerList = new List<Anhaenger>();
            Anhaenger? anhaenger = new Anhaenger();
            string Condition = "";

            if (by == "alter")
            {
                int currentYear = DateTime.Now.Year;
                bool success = false;
                int Baujahr = 0;
                success = Int32.TryParse(value, out Baujahr);
                Baujahr = currentYear - Baujahr;
                Condition = $"WHERE baujahr = {Baujahr}";
            }
            else if (by == "klasse")
            {
                Condition = $"WHERE {by} = '{value}'";
            }
            else if (by == "kategorie")
            {
                if (value == "SUV_Gelaendewagen")
                {
                    Condition = $"WHERE {by} = 'SUV/ Geländewagen'";
                }
                else if (value == "Van_Kleinbus")
                {
                    Condition = $"WHERE {by} = 'Van/ Kleinbus'";
                }
                else
                {
                    Condition = $"WHERE {by} = '{value}'";
                }
            }
            else if (by == "ausgabenstelle")
            {
                Condition = $"WHERE ausgabenstelle_id = {value}";
            }
            else if (by == "=" || by == "<" || by == ">" || by == "<=" || by == ">=")
            {
                Condition = $"WHERE mietpreis {by} {value}";
            }
            else
            {
                Condition = $"WHERE {by} = '{value}'";
            }

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }
            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"SELECT {COLUMNS} FROM {SCHEMA}.{TABLE} {Condition} order by marke";
            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                while (reader.Read())
                {
                    anhaengerList.Add(anhaenger = new Anhaenger(reader));
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
            return anhaengerList;
        }

        public static int AddRemoveFromAusgabenstelle(List<int>? listToAdd, List<int>? listToRemove, int ausgabenstelle_id)
		{
			int result = 0;
			NpgsqlCommand command = new NpgsqlCommand();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}

			if (listToAdd != null)
			{
				try
				{
					foreach (int entry in listToAdd)
					{
						command.CommandText = $"update {SCHEMA}.{TABLE} set ausgabenstelle_id = :asid where anhaenger_id = :aid;";
						command.Parameters.AddWithValue("asid", ausgabenstelle_id);
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

			if (listToRemove != null)
			{
				try
				{
					if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
					{
						command.Connection = DBConnection.GetConnection();
						command.Connection.Open();
					}

					foreach (int entry in listToRemove)
					{
						command.CommandText = $"update {SCHEMA}.{TABLE} set ausgabenstelle_id = NULL where anhaenger_id = :aid;";
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
		#endregion
		//************************************************************************
		#region constructors#
		public Anhaenger()
		{

		}

		public Anhaenger(NpgsqlDataReader reader)
		{
			Anhaenger_Id = reader.GetInt32(0);
			AktuellerStandort = reader.IsDBNull(1) ? null : reader.GetInt32(1);
            Ausgaben_Id = reader.IsDBNull(2) ? null : reader.GetInt32(2);
            Schaden_Id = reader.IsDBNull(3) ? null : reader.GetInt32(3);
            Art = reader.IsDBNull(4) ? null : reader.GetString(4);
			GegenstandZustand = reader.IsDBNull(5) ? GegenstandZustandTyp.frei : (GegenstandZustandTyp)reader.GetInt32(5);
			Kategorie = reader.IsDBNull(6) ? null : reader.GetString(6);
			Bilder_Id = reader.IsDBNull(7) ? null : reader.GetInt32(7);
            Adresse_Id = reader.IsDBNull(8) ? null : reader.GetInt32(8);
            Marke = reader.IsDBNull(9) ? null : reader.GetString(9);
			Modell = reader.IsDBNull(10) ? null : reader.GetString(10);
			MietPreis = reader.IsDBNull(11) ? null : reader.GetDouble(11);
			Ausgabenstelle_Id = reader.IsDBNull(12) ? null : reader.GetInt32(12);
			Kennzeichen = reader.IsDBNull(13) ? null : reader.GetString(13);
		}

		#endregion
		//************************************************************************
		#region properties
		[JsonPropertyName("anhaenger_id")]
		public int? Anhaenger_Id { get; set; }

        [JsonPropertyName("aktueller_standort_id")]
        public int? AktuellerStandort { get; set; }

        [JsonPropertyName("ausgaben_id")]
        public int? Ausgaben_Id { get; set; }

        [JsonPropertyName("schaden_id")]
        public int? Schaden_Id { get; set; }

        [JsonPropertyName("art")]
		public string? Art { get; set; } = "Anhänger";

		[JsonPropertyName("gegenstandzustand")]
		public GegenstandZustandTyp GegenstandZustand { get; set; }

		[JsonPropertyName("kategorie")]
		public string? Kategorie { get; set; } = "Anhänger";

        [JsonPropertyName("bilder_id")]
        public int? Bilder_Id { get; set; }

        [JsonPropertyName("adresse_id")]
        public int? Adresse_Id { get; set; }

        [JsonPropertyName("marke")]
		public string? Marke { get; set; }

		[JsonPropertyName("modell")]
		public string? Modell { get; set; }

		[JsonPropertyName("mietpreis")]
		public double? MietPreis { get; set; }

        [JsonPropertyName("ausgabenstelle_id")]
        public int? Ausgabenstelle_Id { get; set; }

        [JsonPropertyName("kennzeichen")]
        public string? Kennzeichen { get; set; }

        [JsonIgnore]
		public List<Bild>? BildListe { get; set; }

        // In welchen Ausgabestellen befindet sich diese Art/ Kategorie von Anhänger?
        [JsonIgnore]
        public List<Adresse>? AdressenListe { get; set; }

        [JsonIgnore]
        public List<Ausgaben>? KostenListe { get; set; }

        [JsonIgnore]
        public List<Schaden>? SchadenListe { get; set; }
		

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
				command.CommandText = $"update {SCHEMA}.{TABLE} set aktueller_standort_id = :akid, ausgaben_id = :agid, schaden_id = :sid, art = :art, gegenstandzustand = :gz, kategorie = :k, bilder_id = :bid, adresse_id = :adid, marke = :ma, modell = :mo, mietpreis = :mp, ausgabenstelle_id = :asid, kennzeichen = :ken where anhaenger_id = :aid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.Anhaenger_Id = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:aid, :akid, :agib, :sid, :art, :gz, :k, :bid, :adid, :ma, :mo, :mp, :asid, :ken)";
			}

			command.Parameters.AddWithValue("aid", this.Anhaenger_Id);
            command.Parameters.AddWithValue("akid", this.AktuellerStandort.HasValue ? (int)this.AktuellerStandort : (object)DBNull.Value);
            command.Parameters.AddWithValue("agid", this.Ausgaben_Id.HasValue ? (int)this.Ausgaben_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("sid", this.Schaden_Id.HasValue ? (int)this.Schaden_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("art", String.IsNullOrEmpty(this.Art) ? (object)DBNull.Value : (object)this.Art);
			command.Parameters.AddWithValue("gz", (int)this.GegenstandZustand);
			command.Parameters.AddWithValue("k", String.IsNullOrEmpty(this.Kategorie) ? (object)DBNull.Value : (object)this.Kategorie);
            command.Parameters.AddWithValue("bid", this.Bilder_Id.HasValue ? (int)this.Bilder_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("adid", this.Adresse_Id.HasValue ? (int)this.Adresse_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("ma", String.IsNullOrEmpty(this.Marke) ? (object)DBNull.Value : (object)this.Marke);
			command.Parameters.AddWithValue("mo", String.IsNullOrEmpty(this.Modell) ? (object)DBNull.Value : (object)this.Modell);
			command.Parameters.AddWithValue("mp", this.MietPreis.HasValue ? (double)this.MietPreis : 9999);
			command.Parameters.AddWithValue("asid", this.Ausgabenstelle_Id.HasValue ? (object)this.Ausgabenstelle_Id.Value : (object)DBNull.Value);
            command.Parameters.AddWithValue("ken", String.IsNullOrEmpty(this.Kennzeichen) ? (object)DBNull.Value : (object)this.Kennzeichen);

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

			command.CommandText = $"update {SCHEMA}.{TABLE} set aktueller_standort_id = :akid, ausgaben_id = :agid, schaden_id = :sid, art = :art, gegenstandzustand = :gz, kategorie = :k, bilder_id = :bid, adresse_id = :adid, marke = :ma, modell = :mo, mietpreis = :mp, ausgabenstelle_id = :asid, kennzeichen = :ken where anhaenger_id = :aid";
            //WIP: WARNING! Potential security danger! User could change the id to what he wants?!
            command.Parameters.AddWithValue("aid", this.Anhaenger_Id);
            command.Parameters.AddWithValue("akid", this.AktuellerStandort.HasValue ? (int)this.AktuellerStandort : (object)DBNull.Value);
            command.Parameters.AddWithValue("agid", this.Ausgaben_Id.HasValue ? (int)this.Ausgaben_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("sid", this.Schaden_Id.HasValue ? (int)this.Schaden_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("art", String.IsNullOrEmpty(this.Art) ? (object)DBNull.Value : (object)this.Art);
            command.Parameters.AddWithValue("gz", (int)this.GegenstandZustand);
            command.Parameters.AddWithValue("k", String.IsNullOrEmpty(this.Kategorie) ? (object)DBNull.Value : (object)this.Kategorie);
            command.Parameters.AddWithValue("bid", this.Bilder_Id.HasValue ? (int)this.Bilder_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("adid", this.Adresse_Id.HasValue ? (int)this.Adresse_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("ma", String.IsNullOrEmpty(this.Marke) ? (object)DBNull.Value : (object)this.Marke);
            command.Parameters.AddWithValue("mo", String.IsNullOrEmpty(this.Modell) ? (object)DBNull.Value : (object)this.Modell);
            command.Parameters.AddWithValue("mp", this.MietPreis.HasValue ? (double)this.MietPreis : 9999);
            command.Parameters.AddWithValue("asid", this.Ausgabenstelle_Id.HasValue ? (object)this.Ausgabenstelle_Id.Value : (object)DBNull.Value);
            command.Parameters.AddWithValue("ken", String.IsNullOrEmpty(this.Kennzeichen) ? (object)DBNull.Value : (object)this.Kennzeichen);

            try
			{
				result = command.ExecuteNonQuery();
				if(result == 1)
				{
                    if (this.BildListe != null && this.BildListe.Count > 0)
                    {
                        int iterator = 0;
                        foreach (Bild bild in this.BildListe)
                        {
                            bild.Bilder_Id = this.Anhaenger_Id;
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
