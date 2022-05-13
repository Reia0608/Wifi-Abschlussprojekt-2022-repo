using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using VRentalsClasses.Interfaces;
using Google.Cloud.Firestore;

namespace VRentalsClasses.Models
{
    public class Benutzer: IPerson, ILoginData
    {
        //************************************************************************
        #region constants
        private const string SCHEMA = "rentals";
        private const string TABLE = "tbl_users";
		//                                 0        1      2           3           4              5          6       7          8             9        10                   11                  12               
        private const string COLUMNS = "users_id, vorname, nachname, geschlecht, username, passwort, rolle, geburtsdatum, geburtsort," +
			" registrierungstag, letzteanmeldung, benutzermerkmal, merkmalgiltbis";
		private const string KONTAKT = "tbl_kontakt";
		#endregion
		
		//************************************************************************
		#region static methods

		public static Benutzer Get(ControllerBase controller)
		{
			Benutzer benutzer = new Benutzer();
			//Funktionen funktion = new Funktionen();
			//string bm = funktion.GetCookie(controller);
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
					benutzer = benutzer.CreateBenutzer(reader);
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
				benutzer = benutzer.CreateBenutzer(reader);	
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
					benutzerList.Add(benutzer = benutzer.CreateBenutzer(reader));
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

		// WIP
		//public static Benutzer Get(int id)
		//{
		//	DBConnection.GetConnection().Open();
		//	NpgsqlCommand command = new NpgsqlCommand();
		//	command.Connection = DBConnection.GetConnection();
		//	int tmpId = 0;
		//	command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where ";
		//	if (int.TryParse(id, out tmpId))
		//	{
		//		command.CommandText += "users_id = :pid";
		//		command.Parameters.AddWithValue("pid", tmpId);
		//	}
		//	else
		//	{
		//		command.CommandText += "benutzermerkmal = :bm";
		//		command.Parameters.AddWithValue("bm", id);
		//	}

		//	NpgsqlDataReader reader = command.ExecuteReader();
		//	reader.Read();

		//	Benutzer benutzer = new Benutzer()
		//	{
		//		UserId = reader.GetInt32(0),
		//		Vorname = reader.IsDBNull(1) ? null : reader.GetString(1),
		//		Nachname = reader.IsDBNull(2) ? null : reader.GetString(2),
		//		Geburtsdatum = reader.IsDBNull(3) ? null : (DateTime?)reader.GetDateTime(3),
		//		GeburtsOrt = reader.IsDBNull(4) ? null : reader.GetString(4),
		//		UserName = reader.IsDBNull(5) ? null : reader.GetString(5),
		//		PasswortHash = reader.IsDBNull(6) ? null : reader.GetString(6),
		//		//KontaktListe = reader.IsDBNull(10) ? null : reader.GetInt32(10),
		//		RegistrierungsTag = reader.IsDBNull(7) ? null : (DateTime?)reader.GetDateTime(7),
		//		LetzteAnmeldung = reader.IsDBNull(8) ? null : (DateTime?)reader.GetDateTime(8),
		//		BenutzerMerkmal = reader.IsDBNull(9) ? null : reader.GetString(9),
		//		MerkmalGiltBis = reader.IsDBNull(10) ? null : reader.GetDateTime(10),
		//		Geschlecht = reader.IsDBNull(11) ? GeschlechtsTyp.unbekannt : (GeschlechtsTyp)reader.GetInt32(11),
		//		Rolle = reader.IsDBNull(12) ? RollenTyp.Kunde : (RollenTyp)reader.GetInt32(12)
		//	};
		//	reader.Close();
		//	DBConnection.GetConnection().Close();
		//	return benutzer;
		//}

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
				if (result == 0) throw new Exception($"Benutzer <{userName}> unbekannt!");
				else
				{
					command.Parameters.Clear();
					command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where lower(username) = :username";
					command.Parameters.AddWithValue("username", userName);
					NpgsqlDataReader reader = command.ExecuteReader();
					reader.Read();
					benutzer = benutzer.CreateBenutzer(reader);
					reader.Close();
					if (benutzer.PasswortHash != benutzer.GetPasswordHash(pwd)) throw new Exception("Passwort stimmt nicht überein!");
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
					benutzerList.Add(benutzer = benutzer.CreateBenutzer(reader));
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
		#endregion

		//************************************************************************
		#region constructors#
		public Benutzer()
		{

		}

		public Benutzer(NpgsqlDataReader reader)
		{
			UserId = reader.GetInt32(0);
			Vorname = reader.IsDBNull(1) ? null : reader.GetString(1);
			Nachname = reader.IsDBNull(2) ? null : reader.GetString(2);
			Geschlecht = reader.IsDBNull(3) ? GeschlechtsTyp.unbekannt : (GeschlechtsTyp)reader.GetInt32(3);
			UserName = reader.IsDBNull(4) ? null : reader.GetString(4);
			PasswortHash = reader.IsDBNull(5) ? null : reader.GetString(5);
			Rolle = reader.IsDBNull(6) ? RollenTyp.Kunde : (RollenTyp)reader.GetInt32(6);
			Geburtsdatum = reader.IsDBNull(7) ? null : (DateTime?)reader.GetDateTime(7);
			GeburtsOrt = reader.IsDBNull(8) ? null : reader.GetString(8);
			//KontaktListe = reader.IsDBNull(10) ? null : reader.GetInt32(10),
			RegistrierungsTag = reader.IsDBNull(9) ? null : (DateTime?)reader.GetDateTime(9);
			LetzteAnmeldung = reader.IsDBNull(10) ? null : (DateTime?)reader.GetDateTime(10);
			BenutzerMerkmal = reader.IsDBNull(11) ? null : reader.GetString(11);
			MerkmalGiltBis = reader.IsDBNull(12) ? null : reader.GetDateTime(12);
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

		public byte[]? ProfilBild { get; set; }

		#endregion

		//************************************************************************
		#region public methods

		public Benutzer CreateBenutzer(NpgsqlDataReader reader)
        {
			Benutzer benutzer = new Benutzer();

			benutzer = new Benutzer()
			{
				UserId = reader.GetInt32(0),
				Vorname = reader.IsDBNull(1) ? null : reader.GetString(1),
				Nachname = reader.IsDBNull(2) ? null : reader.GetString(2),
				Geschlecht = reader.IsDBNull(3) ? GeschlechtsTyp.unbekannt : (GeschlechtsTyp)reader.GetInt32(3),
				UserName = reader.IsDBNull(4) ? null : reader.GetString(4),
				PasswortHash = reader.IsDBNull(5) ? null : reader.GetString(5),
				Rolle = reader.IsDBNull(6) ? RollenTyp.Kunde : (RollenTyp)reader.GetInt32(6),
				Geburtsdatum = reader.IsDBNull(7) ? null : (DateTime?)reader.GetDateTime(7),
				GeburtsOrt = reader.IsDBNull(8) ? null : reader.GetString(8),
				//KontaktListe = reader.IsDBNull(10) ? null : reader.GetInt32(10),
				RegistrierungsTag = reader.IsDBNull(9) ? null : (DateTime?)reader.GetDateTime(9),
				LetzteAnmeldung = reader.IsDBNull(10) ? null : (DateTime?)reader.GetDateTime(10),
				BenutzerMerkmal = reader.IsDBNull(11) ? null : reader.GetString(11),
				MerkmalGiltBis = reader.IsDBNull(12) ? null : reader.GetDateTime(12),
			};
			return benutzer;
        }

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
			
			if (!String.IsNullOrEmpty(this.Passwort)) this.PasswortHash = GetPasswordHash(this.Passwort);

			if (this.UserId.HasValue)
            {
                command.CommandText = $"update {SCHEMA}.{TABLE} set vorname = :vn, nachname = :nn, geschlecht = :ges, username = :un, passwort = :pwd," +
                    $" rolle = :rl, geburtsdatum = :gebd, geburtsort = :gebo, registrierungstag = :regt, letzteanmeldung = :lanm," +
                    $" benutzermerkmal = :bmerk, merkmalgiltbis = :merkgb where users_id = :pid";

            }
            else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.UserId = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:pid, :vn, :nn, :ges, :un, :pwd, :rl, :gebd, :gebo, :regt, :lanm, :bmerk, :merkgb)";
			}

			command.Parameters.AddWithValue("pid", this.UserId);
			command.Parameters.AddWithValue("vn", String.IsNullOrEmpty(this.Vorname) ? (object)DBNull.Value : (object)this.Vorname);
			command.Parameters.AddWithValue("nn", String.IsNullOrEmpty(this.Nachname) ? (object)DBNull.Value : (object)this.Nachname);
			command.Parameters.AddWithValue("ges", (int)this.Geschlecht);
			command.Parameters.AddWithValue("un", String.IsNullOrEmpty(this.UserName) ? (object)DBNull.Value : (object)this.UserName);
			command.Parameters.AddWithValue("pwd", String.IsNullOrEmpty(this.PasswortHash) ? (object)DBNull.Value : (object)this.PasswortHash);
			//KontaktListe
			command.Parameters.AddWithValue("rl", (int)this.Rolle);
			command.Parameters.AddWithValue("gebd", this.Geburtsdatum.HasValue ? (object)this.Geburtsdatum.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("gebo", String.IsNullOrEmpty(this.GeburtsOrt) ? (object)DBNull.Value : (object)this.GeburtsOrt);
			command.Parameters.AddWithValue("regt", this.RegistrierungsTag.HasValue ? (object)this.RegistrierungsTag.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("lanm", this.LetzteAnmeldung.HasValue ? (object)this.LetzteAnmeldung.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("bmerk", String.IsNullOrEmpty(this.BenutzerMerkmal) ? (object)DBNull.Value : (object)this.BenutzerMerkmal);
			command.Parameters.AddWithValue("merkgb", this.MerkmalGiltBis.HasValue ? (object)this.MerkmalGiltBis.Value : (object)DBNull.Value);
			
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

