using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Bewegung
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_bewegung";
		private const string COLUMNS = "bewegung_id, users_id, bewegungsdatum, beschreibung, grund, abholort, rueckgabeort, abholdatum, abholzeit, rueckgabedatum, rueckgabezeit, gleicherrueckgabeort, schutzpaket, braucht_fahrer, fahrer_id, preis_gesamt, preis_kfz, preis_anhaenger, preis_fahrer, preis_schutzpaket, allow_reload, transaction_finished, bewegung_finished, kraftfahrzeug_id, anhaenger_id, times_rented, preis_schaden, kfz_bezeichnung, anhaenger_bezeichnung, tage_gemietet";
        #endregion
        //************************************************************************
        #region static methods

        public static Bewegung Get(int id)
        {
            Bewegung bewegung = new Bewegung();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where bewegung_id = :bwid";
            command.Parameters.AddWithValue("bwid", id);

            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                reader.Read();
                bewegung = new Bewegung(reader);
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
            return bewegung;
        }

        public static Bewegung GetByBenutzerId(int id)
        {
            Bewegung bewegung = new Bewegung();
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
                bewegung = new Bewegung(reader);
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
            return bewegung;
        }

        public static List<Bewegung> GetAllByBenutzerId(int id)
        {
            List<Bewegung> bewegungList = new List<Bewegung>();
            Bewegung bewegung = new Bewegung();
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
                while(reader.Read())
                {
                    bewegungList.Add(bewegung = new Bewegung(reader));
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
            return bewegungList;
        }

        public static List<Bewegung> GetAllByFahrerId(int id)
        {
            List<Bewegung> bewegungList = new List<Bewegung>();
            Bewegung bewegung = new Bewegung();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"SELECT {COLUMNS} FROM {SCHEMA}.{TABLE} WHERE fahrer_id = :fid ORDER BY abholdatum ASC";
            command.Parameters.AddWithValue("fid", id);

            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                while (reader.Read())
                {
                    bewegungList.Add(bewegung = new Bewegung(reader));
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
            return bewegungList;
        }

        public static Bewegung GetByKraftfahrzeugId(int id)
        {
            Bewegung bewegung = new Bewegung();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where {SCHEMA}.{TABLE} kraftfahrzeug_id = :kid";
            command.Parameters.AddWithValue("kid", id);

            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                reader.Read();
                bewegung = new Bewegung(reader);
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
            return bewegung;
        }

        #endregion
        //************************************************************************
        #region constructor
        public Bewegung()
		{

		}

		public Bewegung(NpgsqlDataReader reader)
		{
			Bewegung_Id = reader.GetInt32(0);
            UsersId = reader.IsDBNull(1) ? null : reader.GetInt32(1);
			BewegungsDatum = reader.IsDBNull(2) ? null : reader.GetDateTime(2);
			Beschreibung = reader.IsDBNull(3) ? null : reader.GetString(3);
			Grund = reader.IsDBNull(4) ? null : reader.GetString(4);
			AbholOrt = reader.IsDBNull(5) ? null : reader.GetString(5);
			RueckgabeOrt = reader.IsDBNull(6) ? null : reader.GetString(6);
			AbholDatum = reader.IsDBNull(7) ? null : reader.GetDateTime(7);
			AbholZeit = reader.IsDBNull(8) ? null : reader.GetString(8);
			RueckgabeDatum = reader.IsDBNull(9) ? null : reader.GetDateTime(9);
			RueckgabeZeit = reader.IsDBNull(10) ? null : reader.GetString(10);
            GleicherRueckgabeort = reader.GetBoolean(11);
            SchutzPaket = reader.IsDBNull(12) ? null : reader.GetString(12);
            BrauchtFahrer = reader.GetBoolean(13);
            FahrerId = reader.IsDBNull(14) ? null : reader.GetInt32(14);
            PreisGesamt = reader.IsDBNull(15) ? null : reader.GetDouble(15);
            PreisKfz = reader.IsDBNull(16) ? null : reader.GetDouble(16);
            PreisAnhaenger = reader.IsDBNull(17) ? null : reader.GetDouble(17);
            PreisFahrer = reader.IsDBNull(18) ? null : reader.GetDouble(18);
            PreisSchutzpaket = reader.IsDBNull(19) ? null : reader.GetDouble(19);
            AllowReload = reader.GetBoolean(20);
            TransactionFinished = reader.GetBoolean(21);
            BewegungFinished = reader.GetBoolean(22);
            KraftfahrzeugId = reader.IsDBNull(23) ? null : reader.GetInt32(23);
            AnhaengerId = reader.IsDBNull(24) ? null : reader.GetInt32(24);
            TimesRented = reader.IsDBNull(25) ? 0 : reader.GetInt32(25);
            PreisSchaden = reader.IsDBNull(26) ? null : reader.GetDouble(26);
            KraftfahrzeugBezeichnung = reader.IsDBNull(27) ? null : reader.GetString(27);
            AnhaengerBezeichnung = reader.IsDBNull(28) ? null : reader.GetString(28);
            TageGemietet = reader.IsDBNull(29) ? null : reader.GetInt32(29);
        }
		#endregion
		//************************************************************************
		#region properties

		[JsonPropertyName("bewegung_id")]
		public int? Bewegung_Id { get; set; }

        [JsonPropertyName("users_id")]
        public int? UsersId { get; set; }

        [JsonPropertyName("bewegungsdatum")]
        public DateTime? BewegungsDatum { get; set; }

		[JsonPropertyName("beschreibung")]
		public string? Beschreibung { get; set; }

		[JsonPropertyName("grund")]
		public string? Grund { get; set; }

        [JsonPropertyName("abholort")]
        public string? AbholOrt { get; set; }

        [JsonPropertyName("rueckgabeort")]
        public string? RueckgabeOrt { get; set; }

        [JsonPropertyName("abholdatum")]
        public DateTime? AbholDatum { get; set; }

        [JsonPropertyName("abholzeit")]
        public string? AbholZeit { get; set; }

        [JsonPropertyName("rueckgabedatum")]
        public DateTime? RueckgabeDatum { get; set; }

        [JsonPropertyName("rueckgabezeit")]
        public string? RueckgabeZeit { get; set; }

        [JsonPropertyName("gleicherrueckgabeort")]
        public bool GleicherRueckgabeort { get; set; }

        [JsonPropertyName("schutzpaket")]
        public string? SchutzPaket { get; set; }

        [JsonPropertyName("braucht_fahrer")]
        public bool BrauchtFahrer { get; set; }

        [JsonPropertyName("fahrer_id")]
        public int? FahrerId { get; set; }

        [JsonPropertyName("preis_gesamt")]
        public double? PreisGesamt { get; set; }

        [JsonPropertyName("preis_kfz")]
        public double? PreisKfz { get; set; }

        [JsonPropertyName("preis_anhaenger")]
        public double? PreisAnhaenger { get; set; }

        [JsonPropertyName("preis_fahrer")]
        public double? PreisFahrer { get; set; }

        [JsonPropertyName("preis_schutzpaket")]
        public double? PreisSchutzpaket { get; set; }

        [JsonPropertyName("allow_reload")]
        public bool AllowReload { get; set; }

        [JsonPropertyName("transaction_finished")]
        public bool TransactionFinished { get; set; }

        [JsonPropertyName("bewegung_finished")]
        public bool BewegungFinished { get; set; }

        [JsonPropertyName("kraftfahrzeug_id")]
        public int? KraftfahrzeugId { get; set; }

        [JsonPropertyName("anhaenger_id")]
        public int? AnhaengerId { get; set; }

        [JsonPropertyName("times_rented")]
        public int? TimesRented { get; set; }

        [JsonPropertyName("preis_schaden")]
        public double? PreisSchaden { get; set; }

        [JsonPropertyName("kfz_bezeichnung")]
        public string? KraftfahrzeugBezeichnung { get; set; }

        [JsonPropertyName("anhaenger_bezeichnung")]
        public string? AnhaengerBezeichnung { get; set; }

        [JsonPropertyName("tage_gemietet")]
        public int? TageGemietet { get; set; }

        #endregion
        //************************************************************************
        #region public methods

        public int Save()
        {
            bool post = true;
            int result = -1;
            NpgsqlCommand command = new NpgsqlCommand();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                command.Connection = DBConnection.GetConnection();
                command.Connection.Open();
            }

            if (this.Bewegung_Id.HasValue)
            {
                post = false;
                command.CommandText = $"update {SCHEMA}.{TABLE} set users_id = :uid, beschreibung = :bes, grund = :gru, abholort = :ao, rueckgabeort = :ro, abholdatum = :ad, abholzeit = :az, rueckgabedatum = :rd, rueckgabezeit = :rz, gleicherrueckgabeort = :gro, schutzpaket = :sp, braucht_fahrer = :bf, fahrer_id = :fid, preis_gesamt = :pg, preis_kfz = :pk, preis_anhaenger = :pa, preis_fahrer = :pf, preis_schutzpaket = :ps, allow_reload = :ar, transaction_finished = :tf, bewegung_finished = :bwf, kraftfahrzeug_id = :kid, anhaenger_id = :aid, times_rented = :tr, preis_schaden = :psd, kfz_bezeichnung = :kbez, anhaenger_bezeichnung = :abez, tage_gemietet = :tg where bewegung_id = :bwid";
            }
            else
            {
                this.BewegungsDatum = DateTime.Now;
                command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
                this.Bewegung_Id = (int)((long)command.ExecuteScalar());
                command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:bwid, :uid, :bd, :bes, :gru, :ao, :ro, :ad, :az, :rd, :rz, :gro, :sp, :bf, :fid, :pg, :pk, :pa, :pf, :ps, :ar, :tf, :bwf, :kid, :aid, :tr, :psd, :kbez, :abez, :tg)";
            }

            command.Parameters.AddWithValue("bwid", this.Bewegung_Id);
            command.Parameters.AddWithValue("uid", this.UsersId.HasValue ? (int)this.UsersId : (object)DBNull.Value);
            if (post)
            {
                command.Parameters.AddWithValue("bd", this.BewegungsDatum.HasValue ? (object)this.BewegungsDatum.Value : (object)DBNull.Value);
            }
            command.Parameters.AddWithValue("bes", String.IsNullOrEmpty(this.Beschreibung) ? (object)DBNull.Value : (object)this.Beschreibung);
            command.Parameters.AddWithValue("gru", String.IsNullOrEmpty(this.Grund) ? (object)DBNull.Value : (object)this.Grund);
            command.Parameters.AddWithValue("ao", String.IsNullOrEmpty(this.AbholOrt) ? (object)DBNull.Value : (object)this.AbholOrt);
            command.Parameters.AddWithValue("ro", String.IsNullOrEmpty(this.RueckgabeOrt) ? (object)DBNull.Value : (object)this.RueckgabeOrt);
            command.Parameters.AddWithValue("ad", this.AbholDatum.HasValue ? (object)this.AbholDatum.Value : (object)DBNull.Value);
            command.Parameters.AddWithValue("az", String.IsNullOrEmpty(this.AbholZeit) ? (object)DBNull.Value : (object)this.AbholZeit);
            command.Parameters.AddWithValue("rd", this.RueckgabeDatum.HasValue ? (object)this.RueckgabeDatum.Value : (object)DBNull.Value);
            command.Parameters.AddWithValue("rz", String.IsNullOrEmpty(this.RueckgabeZeit) ? (object)DBNull.Value : (object)this.RueckgabeZeit);
            command.Parameters.AddWithValue("gro", this.GleicherRueckgabeort);
            command.Parameters.AddWithValue("sp", String.IsNullOrEmpty(this.SchutzPaket) ? (object)DBNull.Value : (object)this.SchutzPaket);
            command.Parameters.AddWithValue("bf", this.BrauchtFahrer);
            command.Parameters.AddWithValue("fid", this.FahrerId.HasValue ? (int)this.FahrerId : (object)DBNull.Value);
            command.Parameters.AddWithValue("pg", this.PreisGesamt.HasValue ? (double)this.PreisGesamt : (object)DBNull.Value);
            command.Parameters.AddWithValue("pk", this.PreisKfz.HasValue ? (double)this.PreisKfz : (object)DBNull.Value);
            command.Parameters.AddWithValue("pa", this.PreisAnhaenger.HasValue ? (double)this.PreisAnhaenger : (object)DBNull.Value);
            command.Parameters.AddWithValue("pf", this.PreisFahrer.HasValue ? (double)this.PreisFahrer : (object)DBNull.Value);
            command.Parameters.AddWithValue("ps", this.PreisSchutzpaket.HasValue ? (double)this.PreisSchutzpaket : (object)DBNull.Value);
            command.Parameters.AddWithValue("ar", this.AllowReload);
            command.Parameters.AddWithValue("tf", this.TransactionFinished);
            command.Parameters.AddWithValue("bwf", this.BewegungFinished);
            command.Parameters.AddWithValue("kid", this.KraftfahrzeugId.HasValue ? (int)this.KraftfahrzeugId : (object)DBNull.Value);
            command.Parameters.AddWithValue("aid", this.AnhaengerId.HasValue ? (int)this.AnhaengerId : (object)DBNull.Value);
            command.Parameters.AddWithValue("tr", this.TimesRented.HasValue ? (int)this.TimesRented : (object)DBNull.Value);
            command.Parameters.AddWithValue("psd", this.PreisSchaden.HasValue ? (double)this.PreisSchaden : (object)DBNull.Value);
            command.Parameters.AddWithValue("kbez", String.IsNullOrEmpty(this.KraftfahrzeugBezeichnung) ? (object)DBNull.Value : (object)this.KraftfahrzeugBezeichnung);
            command.Parameters.AddWithValue("abez", String.IsNullOrEmpty(this.AnhaengerBezeichnung) ? (object)DBNull.Value : (object)this.AnhaengerBezeichnung);
            command.Parameters.AddWithValue("tg", this.TageGemietet.HasValue ? (int)this.TageGemietet : (object)DBNull.Value);

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
    }
}
