using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VRentalsClasses.Interfaces;

namespace VRentalsClasses.Models
{
    public class Kraftfahrzeug: IMietgegenstand
    {
        //************************************************************************
        #region constants
        private const string SCHEMA = "rentals";
        private const string TABLE = "tbl_kraftfahrzeuge";
        private const string COLUMNS = "kraftfahrzeug_id, kategorie_id, name, preis_ek, preis_vk, packung, einheit, beschreibung, nummer, bild, letzter_einkauf";
        #endregion

        //************************************************************************
        #region static methods

        public static Kraftfahrzeug Get(int kraftfahrzeug_id)
        {
            DBConnection.GetConnection().Open();
            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} where kraftfahrzeug_id = :kfid";
            command.Parameters.AddWithValue("kfid", kraftfahrzeug_id);

            NpgsqlDataReader reader = command.ExecuteReader();
            Kraftfahrzeug kraftfahrzeug = null;
            if (reader.Read())
            {
                kraftfahrzeug = new Kraftfahrzeug();
                {

                };
            }
            reader.Close();
            DBConnection.GetConnection().Close();
            return kraftfahrzeug;
        }

        public static List<Kraftfahrzeug> GetList()
        {
            DBConnection.GetConnection().Open();
            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.GetConnection();
            command.CommandText = $"select {COLUMNS} from {SCHEMA}.{TABLE} order by name";
            NpgsqlDataReader reader = command.ExecuteReader();
            List<Kraftfahrzeug> result = new List<Kraftfahrzeug>();
            while (reader.Read())
            {
                result.Add(new Kraftfahrzeug()
                {
                    //WIP
                });
            }
            reader.Close();
            DBConnection.GetConnection().Close();
            return result;
        }
		#endregion

		//************************************************************************
		#region properties
		[JsonPropertyName("kraftfahrzeugid")]
		public int? KraftfahrzeugId { get; set; }

		[JsonPropertyName("art")]
		public string? Art { get; set; }

		[JsonPropertyName("mietpreis")]
		public int? MietPreis { get; set; }

		[JsonPropertyName("gegenstandzustand")]
		public GegenstandZustandTyp GegenstandZustand { get; set; } = GegenstandZustandTyp.frei;

		[JsonPropertyName("kategorie")]
		public string? Kategorie { get; set; }

		[JsonPropertyName("kostenliste")]
		public List<Ausgaben>? KostenListe { get; set; }

		[JsonPropertyName("schadenliste")]
		public List<Schaden>? SchadenListe { get; set; }

		[JsonIgnore()]
		public byte[]? BildBytes { get; set; }

		[JsonPropertyName("bildvorhanden")]
		public bool BildVorhanden
		{
			get
			{
				return BildBytes != null && BildBytes.Length > 0;
			}
			set
			{
				bool x = value;
			}
		}

		#endregion

		//************************************************************************
		#region public methods

		public int Save()
		{
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.Connection.Open();
			if (this.KraftfahrzeugId.HasValue)
			{
				command.CommandText = $"update {SCHEMA}.{TABLE} set kategorie_id = :kid, name = :name, preis_ek = :preisek, preis_vk = :preisvk, packung = :pkg, einheit = :eh, beschreibung = :beschreibung, nummer = :nr, bild = :bild, letzter_einkauf = :lek where artikel_id = :aid";
			}
			else
			{
				command.CommandText = $"select nextval('{SCHEMA}.{TABLE}_seq')";
				this.KraftfahrzeugId = (int)((long)command.ExecuteScalar());
				command.CommandText = $"insert into {SCHEMA}.{TABLE} ({COLUMNS}) values (:aid, :kid, :name, :preisek, :preisvk, :pkg, :eh, :beschreibung, :nr, :bild, :lek)";
			}

			command.Parameters.AddWithValue("aid", this.KraftfahrzeugId);
			// WIP
			try
			{
				return command.ExecuteNonQuery();
			}
			finally
			{
				command.Connection.Close();
			}
		}

		public int Delete()
		{
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.Connection.Open();
			command.CommandText = $"delete from {SCHEMA}.{TABLE} where artikel_id = :aid";
			command.Parameters.AddWithValue("aid", this.KraftfahrzeugId);
			try
			{
				return command.ExecuteNonQuery();
			}
			finally
			{
				command.Connection.Close();
			}
		}

		public override string ToString()
		{
			return this.Art;
		}

		public override int GetHashCode()
		{
			int result = 0;
			//result ^= this.Nummer.GetHashCode();
			result ^= this.Art.GetHashCode();
			//result ^= this.Beschreibung.GetHashCode();

			return result;
		}

		public void Refresh()
		{
			//this.BewegungList = Bewegung.GetList(this);
		}

		#endregion

	}
}
