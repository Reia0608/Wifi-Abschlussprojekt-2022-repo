using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Wartungstermin
    {
        //************************************************************************
        #region constants
        private const string SCHEMA = "rentals";
        private const string TABLE = "tbl_wartungstermin";
        private const string COLUMNS = "wartungstermin_id, datum, uhrzeit, kraftfahrzeug_id, kosten, erledigt, werkstatt, bezahlt, vorraussichtliches_ende";
        #endregion
        //************************************************************************
        #region static methods

        public static List<Wartungstermin> Get()
        {
            List<Wartungstermin> wartungsterminList = new List<Wartungstermin>();

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE}";

            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                while (reader.Read())
                {
                    wartungsterminList.Add(new Wartungstermin(reader));
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
            return wartungsterminList;
        }

        public static List<Wartungstermin> GetToday()
        {
            List<Wartungstermin> wartungsterminList = new List<Wartungstermin>();

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} Where vorraussichtliches_ende = now()";
            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                while (reader.Read())
                {
                    wartungsterminList.Add(new Wartungstermin(reader));
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
            return wartungsterminList;
        }

        public static List<Wartungstermin> GetOpen()
        {
            List<Wartungstermin> wartungsterminList = new List<Wartungstermin>();

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} Where erledigt = false";
            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                while (reader.Read())
                {
                    wartungsterminList.Add(new Wartungstermin(reader));
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
            return wartungsterminList;
        }

        public static List<Wartungstermin> GetFinished()
        {
            List<Wartungstermin> wartungsterminList = new List<Wartungstermin>();

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} Where erledigt = true";
            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                while (reader.Read())
                {
                    wartungsterminList.Add(new Wartungstermin(reader));
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
            return wartungsterminList;
        }

        public static Wartungstermin Get(int id)
        {
            Wartungstermin wartungstermin = new Wartungstermin();
            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where wartungstermin_id = :wid";
            command.Parameters.AddWithValue("wid", id);

            NpgsqlDataReader reader = command.ExecuteReader();

            try
            {
                reader.Read();
                wartungstermin = new Wartungstermin(reader);
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
            return wartungstermin;
        }

        public static Wartungstermin GetByKraftfahrzeugId(int id)
        {
            Wartungstermin wartungstermin = new Wartungstermin();
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
                wartungstermin = new Wartungstermin(reader);
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
            return wartungstermin;
        }

        #endregion
        //************************************************************************
        #region constructor
        public Wartungstermin()
        {

        }

        public Wartungstermin(NpgsqlDataReader reader)
        {
            Wartungstermin_Id = reader.GetInt32(0);
            Datum = reader.IsDBNull(1) ? null : reader.GetDateTime(1);
            Uhrzeit = reader.IsDBNull(2) ? null : reader.GetString(2);
            Kraftfahrzeug_Id = reader.IsDBNull(3) ? null : reader.GetInt32(3);
            Kosten = reader.IsDBNull(4) ? null : reader.GetDouble(4);
            Erledigt = reader.GetBoolean(5);
            Werkstatt = reader.IsDBNull(6) ? null : reader.GetString(6);
            Bezahlt = reader.GetBoolean(7);
            VorraussichtlichesEnde = reader.IsDBNull(8) ? null : reader.GetDateTime(8);
        }
        #endregion
        //************************************************************************
        #region properties

        [JsonPropertyName("wartungstermin_id")]
        public int? Wartungstermin_Id { get; set; }

        [JsonPropertyName("datum")]
        public DateTime? Datum { get; set; }

        [JsonPropertyName("uhrzeit")]
        public string? Uhrzeit { get; set; }

        [JsonPropertyName("kraftfahrzeug_id")]
        public int? Kraftfahrzeug_Id { get; set; }

        [JsonPropertyName("kosten")]
        public double? Kosten { get; set; }

        [JsonPropertyName("erledigt")]
        public bool? Erledigt { get; set; }

        [JsonPropertyName("werkstatt")]
        public string? Werkstatt { get; set; }

        [JsonPropertyName("bezahlt")]
        public bool? Bezahlt { get; set; }

        [JsonPropertyName("vorraussichtliches_ende")]
        public DateTime? VorraussichtlichesEnde { get; set; }

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

            if (this.Wartungstermin_Id.HasValue)
            {
                command.CommandText = $"update {SCHEMA}.{TABLE} set datum = :dat, uhrzeit = :uhr, kraftfahrzeug_id = :kid, kosten = :kos, erledigt = :erl, werkstatt = :wer, bezahlt = :bez, vorraussichtliches_ende = :ve where wartungstermin_id = :wid";
            }
            else
            {
                command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
                this.Wartungstermin_Id = (int)((long)command.ExecuteScalar());
                command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:wid, :dat, :uhr, :kid, :kos, :erl, :wer, :bez, :ve)";
            }

            command.Parameters.AddWithValue("wid", this.Wartungstermin_Id);
            command.Parameters.AddWithValue("dat", this.Datum.HasValue ? (object)this.Datum.Value : (object)DBNull.Value);
            command.Parameters.AddWithValue("uhr", String.IsNullOrEmpty(this.Uhrzeit) ? (object)DBNull.Value : (object)this.Uhrzeit);
            command.Parameters.AddWithValue("kid", this.Kraftfahrzeug_Id.HasValue ? (int)this.Kraftfahrzeug_Id : (object)DBNull.Value);
            command.Parameters.AddWithValue("kos", this.Kosten.HasValue ? (double)this.Kosten : (object)DBNull.Value);
            command.Parameters.AddWithValue("erl", this.Erledigt);
            command.Parameters.AddWithValue("wer", String.IsNullOrEmpty(this.Werkstatt) ? (object)DBNull.Value : (object)this.Werkstatt);
            command.Parameters.AddWithValue("bez", this.Bezahlt);
            command.Parameters.AddWithValue("ve", this.VorraussichtlichesEnde.HasValue ? (object)this.VorraussichtlichesEnde.Value : (object)DBNull.Value);

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
