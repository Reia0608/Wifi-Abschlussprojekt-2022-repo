using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using VRentalsClasses.Interfaces;
using System.Diagnostics;

namespace VRentalsClasses.Models
{
    public class Benutzer: IPerson, ILoginData, IFahrer
    {
        //************************************************************************
        #region constants
        private const string SCHEMA = "rentals";
        private const string TABLE = "tbl_users";
		private const string TABLE_BILDER = "tbl_bilder";
		private const string TABLE_FUEHRERSCHEINKLASSE = "tbl_fsk";
		private const string COLUMNS_FUEHRERSCHEINKLASSE = "users_id, am, a1, a2, a, b1, b, c1, c, d1, d, be, c1e, ce, d1e, de, f";
		//                                 0        1      2           3           4              5          6       7          8             9        10                   11                  12               
        private const string COLUMNS = "users_id, vorname, nachname, geschlecht, username, passwort, rolle, geburtsdatum, geburtsort," +
			" registrierungstag, letzteanmeldung, benutzermerkmal, merkmalgiltbis, kundennummer, istfahrer, status, fuehrerscheinausstellungsdatum, fuehrerscheinablaufdatum, fuehrerscheinnummer, hatzugfahrzeug, eigeneszugfahrzeugmarke, eigeneszugfahrzeugmodell, eigeneszugfahrzeugkennzeichen, mietpreis";
		private const string KONTAKT = "tbl_kontakt";
		#endregion
		
		//************************************************************************
		#region static methods

		public static Benutzer Get(ControllerBase controller)
		{
			Benutzer benutzer = new Benutzer();
			string bm = controller.Request.Cookies["benutzermerkmal"];
			if (!String.IsNullOrEmpty(bm))
			{
				if(DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
                {
					DBConnection.GetConnection().Open();
				}
				NpgsqlCommand command = new NpgsqlCommand();
				command.Connection = DBConnection.GetConnection();
				command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where benutzermerkmal = :bm";
				command.Parameters.AddWithValue("bm", bm);
				NpgsqlDataReader reader = command.ExecuteReader();
                try
                {
					reader.Read();
					benutzer = new Benutzer(reader);
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
			return benutzer;
		}

		public static Benutzer Get(int id)
		{
			Benutzer benutzer = new Benutzer();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where users_id = :uid";
			command.Parameters.AddWithValue("uid", id);

			NpgsqlDataReader reader = command.ExecuteReader();

			try
			{
				reader.Read();
				benutzer = new Benutzer(reader);
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
			return benutzer;
		}

        public static int? GetId(string BenutzerMerkmal)
        {
			Benutzer benutzer = new Benutzer();
			int? Id = null;
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where benutzermerkmal = :bm";
            command.Parameters.AddWithValue("bm", BenutzerMerkmal);

            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
				if(reader.HasRows)
				{
                    reader.Read();
                    benutzer = new Benutzer(reader);
                    Id = benutzer.UserId;
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
            return Id;
        }

        public static Benutzer Get(string benutzermerkmal)
		{
			Benutzer benutzer = new Benutzer();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			int tmpId = 0;
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where ";
			if(int.TryParse(benutzermerkmal, out tmpId))
            {
				command.CommandText += "users_id = :pid";
				command.Parameters.AddWithValue("pid", tmpId);
            }
            else
            {
				command.CommandText += "benutzermerkmal = :bm";
				command.Parameters.AddWithValue("bm", benutzermerkmal);
            }
			NpgsqlDataReader reader = command.ExecuteReader();
			
			try
            {
				reader.Read();
				benutzer = new Benutzer(reader);	
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
			return benutzer;
		}

		public static List<Benutzer> SearchList(string suchbegriff)
        {
			List<Benutzer> benutzerList = new List<Benutzer>();
			Benutzer benutzer = new Benutzer();
			string where = $"WHERE ";
			string orderBy = $"ORDER BY vorname";
			// WIP GeschlechtsTyp geschlecht = null;
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			where +=  " vorname LIKE '" + suchbegriff + "'"
				+ " OR nachname LIKE '" + suchbegriff + "'"
				//+ " OR geburtsdatum  = CAST('" + suchbegriff + "' AS DATE) "
				+ " OR geburtsort LIKE '" + suchbegriff + "'"
				+ " OR username LIKE '" + suchbegriff + "'"
				//+ " OR registrierungstag = CAST('" + suchbegriff + "' AS DATE)"
				//+ " OR letzteanmeldung = CAST('" + suchbegriff + "' AS DATE)"
				// WIP geschlecht
				// WIP rolle
				+ " OR (tbl_kontakt.kategorie LIKE '" + suchbegriff + "' AND tbl_kontakt.kontakt_id = tbl_users.users_id) "
				+ " OR (tbl_kontakt.wert LIKE '" + suchbegriff + "' AND tbl_kontakt.kontakt_id = tbl_users.users_id) ";

			command.CommandText = $"SELECT {COLUMNS} FROM {SCHEMA}.{TABLE}, {SCHEMA}.{KONTAKT} {where} {orderBy}";
			NpgsqlDataReader reader = command.ExecuteReader();
			try
            {
				while (reader.Read())
				{
					benutzerList.Add(benutzer = new Benutzer(reader));
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
			return benutzerList;
        }

		public static Benutzer Get(string userName, string pwd)
		{
			Benutzer benutzer = new Benutzer();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			
			try
			{
				command.CommandText = $"select count(*) from {SCHEMA}.{TABLE} where lower(username) = :username";
				command.Parameters.AddWithValue("username", userName.ToLower());
				long result = (long)command.ExecuteScalar();
				if (result == 0)
				{
					benutzer = null;
					throw new Exception($"Benutzer <{userName}> unbekannt!");
				} 
				else
				{
					command.Parameters.Clear();
					command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where lower(username) = :username";
					command.Parameters.AddWithValue("username", userName);
					NpgsqlDataReader reader = command.ExecuteReader();
					try
					{
                        reader.Read();
                        benutzer = new Benutzer(reader);
                        if (benutzer.PasswortHash != benutzer.GetPasswordHash(pwd))
                        {
                            benutzer = null;
                            throw new Exception("Passwort stimmt nicht überein!");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
					finally
					{
                        reader.Close();
                    }
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
			}
			finally
			{
				DBConnection.GetConnection().Close();
			}
			return benutzer;
		}

		public static List<Benutzer> GetList()
		{
			List<Benutzer> benutzerList = new List<Benutzer>();
			Benutzer? benutzer = new Benutzer();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} order by vorname, vorname";
			NpgsqlDataReader reader = command.ExecuteReader();

			try
            {
				while(reader.Read())
                {
					benutzerList.Add(benutzer = new Benutzer(reader));
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
			return benutzerList;
		}

        public static List<Benutzer> GetAvailableDrivers()
        {
            List<Benutzer> benutzerList = new List<Benutzer>();
            Benutzer? benutzer = new Benutzer();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }
            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"SELECT {COLUMNS} FROM {SCHEMA}.{TABLE} WHERE rolle = 2 AND istfahrer = true AND status = 1 order by nachname";
            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                while (reader.Read())
                {
                    benutzerList.Add(benutzer = new Benutzer(reader));
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
            return benutzerList;
        }

        public static List<Benutzer> GetList(int rolle)
		{
			List<Benutzer> benutzerList = new List<Benutzer>();
			Benutzer? benutzer = new Benutzer();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where rolle = :rl order by vorname, vorname";
			command.Parameters.AddWithValue("rl", rolle);
			NpgsqlDataReader reader = command.ExecuteReader();

			try
			{
				while (reader.Read())
				{
					benutzerList.Add(benutzer = new Benutzer(reader));
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
			return benutzerList;
		}

		public static bool CheckBenutzer(string toCheck)
        {
			bool result = false;
			decimal? test = -1;

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where benutzermerkmal = :bm";
            command.Parameters.AddWithValue("bm", toCheck);

			Benutzer benutzer = new Benutzer();

			try
            {
				test = (decimal)command.ExecuteScalar();

				if ( test >= 0)
                {
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                DBConnection.GetConnection().Close();
            }
            return result;
		}

		public static int UpdateFSK(int? UserId, List<bool?> ListToUpdate)
		{
			int result = -1;
			int? Fsk_Id = null;

			BenutzerFuehrerschein benutzerFuehrerschein = new BenutzerFuehrerschein();
			NpgsqlCommand command = new NpgsqlCommand();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}

			command.CommandText = $"select * from {SCHEMA}.{TABLE_FUEHRERSCHEINKLASSE} where users_id = :pid";
			command.Parameters.AddWithValue("pid", UserId);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				reader.Read();

				if(reader.HasRows)
                {
					reader.Close();
					command.Parameters.Clear();
					command.CommandText = $"update {SCHEMA}.{TABLE_FUEHRERSCHEINKLASSE} set am = :am, a1 = :a1, a2 = :a2, a = :a, b1 = :b1, b = :b, c1 = :c1, c = :c, d1 = :d1, d = :d, be = :be, c1e = :c1e, ce = :ce, d1e = :d1e, de = :de, f = :f where users_id = :uid";
				}
				else
                {
					reader.Close();
					command.Parameters.Clear();
					command.CommandText = $"insert into {SCHEMA}.{TABLE_FUEHRERSCHEINKLASSE} ({COLUMNS_FUEHRERSCHEINKLASSE}) values (:uid, :am, :a1, :a2, :a, :b1, :b, :c1, :c, :d1, :d, :be, :c1e, :ce, :d1e, :de, :f)";
				}
			}
			catch (Exception ex)
			{
				// WIP: need to keep an eye on this and see if it actually works as intended.
                command.Connection.Close();
                Console.WriteLine(ex.Message);
			}

			command.Parameters.AddWithValue("uid", UserId);
			command.Parameters.AddWithValue("am", !ListToUpdate[0].HasValue ? false : ListToUpdate[0]);
			command.Parameters.AddWithValue("a1", !ListToUpdate[1].HasValue ? false : ListToUpdate[1]);
			command.Parameters.AddWithValue("a2", !ListToUpdate[2].HasValue ? false : ListToUpdate[2]);
			command.Parameters.AddWithValue("a", !ListToUpdate[3].HasValue ? false : ListToUpdate[3]);
			command.Parameters.AddWithValue("b1", !ListToUpdate[4].HasValue ? false : ListToUpdate[4]);
			command.Parameters.AddWithValue("b", !ListToUpdate[5].HasValue ? false : ListToUpdate[5]);
			command.Parameters.AddWithValue("c1", !ListToUpdate[6].HasValue ? false : ListToUpdate[6]);
			command.Parameters.AddWithValue("c", !ListToUpdate[7].HasValue ? false : ListToUpdate[7]);
			command.Parameters.AddWithValue("d1", !ListToUpdate[8].HasValue ? false : ListToUpdate[8]);
			command.Parameters.AddWithValue("d", !ListToUpdate[9].HasValue ? false : ListToUpdate[9]);
			command.Parameters.AddWithValue("be", !ListToUpdate[10].HasValue ? false : ListToUpdate[10]);
			command.Parameters.AddWithValue("c1e", !ListToUpdate[11].HasValue ? false : ListToUpdate[11]);
			command.Parameters.AddWithValue("ce", !ListToUpdate[12].HasValue ? false : ListToUpdate[12]);
			command.Parameters.AddWithValue("d1e", !ListToUpdate[13].HasValue ? false : ListToUpdate[13]);
			command.Parameters.AddWithValue("de", !ListToUpdate[14].HasValue ? false : ListToUpdate[14]);
			command.Parameters.AddWithValue("f", !ListToUpdate[15].HasValue ? false : ListToUpdate[15]);

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

		//************************************************************************
		#region constructors
		public Benutzer()
		{
            Rolle = RollenTyp.Unbekannt;
        }

		public Benutzer(NpgsqlDataReader reader)
		{
			UserId = reader.GetInt32(0);
			Vorname = reader.IsDBNull(1) ? null : reader.GetString(1);
			Nachname = reader.IsDBNull(2) ? null : reader.GetString(2);
			Geschlecht = reader.IsDBNull(3) ? GeschlechtsTyp.unbekannt : (GeschlechtsTyp)reader.GetInt32(3);
			UserName = reader.IsDBNull(4) ? null : reader.GetString(4);
			PasswortHash = reader.IsDBNull(5) ? null : reader.GetString(5);
			Rolle = reader.IsDBNull(6) ? RollenTyp.Unbekannt : (RollenTyp)reader.GetInt32(6);
			Geburtsdatum = reader.IsDBNull(7) ? null : (DateTime?)reader.GetDateTime(7);
			GeburtsOrt = reader.IsDBNull(8) ? null : reader.GetString(8);
			//KontaktListe = reader.IsDBNull(10) ? null : reader.GetInt32(10),
			RegistrierungsTag = reader.IsDBNull(9) ? null : (DateTime?)reader.GetDateTime(9);
			LetzteAnmeldung = reader.IsDBNull(10) ? null : (DateTime?)reader.GetDateTime(10);
			BenutzerMerkmal = reader.IsDBNull(11) ? null : reader.GetString(11);
			MerkmalGiltBis = reader.IsDBNull(12) ? null : reader.GetDateTime(12);
			KundenNummer = reader.IsDBNull(13) ? null : reader.GetInt32(13);
			IstFahrer = reader.IsDBNull(14) ? false : reader.GetBoolean(14);
			Status = reader.IsDBNull(15) ? FahrerStatus.unbekannt : (FahrerStatus)reader.GetInt32(15); 
			FuehrerscheinAusstellungsDatum = reader.IsDBNull(16) ? null : (DateTime?)reader.GetDateTime(16);
			FuehrerscheinAblaufDatum = reader.IsDBNull(17) ? null : (DateTime?)reader.GetDateTime(17);
			FuehrerscheinNummer = reader.IsDBNull(18) ? null : reader.GetString(18);
			HatEigenesZugfahrzeug = reader.IsDBNull(19) ? false : reader.GetBoolean(19);
			EigenesZugfahrzeugMarke = reader.IsDBNull(20) ? null : reader.GetString(20);
			EigenesZugfahrzeugModell = reader.IsDBNull(21) ? null : reader.GetString(21);
			EigenesZugfahrzeugKennzeichen = reader.IsDBNull(22) ? null : reader.GetString(22);
            MietPreis = reader.IsDBNull(23) ? null : reader.GetDouble(23);
        }
		 
		#endregion
		//************************************************************************
		#region properties
		[JsonPropertyName("userid")]
		public int? UserId { get; set; }

		[JsonPropertyName("vorname")]
        public string? Vorname { get; set; }

        [JsonPropertyName("nachname")]
        public string? Nachname { get; set; }

        [JsonPropertyName("geschlecht")]
        public GeschlechtsTyp Geschlecht { get; set; }

        [JsonPropertyName("geburtsdatum")]
        public DateTime? Geburtsdatum { get; set; }

        [JsonPropertyName("geburtsort")]
        public string? GeburtsOrt { get; set; }

        [JsonPropertyName("username")]
        public string? UserName { get; set; }

        [JsonPropertyName("passwort")]
        public string? Passwort { get; set; }
		
		[JsonIgnore()]
		public string? PasswortHash { get; set; }

		[JsonPropertyName("rolle")]
        public RollenTyp Rolle { get; set; }

        [JsonPropertyName("kontaktliste")]
        public List<Kontakt>? KontaktListe { get; set; }

        [JsonPropertyName("registrierungstag")]
        public DateTime? RegistrierungsTag { get; set; }

        [JsonPropertyName("letzteanmeldung")]
        public DateTime? LetzteAnmeldung { get; set; }

        [JsonIgnore()]
		public string? BenutzerMerkmal { get; set; }

        [JsonIgnore()]
		public DateTime? MerkmalGiltBis { get; set; }

		[JsonPropertyName("fahrerliste")]
		public List<Fahrer>? FahrerListe { get; set; }

		[JsonIgnore()]
		public byte[]? ProfilBild { get; set; }

		[JsonPropertyName("kundennummer")]
		public int? KundenNummer { get; set; }

		[JsonPropertyName("istfahrer")]
		public bool IstFahrer { get; set; } = false;

		[JsonPropertyName("status")]
		public FahrerStatus Status { get; set; } = FahrerStatus.unbekannt;

		[JsonIgnore()]
		public byte[]? FahrerFoto { get; set; }

		[JsonPropertyName("fuehrerscheinausstellungsdatum")]
		public DateTime? FuehrerscheinAusstellungsDatum { get; set; }

		[JsonPropertyName("fuehrerscheinablaufdatum")]
		public DateTime? FuehrerscheinAblaufDatum { get; set; }

		[JsonPropertyName("fuehrerscheinnummer")]
		public string? FuehrerscheinNummer { get; set; }

		[JsonPropertyName("fuehrerscheinklassenlist")]
		public List<FuehrerscheinKlasse>? FuehrerscheinKlassenList { get; set; }

		[JsonPropertyName("hatzugfahrzeug")]
		public bool HatEigenesZugfahrzeug { get; set; }

		[JsonPropertyName("eigeneszugfahrzeugmarke")]
		public string? EigenesZugfahrzeugMarke { get; set; }

		[JsonPropertyName("eigeneszugfahrzeugmodell")]
		public string? EigenesZugfahrzeugModell { get; set; }

		[JsonPropertyName("eigeneszugfahrzeugkennzeichen")]
		public string? EigenesZugfahrzeugKennzeichen { get; set; }

        [JsonPropertyName("mietpreis")]
        public double? MietPreis { get; set; }

        #endregion

        //************************************************************************
        #region public methods

        public string GetPasswordHash(string pwd)
		{
			SHA256 mySHA256 = SHA256.Create();
			return Convert.ToBase64String(mySHA256.ComputeHash(Encoding.UTF8.GetBytes(pwd)));
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

			if (!String.IsNullOrEmpty(this.Passwort))
			{
				this.PasswortHash = GetPasswordHash(this.Passwort);
			}

			if (this.UserId.HasValue)
            {
				if(!String.IsNullOrEmpty(this.Passwort))
				{
                    command.CommandText = $"update {SCHEMA}.{TABLE} set vorname = :vn, nachname = :nn, geschlecht = :ges, username = :un, passwort = :pwd," +
                    $" rolle = :rl, geburtsdatum = :gebd, geburtsort = :gebo, registrierungstag = :regt, letzteanmeldung = :lanm," +
                    $" benutzermerkmal = :bmerk, merkmalgiltbis = :merkgb, kundennummer = :kn, istfahrer = :if, status = :sta, fuehrerscheinausstellungsdatum = :faud, fuehrerscheinablaufdatum = :fabd, fuehrerscheinnummer = :fnmr, hatzugfahrzeug = :hzf, eigeneszugfahrzeugmarke = :ezma, eigeneszugfahrzeugmodell = :ezmo, eigeneszugfahrzeugkennzeichen = :ezk, mietpreis = :mp where users_id = :pid";
                }
				else
				{
                    command.CommandText = $"update {SCHEMA}.{TABLE} set vorname = :vn, nachname = :nn, geschlecht = :ges, username = :un," +
                    $" rolle = :rl, geburtsdatum = :gebd, geburtsort = :gebo, registrierungstag = :regt, letzteanmeldung = :lanm," +
                    $" benutzermerkmal = :bmerk, merkmalgiltbis = :merkgb, kundennummer = :kn, istfahrer = :if, status = :sta, fuehrerscheinausstellungsdatum = :faud, fuehrerscheinablaufdatum = :fabd, fuehrerscheinnummer = :fnmr, hatzugfahrzeug = :hzf, eigeneszugfahrzeugmarke = :ezma, eigeneszugfahrzeugmodell = :ezmo, eigeneszugfahrzeugkennzeichen = :ezk, mietpreis = :mp where users_id = :pid";
                }
            }
            else
			{
				this.RegistrierungsTag = DateTime.Now;
				this.Rolle = RollenTyp.Kunde;
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.UserId = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:pid, :vn, :nn, :ges, :un, :pwd, :rl, :gebd, :gebo, :regt, :lanm, :bmerk, :merkgb, :kn, :if, :sta, :faud, :fabd, :fnmr, :hzf, :ezma, :ezmo, :ezk, :mp)";
			}

			command.Parameters.AddWithValue("pid", this.UserId);
			command.Parameters.AddWithValue("vn", String.IsNullOrEmpty(this.Vorname) ? (object)DBNull.Value : (object)this.Vorname);
			command.Parameters.AddWithValue("nn", String.IsNullOrEmpty(this.Nachname) ? (object)DBNull.Value : (object)this.Nachname);
			command.Parameters.AddWithValue("ges", (int)this.Geschlecht);
			command.Parameters.AddWithValue("un", String.IsNullOrEmpty(this.UserName) ? (object)DBNull.Value : (object)this.UserName);
			if(!String.IsNullOrEmpty(this.Passwort))
			{
                command.Parameters.AddWithValue("pwd", String.IsNullOrEmpty(this.PasswortHash) ? (object)DBNull.Value : (object)this.PasswortHash);
            }
            //KontaktListe
            command.Parameters.AddWithValue("rl", (int)this.Rolle);
			command.Parameters.AddWithValue("gebd", this.Geburtsdatum.HasValue ? (object)this.Geburtsdatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("gebo", String.IsNullOrEmpty(this.GeburtsOrt) ? (object)DBNull.Value : (object)this.GeburtsOrt);
			command.Parameters.AddWithValue("regt", this.RegistrierungsTag.HasValue ? (object)this.RegistrierungsTag.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("lanm", this.LetzteAnmeldung.HasValue ? (object)this.LetzteAnmeldung.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("bmerk", String.IsNullOrEmpty(this.BenutzerMerkmal) ? (object)DBNull.Value : (object)this.BenutzerMerkmal);
			command.Parameters.AddWithValue("merkgb", this.MerkmalGiltBis.HasValue ? (object)this.MerkmalGiltBis.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("kn", this.KundenNummer.HasValue ? (int)this.KundenNummer : (object)DBNull.Value);
			command.Parameters.AddWithValue("if", this.IstFahrer);
			command.Parameters.AddWithValue("sta", (int)this.Status);
			command.Parameters.AddWithValue("faud", this.FuehrerscheinAusstellungsDatum.HasValue ? (object)this.FuehrerscheinAusstellungsDatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("fabd", this.FuehrerscheinAblaufDatum.HasValue ? (object)this.FuehrerscheinAblaufDatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("fnmr", String.IsNullOrEmpty(this.FuehrerscheinNummer) ? (object)DBNull.Value : (object)this.FuehrerscheinNummer);
			command.Parameters.AddWithValue("hzf", this.HatEigenesZugfahrzeug);
			command.Parameters.AddWithValue("ezma", String.IsNullOrEmpty(this.EigenesZugfahrzeugMarke) ? (object)DBNull.Value : (object)this.EigenesZugfahrzeugMarke);
			command.Parameters.AddWithValue("ezmo", String.IsNullOrEmpty(this.EigenesZugfahrzeugModell) ? (object)DBNull.Value : (object)this.EigenesZugfahrzeugModell);
			command.Parameters.AddWithValue("ezk", String.IsNullOrEmpty(this.EigenesZugfahrzeugKennzeichen) ? (object)DBNull.Value : (object)this.EigenesZugfahrzeugKennzeichen);
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

		public int Save(int user_id)
		{
			int result = -1;
			NpgsqlCommand command = new NpgsqlCommand();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}

			if (!String.IsNullOrEmpty(this.Passwort))
			{
				this.PasswortHash = GetPasswordHash(this.Passwort);
                command.CommandText = $"update {SCHEMA}.{TABLE} set vorname = :vn, nachname = :nn, geschlecht = :ges, username = :un," +
                    $" passwort = :pwd, rolle = :rl, geburtsdatum = :gebd, geburtsort = :gebo" +
                    $" , registrierungstag = :regt, letzteanmeldung = :lanm," +
                    $" benutzermerkmal = :bmerk, merkmalgiltbis = :merkgb, kundennummer = :kn, istfahrer = :if, status = :sta, fuehrerscheinausstellungsdatum = :faud, fuehrerscheinablaufdatum = :fabd, fuehrerscheinnummer = :fnmr, hatzugfahrzeug = :hzf, eigeneszugfahrzeugmarke = :ezma, eigeneszugfahrzeugmodell = :ezmo, eigeneszugfahrzeugkennzeichen = :ezk, mietpreis = :mp where users_id = :pid";
            }
			else
			{
                command.CommandText = $"update {SCHEMA}.{TABLE} set vorname = :vn, nachname = :nn, geschlecht = :ges, username = :un," +
                    $" rolle = :rl, geburtsdatum = :gebd, geburtsort = :gebo" +
                    $" , registrierungstag = :regt, letzteanmeldung = :lanm," +
                    $" benutzermerkmal = :bmerk, merkmalgiltbis = :merkgb, kundennummer = :kn, istfahrer = :if, status = :sta, fuehrerscheinausstellungsdatum = :faud, fuehrerscheinablaufdatum = :fabd, fuehrerscheinnummer = :fnmr, hatzugfahrzeug = :hzf, eigeneszugfahrzeugmarke = :ezma, eigeneszugfahrzeugmodell = :ezmo, eigeneszugfahrzeugkennzeichen = :ezk, mietpreis = :mp where users_id = :pid";
            }

			command.Parameters.AddWithValue("pid", user_id);
			command.Parameters.AddWithValue("vn", String.IsNullOrEmpty(this.Vorname) ? (object)DBNull.Value : (object)this.Vorname);
			command.Parameters.AddWithValue("nn", String.IsNullOrEmpty(this.Nachname) ? (object)DBNull.Value : (object)this.Nachname);
			command.Parameters.AddWithValue("ges", (int)this.Geschlecht);
			command.Parameters.AddWithValue("un", String.IsNullOrEmpty(this.UserName) ? (object)DBNull.Value : (object)this.UserName);
            if (!String.IsNullOrEmpty(this.Passwort))
            {
                command.Parameters.AddWithValue("pwd", String.IsNullOrEmpty(this.PasswortHash) ? (object)DBNull.Value : (object)this.PasswortHash);
            }
            //KontaktListe
            command.Parameters.AddWithValue("rl", (int)this.Rolle);
			command.Parameters.AddWithValue("gebd", this.Geburtsdatum.HasValue ? (object)this.Geburtsdatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("gebo", String.IsNullOrEmpty(this.GeburtsOrt) ? (object)DBNull.Value : (object)this.GeburtsOrt);
			command.Parameters.AddWithValue("regt", this.RegistrierungsTag.HasValue ? (object)this.RegistrierungsTag.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("lanm", this.LetzteAnmeldung.HasValue ? (object)this.LetzteAnmeldung.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("bmerk", String.IsNullOrEmpty(this.BenutzerMerkmal) ? (object)DBNull.Value : (object)this.BenutzerMerkmal);
			command.Parameters.AddWithValue("merkgb", this.MerkmalGiltBis.HasValue ? (object)this.MerkmalGiltBis.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("kn", this.KundenNummer.HasValue ? (int)this.KundenNummer : (object)DBNull.Value);
			command.Parameters.AddWithValue("if", this.IstFahrer);
			command.Parameters.AddWithValue("sta", (int)this.Status);
			command.Parameters.AddWithValue("faud", this.FuehrerscheinAusstellungsDatum.HasValue ? (object)this.FuehrerscheinAusstellungsDatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("fabd", this.FuehrerscheinAblaufDatum.HasValue ? (object)this.FuehrerscheinAblaufDatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("fnmr", String.IsNullOrEmpty(this.FuehrerscheinNummer) ? (object)DBNull.Value : (object)this.FuehrerscheinNummer);
			command.Parameters.AddWithValue("hzf", this.HatEigenesZugfahrzeug);
			command.Parameters.AddWithValue("ezma", String.IsNullOrEmpty(this.EigenesZugfahrzeugMarke) ? (object)DBNull.Value : (object)this.EigenesZugfahrzeugMarke);
			command.Parameters.AddWithValue("ezmo", String.IsNullOrEmpty(this.EigenesZugfahrzeugModell) ? (object)DBNull.Value : (object)this.EigenesZugfahrzeugModell);
			command.Parameters.AddWithValue("ezk", String.IsNullOrEmpty(this.EigenesZugfahrzeugKennzeichen) ? (object)DBNull.Value : (object)this.EigenesZugfahrzeugKennzeichen);
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

		public int SaveWithoutPassword(int user_id)
		{
			int result = -1;
			NpgsqlCommand command = new NpgsqlCommand();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}

			if (!String.IsNullOrEmpty(this.Passwort))
			{
				this.PasswortHash = GetPasswordHash(this.Passwort);
			}

			command.CommandText = $"update {SCHEMA}.{TABLE} set vorname = :vn, nachname = :nn, geschlecht = :ges, username = :un," +
					$" rolle = :rl, geburtsdatum = :gebd, geburtsort = :gebo" +
					$" , registrierungstag = :regt, letzteanmeldung = :lanm," +
					$" merkmalgiltbis = :merkgb, kundennummer = :kn, istfahrer = :if, status = :sta, fuehrerscheinausstellungsdatum = :faud, fuehrerscheinablaufdatum = :fabd, fuehrerscheinnummer = :fnmr, hatzugfahrzeug = :hzf, eigeneszugfahrzeugmarke = :ezma, eigeneszugfahrzeugmodell = :ezmo, eigeneszugfahrzeugkennzeichen = :ezk, mietpreis = :mp where users_id = :pid";

			command.Parameters.AddWithValue("pid", user_id);
			command.Parameters.AddWithValue("vn", String.IsNullOrEmpty(this.Vorname) ? (object)DBNull.Value : (object)this.Vorname);
			command.Parameters.AddWithValue("nn", String.IsNullOrEmpty(this.Nachname) ? (object)DBNull.Value : (object)this.Nachname);
			command.Parameters.AddWithValue("ges", (int)this.Geschlecht);
			command.Parameters.AddWithValue("un", String.IsNullOrEmpty(this.UserName) ? (object)DBNull.Value : (object)this.UserName);
			//KontaktListe
			command.Parameters.AddWithValue("rl", (int)this.Rolle);
			command.Parameters.AddWithValue("gebd", this.Geburtsdatum.HasValue ? (object)this.Geburtsdatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("gebo", String.IsNullOrEmpty(this.GeburtsOrt) ? (object)DBNull.Value : (object)this.GeburtsOrt);
			command.Parameters.AddWithValue("regt", this.RegistrierungsTag.HasValue ? (object)this.RegistrierungsTag.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("lanm", this.LetzteAnmeldung.HasValue ? (object)this.LetzteAnmeldung.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("merkgb", this.MerkmalGiltBis.HasValue ? (object)this.MerkmalGiltBis.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("kn", this.KundenNummer.HasValue ? (int)this.KundenNummer : (object)DBNull.Value);
			command.Parameters.AddWithValue("if", this.IstFahrer);
			command.Parameters.AddWithValue("sta", (int)this.Status);
			command.Parameters.AddWithValue("faud", this.FuehrerscheinAusstellungsDatum.HasValue ? (object)this.FuehrerscheinAusstellungsDatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("fabd", this.FuehrerscheinAblaufDatum.HasValue ? (object)this.FuehrerscheinAblaufDatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("fnmr", String.IsNullOrEmpty(this.FuehrerscheinNummer) ? (object)DBNull.Value : (object)this.FuehrerscheinNummer);
			command.Parameters.AddWithValue("hzf", this.HatEigenesZugfahrzeug);
			command.Parameters.AddWithValue("ezma", String.IsNullOrEmpty(this.EigenesZugfahrzeugMarke) ? (object)DBNull.Value : (object)this.EigenesZugfahrzeugMarke);
			command.Parameters.AddWithValue("ezmo", String.IsNullOrEmpty(this.EigenesZugfahrzeugModell) ? (object)DBNull.Value : (object)this.EigenesZugfahrzeugModell);
			command.Parameters.AddWithValue("ezk", String.IsNullOrEmpty(this.EigenesZugfahrzeugKennzeichen) ? (object)DBNull.Value : (object)this.EigenesZugfahrzeugKennzeichen);
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
			command.CommandText = $"delete from {SCHEMA}.{TABLE} where users_id = :pid";
			command.Parameters.AddWithValue("pid", this.UserId);
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

			if (listToDelete != null)
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
						command.CommandText = $"delete from {SCHEMA}.{TABLE_BILDER} where users_id = :uid;";
						command.Parameters.AddWithValue("uid", entry);
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

				try
				{
					if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
					{
						command.Connection = DBConnection.GetConnection();
						command.Connection.Open();
					}

					foreach (int entry in listToDelete)
					{
						command.CommandText = $"delete from {SCHEMA}.{TABLE_FUEHRERSCHEINKLASSE} where users_id = :uid;";
						command.Parameters.AddWithValue("uid", entry);
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

				try
				{
					if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
					{
						command.Connection = DBConnection.GetConnection();
						command.Connection.Open();
					}

					foreach (int entry in listToDelete)
					{
						command.CommandText = $"delete from {SCHEMA}.{TABLE} where users_id = :uid;";
						command.Parameters.AddWithValue("uid", entry);
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

		public override string ToString()
		{
			return $"{this.Vorname} {this.Nachname} ({this.UserName})";
		}

		public override int GetHashCode()
		{
			int result = 0;
			result ^= this.Vorname.GetHashCode();
			result ^= this.Nachname.GetHashCode();
			result ^= this.UserName.GetHashCode();
			result ^= this.Passwort.GetHashCode();
			result ^= this.Rolle.GetHashCode();
			result ^= this.Geburtsdatum.HasValue ? this.Geburtsdatum.Value.GetHashCode() : 0;
			return result;
		}
		#endregion

	}
}

