using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;
using System.Diagnostics;

namespace VRentalsClasses.Models
{
    public class Anhaengerkarte
    {
        //************************************************************************
        #region constants
        private const string SCHEMA = "rentals";
        private const string TABLE_ANHAENGER = "tbl_anhaenger";
        private const string TABLE_BILDER = "tbl_bilder";
        private const string COLUMNS_BILDER = "bilder_id, bild_bytes, bild_url, kraftfahrzeug_id, anhaenger_id, users_id, schaden_id";
        private const string COLUMNS_ANHAENGER = "anhaenger_id, mietpreis, gegenstandzustand, kategorie, aktueller_standort_id, adresse_id, marke, modell, ausgabenstelle_id, aktueller_standort_id, kennzeichen";

        #endregion

        //************************************************************************
        #region static methods

        public static Anhaengerkarte Get(int anhaenger_id)
        {
            Anhaengerkarte anhaengerkarte = null;

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select * from {SCHEMA}.anhaenger_list where aid = :aid";
            command.Parameters.AddWithValue("aid", anhaenger_id);
            NpgsqlDataReader reader = command.ExecuteReader();
            try
            {
                if (reader.Read())
                {
                    anhaengerkarte = new Anhaengerkarte(reader);
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
            return anhaengerkarte;
        }

        public static List<Anhaengerkarte> GetList()
        {
            List<Anhaengerkarte> anhaengerkarteListe = new List<Anhaengerkarte>();
            Anhaengerkarte anhaengerkarte = new Anhaengerkarte();

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }
            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select * from {SCHEMA}.anhaenger_list order by marke";
            NpgsqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                anhaengerkarteListe.Add(anhaengerkarte = new Anhaengerkarte(reader));
            }
            reader.Close();
            DBConnection.GetConnection().Close();

            return anhaengerkarteListe;
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
                        command.CommandText = $"delete from {SCHEMA}.{TABLE_BILDER} where anhaenger_id = :aid;";
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

                try
                {
                    if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
                    {
                        command.Connection = DBConnection.GetConnection();
                        command.Connection.Open();
                    }

                    foreach (int entry in listToDelete)
                    {
                        command.CommandText = $"delete from {SCHEMA}.{TABLE_ANHAENGER} where anhaenger_id = :aid;";
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
                        command.CommandText = $"update {SCHEMA}.{TABLE_ANHAENGER} set ausgabenstelle_id = :asid where anhaenger_id = :aid;";
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
                        command.CommandText = $"update {SCHEMA}.{TABLE_ANHAENGER} set ausgabenstelle_id = NULL where anhaenger_id = :aid;";
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

        public static List<Anhaenger> FilterBy(string by, string value)
        {
            List<Anhaenger> anhaengerList = new List<Anhaenger>();
            Anhaenger? anhaenger = new Anhaenger();
            string Condition = "";

            if (by == "kategorie")
            {
                Condition = $"WHERE {by} = '{value}'";
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
            command.CommandText = $"SELECT {COLUMNS_ANHAENGER} FROM {SCHEMA}.{TABLE_ANHAENGER} {Condition} order by marke";
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
        #endregion
        //************************************************************************
        #region constructors#
        public Anhaengerkarte()
        {

        }

        public Anhaengerkarte(NpgsqlDataReader reader)
        {
            AnhaengerId = reader.GetInt32(0);
            MietPreis = reader.IsDBNull(1) ? null : reader.GetDouble(1);
            GegenstandZustand = reader.IsDBNull(2) ? GegenstandZustandTyp.frei : (GegenstandZustandTyp)reader.GetInt32(2);
            Kategorie = reader.IsDBNull(3) ? null : reader.GetString(3);
            AktuellerStandort = reader.IsDBNull(4) ? null : reader.GetInt32(4);
            Adresse_Id = reader.IsDBNull(5) ? null : reader.GetInt32(5);
            Marke = reader.IsDBNull(6) ? null : reader.GetString(6);
            Modell = reader.IsDBNull(7) ? null : reader.GetString(7);
            Ausgabenstelle_Id = reader.IsDBNull(8) ? null : reader.GetInt32(8);
            Kennzeichen = reader.IsDBNull(9) ? null : reader.GetString(9);
            BildBytes = reader.IsDBNull(10) ? null : (byte[])reader.GetValue(10);
        }

        #endregion
        //************************************************************************
        #region properties
        [JsonPropertyName("anhaenger_id")]
        public int? AnhaengerId { get; set; }

        [JsonPropertyName("mietpreis")]
        public double? MietPreis { get; set; }

        [JsonPropertyName("gegenstandzustand")]
        public GegenstandZustandTyp GegenstandZustand { get; set; } = GegenstandZustandTyp.frei;

        [JsonPropertyName("kategorie")]
        public string? Kategorie { get; set; }

        [JsonPropertyName("aktuellerstandort")]
        public int? AktuellerStandort { get; set; }

        [JsonPropertyName("adresse_id")]
        public int? Adresse_Id { get; set; }

        [JsonPropertyName("marke")]
        public string? Marke { get; set; }

        [JsonPropertyName("modell")]
        public string? Modell { get; set; }

        [JsonPropertyName("ausgabenstelle_id")]
        public int? Ausgabenstelle_Id { get; set; }

        [JsonPropertyName("kennzeichen")]
        public string? Kennzeichen { get; set; }

        [JsonPropertyName("bild_bytes")]
        public byte[]? BildBytes { get; set; }

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

            if (this.AnhaengerId.HasValue)
            {
                command.CommandText = $"update {SCHEMA}.{TABLE_ANHAENGER} set mietpreis = :mp, gegenstandzustand = :gz, kategorie = :k, marke = :ma, modell = :mo, ausgabenstelle_id = :asid, aktueller_standort_id = :aso, kennzeichen = :ken where anhaenger_id = :aid";
            }
            else
            {
                command.CommandText = $"select nextval('{SCHEMA}.{TABLE_ANHAENGER}_seq')";
                this.AnhaengerId = (int)((long)command.ExecuteScalar());
                command.CommandText = $"insert into {SCHEMA}.{TABLE_ANHAENGER} ({COLUMNS_ANHAENGER}) values (:aid, :mp, :gz, :k, :ma, :mo, :asid, :aso, :ken)";
            }

            command.Parameters.AddWithValue("aid", this.AnhaengerId);
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
    }
}
