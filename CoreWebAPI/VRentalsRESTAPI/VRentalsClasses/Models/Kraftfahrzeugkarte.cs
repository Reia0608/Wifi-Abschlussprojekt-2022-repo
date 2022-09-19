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
	public class Kraftfahrzeugkarte
	{
		//************************************************************************
		#region constants
		private const string SCHEMA = "rentals";
		private const string TABLE_KFZ = "tbl_kraftfahrzeug";
		private const string TABLE_BILDER = "tbl_bilder";
		private const string COLUMNS_BILDER = "bilder_id, bild_bytes, bild_url, kraftfahrzeug_id, anhaenger_id, users_id, schaden_id";
		private const string COLUMNS_KFZ = "kraftfahrzeug_id, mietpreis, gegenstandzustand, kategorie, marke, modell, ausgabenstelle_id, aktueller_standort_id, kennzeichen, baujahr, klasse";

		#endregion

		//************************************************************************
		#region static methods

		public static Kraftfahrzeugkarte Get(int kraftfahrzeug_id)
		{
			Kraftfahrzeugkarte kraftfahrzeugkarte = null;

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select * from {SCHEMA}.car_list where kid = :kid";
			command.Parameters.AddWithValue("kid", kraftfahrzeug_id);
			NpgsqlDataReader reader = command.ExecuteReader();
			try
			{
				if (reader.Read())
				{
					kraftfahrzeugkarte = new Kraftfahrzeugkarte(reader);
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
			return kraftfahrzeugkarte;
		}

		public static List<Kraftfahrzeugkarte> GetList()
		{
			List<Kraftfahrzeugkarte> kraftfahrzeugkarteListe = new List<Kraftfahrzeugkarte>();
			Kraftfahrzeugkarte kraftfahrzeugkarte = new Kraftfahrzeugkarte();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select * from {SCHEMA}.car_list order by marke";
			NpgsqlDataReader reader = command.ExecuteReader();

			try
			{
                while (reader.Read())
                {
                    kraftfahrzeugkarteListe.Add(kraftfahrzeugkarte = new Kraftfahrzeugkarte(reader));
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

			return kraftfahrzeugkarteListe;
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
						command.CommandText = $"delete from {SCHEMA}.{TABLE_BILDER} where kraftfahrzeug_id = :kid;";
						command.Parameters.AddWithValue("kid", entry);
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
						command.CommandText = $"delete from {SCHEMA}.{TABLE_KFZ} where kraftfahrzeug_id = :kid;";
						command.Parameters.AddWithValue("kid", entry);
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
						command.CommandText = $"update {SCHEMA}.{TABLE_KFZ} set ausgabenstelle_id = :asid where kraftfahrzeug_id = :kid;";
						command.Parameters.AddWithValue("asid", ausgabenstelle_id);
						command.Parameters.AddWithValue("kid", entry);
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
						command.CommandText = $"update {SCHEMA}.{TABLE_KFZ} set ausgabenstelle_id = NULL where kraftfahrzeug_id = :kid;";
						command.Parameters.AddWithValue("kid", entry);
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

		public static List<Kraftfahrzeug> FilterBy(string by, string value)
		{
			List<Kraftfahrzeug> kraftfahrzeugList = new List<Kraftfahrzeug>();
			Kraftfahrzeug? kraftfahrzeug = new Kraftfahrzeug();
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
			command.CommandText = $"SELECT {COLUMNS_KFZ} FROM {SCHEMA}.{TABLE_KFZ} {Condition} order by marke";
			NpgsqlDataReader reader = command.ExecuteReader();

			try
			{
				while (reader.Read())
				{
					kraftfahrzeugList.Add(kraftfahrzeug = new Kraftfahrzeug(reader));
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
			return kraftfahrzeugList;
		}
		#endregion
		//************************************************************************
		#region constructors#
		public Kraftfahrzeugkarte()
		{

		}

		public Kraftfahrzeugkarte(NpgsqlDataReader reader)
		{
			KraftfahrzeugId = reader.GetInt32(0);
			MietPreis = reader.IsDBNull(1) ? null : reader.GetDouble(1);
			GegenstandZustand = reader.IsDBNull(2) ? GegenstandZustandTyp.frei : (GegenstandZustandTyp)reader.GetInt32(2);
			Kategorie = reader.IsDBNull(3) ? null : reader.GetString(3);
			AktuellerStandort = reader.IsDBNull(4) ? null : reader.GetInt32(4);
			Adresse_Id = reader.IsDBNull(5) ? null : reader.GetInt32(5); 
			Marke = reader.IsDBNull(6) ? null : reader.GetString(6);
			Modell = reader.IsDBNull(7) ? null : reader.GetString(7);
			Ausgabenstelle_Id = reader.IsDBNull(8) ? null : reader.GetInt32(8);
			Kennzeichen = reader.IsDBNull(9) ? null : reader.GetString(9);
			Baujahr = reader.IsDBNull(10) ? null : reader.GetInt32(10);
			Klasse = reader.IsDBNull(11) ? null : reader.GetString(11);
			BildBytes = reader.IsDBNull(12) ? null : (byte[])reader.GetValue(12);
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

		[JsonPropertyName("baujahr")]
		public int? Baujahr { get; set; }

		[JsonPropertyName("klasse")]
		public string? Klasse { get; set; }

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

			if (this.KraftfahrzeugId.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE_KFZ} set mietpreis = :mp, gegenstandzustand = :gz, kategorie = :k, marke = :ma, modell = :mo, ausgabenstelle_id = :asid, aktueller_standort_id = :aso, kennzeichen = :ken, baujahr = :bj, klasse = :kla where kraftfahrzeug_id = :kid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE_KFZ}_seq')";
				this.KraftfahrzeugId = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE_KFZ} ({COLUMNS_KFZ}) values (:kid, :mp, :gz, :k, :ma, :mo, :asid, :aso, :ken, :bj, :kla)";
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
			command.Parameters.AddWithValue("bj", this.Baujahr.HasValue ? (int)this.Baujahr : 9999);
			command.Parameters.AddWithValue("kla", String.IsNullOrEmpty(this.Klasse) ? (object)DBNull.Value : (object)this.Klasse);

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
