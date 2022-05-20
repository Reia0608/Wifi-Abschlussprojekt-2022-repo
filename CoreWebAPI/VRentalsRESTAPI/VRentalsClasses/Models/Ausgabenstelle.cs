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
		private const string COLUMNS = "ausgabenstelle_id, anhaenger_id";
		#endregion

		//************************************************************************
		#region static methods
		// WIP: if anhaenger_id does not exist in the db, creates a new entry with null values!
		public static Ausgabenstelle Get(int ausgabenstelle_id)
		{
			Ausgabenstelle ausgabenstelle = new Ausgabenstelle();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}

			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where ausgabenstelle_id = :aid";
			command.Parameters.AddWithValue("aid", ausgabenstelle_id);
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

		public static List<Ausgabenstelle> GetList()
		{
			List<Ausgabenstelle> ausgabenstelleListe = new List<Ausgabenstelle>();
			Ausgabenstelle ausgabenstelle = new Ausgabenstelle();

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE}"; // WIP: order by?
			NpgsqlDataReader reader = command.ExecuteReader();

			while (reader.Read())
			{
				ausgabenstelleListe.Add(ausgabenstelle = new Ausgabenstelle(reader));
			}
			reader.Close();
			DBConnection.GetConnection().Close();
			return ausgabenstelleListe;
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
		}

		#endregion
		//************************************************************************
		#region 
		[JsonPropertyName("ausgabenstelle_id")]
		public int? Ausgabenstelle_Id { get; set; }

		[JsonPropertyName("adresse_id")]
		public int? Adresse_Id { get; set; }

		[JsonPropertyName("anhaengerliste")]
		public List<Anhaenger>? AnhaengerListe { get; set; } = null;

		[JsonPropertyName("kraftfahrzeugliste")]
		public List<Kraftfahrzeug>? KraftfahrzeugListe { get; set; } = null;
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
				command.CommandText = $"update {SCHEMA}.{TABLE} set adresse_id = :aid where ausgabenstelle_id = :asid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.Adresse_Id = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:asid, :aid)";
			}

			command.Parameters.AddWithValue("asid", this.Ausgabenstelle_Id);
			command.Parameters.AddWithValue("aid", this.Adresse_Id.HasValue ? (object)this.Adresse_Id.Value : (object)DBNull.Value);
			try
			{
				result = command.ExecuteNonQuery();
				if (result == 1)
				{
					if (this.AnhaengerListe != null && this.AnhaengerListe.Count > 0)
					{
						int anhaengerListeIterator = 0;
						foreach (Anhaenger anhaenger in this.AnhaengerListe)
						{
							anhaenger.Ausgabenstelle_Id = this.Ausgabenstelle_Id;
							anhaengerListeIterator += anhaenger.Save();
						}

						if (anhaengerListeIterator == this.AnhaengerListe.Count)
						{
							result = 1;
						}
						else
						{
							result = 0;
						}
					}

					if (this.KraftfahrzeugListe != null && this.KraftfahrzeugListe.Count > 0)
					{
						int kfzListeIterator = 0;
						//Kraftfahrzeug.Truncate();
						foreach (Kraftfahrzeug kraftfahrzeug in this.KraftfahrzeugListe)
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

		public int Save(int id)
		{
			int result = -1;
			NpgsqlCommand command = new NpgsqlCommand();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				command.Connection = DBConnection.GetConnection();
				command.Connection.Open();
			}

			command.CommandText = $"update {SCHEMA}.{TABLE} set adresse_id = :aid where ausgabenstelle_id = :asid";
			//WIP: WARNING! Potential security danger! User could change the id to what he wants
			command.Parameters.AddWithValue("asid", id);
			command.Parameters.AddWithValue("aid", this.Adresse_Id.HasValue ? (object)this.Adresse_Id.Value : (object)DBNull.Value);
			try
			{
				result = command.ExecuteNonQuery();
				if (result == 1)
				{
					if (this.AnhaengerListe != null && this.AnhaengerListe.Count > 0)
					{
						int anhaengerListeIterator = 0;
						foreach (Anhaenger anhaenger in this.AnhaengerListe)
						{
							anhaenger.Ausgabenstelle_Id = this.Ausgabenstelle_Id;
							anhaengerListeIterator += anhaenger.Save();
						}

						if (anhaengerListeIterator == this.AnhaengerListe.Count)
						{
							result = 1;
						}
						else
						{
							result = 0;
						}
					}

					if (this.KraftfahrzeugListe != null && this.KraftfahrzeugListe.Count > 0)
					{
						int kfzListeIterator = 0;
						//Kraftfahrzeug.Truncate();
						foreach (Kraftfahrzeug kraftfahrzeug in this.KraftfahrzeugListe)
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
    }
}
