using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Ausgabenstelle
    {
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE = "tbl_ausgabenstelle";
		private const string COLUMNS = "ausgabenstelle_id, adresse_id, ausgabenstelle_bezeichnung, ausgabenstelle_adresse";
		#endregion

		//************************************************************************
		#region static methods
		// WIP: if anhaenger_id does not exist in the db, creates a new entry with null values!
		public static Ausgabenstelle Get(int? ausgabenstelle_id)
		{
			Ausgabenstelle ausgabenstelle = new Ausgabenstelle();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where ausgabenstelle_id = :asid";
			command.Parameters.AddWithValue("asid", ausgabenstelle_id);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					ausgabenstelle = new Ausgabenstelle();
					{
						ausgabenstelle = new Ausgabenstelle(reader);
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
			return ausgabenstelle;
		}

        public static List<string>? GetAllNames()
        {
            List<string>? resultAusgabenstelleListe = new List<string>();

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select ausgabenstelle_bezeichnung from {SCHEMA}.{TABLE}";

            NpgsqlDataReader reader = command.ExecuteReader();
            try
            {
                while (reader.Read())
                {
                    resultAusgabenstelleListe.Add(reader.GetString(0));
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
            return resultAusgabenstelleListe;
        }

        public static List<string>? GetByIdList(List<int?> ausgabenstelleListe)
        {
            List<string>? resultAusgabenstelleListe = new List<string>();
			string condition = $" WHERE ";
			int iterator = 0;

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

			foreach (int? entry in ausgabenstelleListe)
			{
				if(iterator == 0)
				{
                    condition += $"ausgabenstelle_id = {entry} ";
					iterator++;
                }
				else
				{
					condition += $"OR ausgabenstelle_id = {entry} ";
					iterator++;
                }				
			}

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select ausgabenstelle_bezeichnung from {SCHEMA}.{TABLE} {condition}";
            
            NpgsqlDataReader reader = command.ExecuteReader();
            try
            {
                while (reader.Read())
                {
					resultAusgabenstelleListe.Add(reader.GetString(0));
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
            return resultAusgabenstelleListe;
        }

        public static int? GetIdByName(string? ausgabenstellename)
        {
			int? result = null;

            if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
            {
                DBConnection.GetConnection().Open();
            }

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select ausgabenstelle_id from {SCHEMA}.{TABLE} where ausgabenstelle_bezeichnung = :asn";
            command.Parameters.AddWithValue("asn", ausgabenstellename);
            NpgsqlDataReader reader = command.ExecuteReader();
            try
            {
                if (reader.Read())
                {
                    {
                        result = reader.GetInt32(0);
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
            return result;
        }

        public static List<Ausgabenstelle> GetList()
		{
			List<Ausgabenstelle> ausgabenstellenList = new List<Ausgabenstelle>();
			Ausgabenstelle ausgabenstelle = new Ausgabenstelle();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE}"; // WIP: order by?
			NpgsqlDataReader reader = command.ExecuteReader();

			try
			{
                while (reader.Read())
                {
                    ausgabenstellenList.Add(ausgabenstelle = new Ausgabenstelle(reader));
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

			return ausgabenstellenList;
		}
		#endregion
		//************************************************************************
		#region constructors#
		public Ausgabenstelle()
		{

		}

		public Ausgabenstelle(NpgsqlDataReader reader)
		{
			Ausgabenstelle_Id = reader.GetInt32(0);
			Adresse_Id = reader.IsDBNull(1) ? null : reader.GetInt32(1);
			AusgabenstelleBezeichnung = reader.IsDBNull(2) ? null : reader.GetString(2);
			AusgabenstelleAdresse = reader.IsDBNull(3) ? null : reader.GetString(3);
		}

		#endregion
		//************************************************************************
		#region 
		[JsonPropertyName("ausgabenstelle_id")]
		public int? Ausgabenstelle_Id { get; set; }

		[JsonPropertyName("adresse_id")]
		public int? Adresse_Id { get; set; }

		[JsonPropertyName("ausgabenstelle_bezeichnung")]

		public string? AusgabenstelleBezeichnung { get; set; }

		[JsonPropertyName("ausgabenstelle_adresse")]

		public string? AusgabenstelleAdresse { get; set; }

		[JsonPropertyName("anhaengerlist")]
		public List<Anhaenger>? AnhaengerList { get; set; } = null;

		[JsonPropertyName("kraftfahrzeuglist")]
		public List<Kraftfahrzeug>? KraftfahrzeugList { get; set; } = null;
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

			if (this.Ausgabenstelle_Id.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set adresse_id = :aid, ausgabenstelle_bezeichnung = :asb, ausgabenstelle_adresse = :asa where ausgabenstelle_id = :asid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.Ausgabenstelle_Id = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:asid, :aid, :asb, :asa);";
			}

			command.Parameters.AddWithValue("asid", this.Ausgabenstelle_Id);
			command.Parameters.AddWithValue("aid", this.Adresse_Id.HasValue ? (object)this.Adresse_Id.Value : (object)DBNull.Value);
			command.Parameters.AddWithValue("asb", String.IsNullOrEmpty(this.AusgabenstelleBezeichnung) ? (object)DBNull.Value : (object)this.AusgabenstelleBezeichnung);
			command.Parameters.AddWithValue("asa", String.IsNullOrEmpty(this.AusgabenstelleAdresse) ? (object)DBNull.Value : (object)this.AusgabenstelleAdresse);
			try
			{
				result = command.ExecuteNonQuery();
				if (result == 1)
				{
					if (this.AnhaengerList != null && this.AnhaengerList.Count > 0)
					{
						int anhaengerListeIterator = 0;
						foreach (Anhaenger anhaenger in this.AnhaengerList)
						{
							anhaenger.Ausgabenstelle_Id = this.Ausgabenstelle_Id;
							anhaengerListeIterator += anhaenger.Save();
						}

						if (anhaengerListeIterator == this.AnhaengerList.Count)
						{
							result = 1;
						}
						else
						{
							result = 0;
						}
					}

					if (this.KraftfahrzeugList != null && this.KraftfahrzeugList.Count > 0)
					{
						int kfzListeIterator = 0;
						//Kraftfahrzeug.Truncate();
						foreach (Kraftfahrzeug kraftfahrzeug in this.KraftfahrzeugList)
						{
							kraftfahrzeug.Ausgabenstelle_Id = this.Ausgabenstelle_Id;
							kfzListeIterator += kraftfahrzeug.Save();
						}
					}
					command.Connection.Open();
				}
				return result;
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
			// WIP: also deletes the address of the issuing office. Eventually bad solution?
			command.CommandText = $"delete from {SCHEMA}.tbl_adresse where ausgabenstelle_id = :asid";
			command.Parameters.AddWithValue("asid", this.Ausgabenstelle_Id);
			try
			{
				result = command.ExecuteNonQuery();
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
			}

			command.CommandText = $"delete from {SCHEMA}.{TABLE} where ausgabenstelle_id = :asid";
			command.Parameters.AddWithValue("asid", this.Ausgabenstelle_Id);
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
						command.CommandText += $"delete from {SCHEMA}.tbl_adresse where ausgabenstelle_id = :asid;";
						command.Parameters.AddWithValue("asid", entry);

						result += command.ExecuteNonQuery();
						command.Parameters.Clear();
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


				try
				{
					if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
					{
						command.Connection = DBConnection.GetConnection();
						command.Connection.Open();
					}

					foreach (int entry in listToDelete)
					{
						command.CommandText = $"delete from {SCHEMA}.{TABLE} where ausgabenstelle_id = :asid;";
						command.Parameters.AddWithValue("asid", entry);
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
	}
}
