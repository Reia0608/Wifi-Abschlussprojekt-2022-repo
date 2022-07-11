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
	public class Personal
	{
		//************************************************************************
		#region static methods

		public static List<Personal> GetStaffList()
		{
			List<Personal> personalList = new List<Personal>();
			Personal? personal = new Personal();
			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"SELECT * FROM rentals.staff_list where rolle = :rl order by vorname, vorname";
			command.Parameters.AddWithValue("rl", 2);
			NpgsqlDataReader reader = command.ExecuteReader();

			try
			{
				while (reader.Read())
				{
					personalList.Add(personal = new Personal(reader));
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
			return personalList;
		}

		public static List<Personal> FilterBy(string by, string value)
		{
			List<Personal> personalList = new List<Personal>();
			Personal? personal = new Personal();
			string Condition = "";

			if (by == "status")
            {
				int convertedValue = StatusConverter(value);
				Condition = $"WHERE {by} = {convertedValue} AND (rolle = 2 OR rolle = 1)"; // WIP: does this condition mess up the filter?
			}
			else if (by == "rolle")
            {
				int convertedValue = RolleConverter(value);
				Condition = $"WHERE {by} = {convertedValue} AND (rolle = 2 OR rolle = 1)";
			}
			else if (by == "fsk")
			{
				Condition = $"WHERE {value} = true AND (rolle = 2 OR rolle = 1)";
			}
			else
            {
				Condition = $"WHERE {by} = {value} AND (rolle = 2 OR rolle = 1)";
			}

			if (DBConnection.GetConnection().FullState == System.Data.ConnectionState.Closed)
			{
				DBConnection.GetConnection().Open();
			}
			NpgsqlCommand command = new NpgsqlCommand();
			command.Connection = DBConnection.GetConnection();
			command.CommandText = $"SELECT * FROM rentals.staff_list {Condition} order by vorname, vorname";
			command.Parameters.AddWithValue("rl", 2);
			NpgsqlDataReader reader = command.ExecuteReader();

			try
			{
				while (reader.Read())
				{
					personalList.Add(personal = new Personal(reader));
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
			return personalList;
		}

		public static int StatusConverter(string toConvert)
		{
			int result = 0;
			switch (toConvert)
			{
				case "unbekannt":
					result = 0;
					break;
				case "frei":
					result = 1;
					break;
				case "termin":
					result = 2;
					break;
				case "krank":
					result = 3;
					break;
				case "urlaub":
					result = 4;
					break;
				case "keinFahrer":
					result = 5;
					break;
				default:
					result = 0;
					break;
			}

			return result;
		}

		public static int RolleConverter(string toConvert)
        {
			int result = 0;
			switch (toConvert)
			{
				case "Kunde":
					result = 0;
					break;
				case "Admin":
					result = 1;
					break;
				case "User":
					result = 2;
					break;
				default:
					result = 0;
					break;
			}

			return result;
		}
		#endregion

		//************************************************************************

		#region constructors
		public Personal()
		{

		}

		public Personal(NpgsqlDataReader reader)
		{
			UserId = reader.GetInt32(0);
			Vorname = reader.IsDBNull(1) ? null : reader.GetString(1);
			Nachname = reader.IsDBNull(2) ? null : reader.GetString(2);
			UserName = reader.IsDBNull(3) ? null : reader.GetString(3);
			IstFahrer = reader.IsDBNull(4) ? false : reader.GetBoolean(4);
			Status = reader.IsDBNull(5) ? FahrerStatus.unbekannt : (FahrerStatus)reader.GetInt32(5);
			Rolle = reader.IsDBNull(6) ? RollenTyp.Kunde : (RollenTyp)reader.GetInt32(6);
			AM = reader.IsDBNull(7) ? false : reader.GetBoolean(7);
			A1 = reader.IsDBNull(8) ? false : reader.GetBoolean(8);
			A2 = reader.IsDBNull(9) ? false : reader.GetBoolean(9);
			A = reader.IsDBNull(10) ? false : reader.GetBoolean(10);
			B1 = reader.IsDBNull(11) ? false : reader.GetBoolean(11);
			B = reader.IsDBNull(12) ? false : reader.GetBoolean(12);
			C1 = reader.IsDBNull(13) ? false : reader.GetBoolean(13);
			C = reader.IsDBNull(14) ? false : reader.GetBoolean(14);
			D1 = reader.IsDBNull(15) ? false : reader.GetBoolean(15);
			D = reader.IsDBNull(16) ? false : reader.GetBoolean(16);
			BE = reader.IsDBNull(17) ? false : reader.GetBoolean(17);
			C1E = reader.IsDBNull(18) ? false : reader.GetBoolean(18);
			CE = reader.IsDBNull(19) ? false : reader.GetBoolean(19);
			D1E = reader.IsDBNull(20) ? false : reader.GetBoolean(20);
			DE = reader.IsDBNull(21) ? false : reader.GetBoolean(21);
			F = reader.IsDBNull(22) ? false : reader.GetBoolean(22);
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

		[JsonPropertyName("username")]
		public string? UserName { get; set; }

		[JsonPropertyName("istfahrer")]
		public bool IstFahrer { get; set; } = false;

		[JsonPropertyName("rolle")]
		public RollenTyp Rolle { get; set; }

		[JsonPropertyName("status")]
		public FahrerStatus Status { get; set; } = FahrerStatus.unbekannt;

		[JsonPropertyName("am")]
		public bool? AM { get; set; }

		[JsonPropertyName("a1")]
		public bool? A1 { get; set; }

		[JsonPropertyName("a2")]
		public bool? A2 { get; set; }

		[JsonPropertyName("a")]
		public bool? A { get; set; }

		[JsonPropertyName("b1")]
		public bool? B1 { get; set; }

		[JsonPropertyName("b")]
		public bool? B { get; set; }

		[JsonPropertyName("c1")]
		public bool? C1 { get; set; }

		[JsonPropertyName("c")]
		public bool? C { get; set; }

		[JsonPropertyName("d1")]
		public bool? D1 { get; set; }

		[JsonPropertyName("d")]
		public bool? D { get; set; }

		[JsonPropertyName("be")]
		public bool? BE { get; set; }

		[JsonPropertyName("c1e")]
		public bool? C1E { get; set; }

		[JsonPropertyName("ce")]
		public bool? CE { get; set; }

		[JsonPropertyName("d1e")]
		public bool? D1E { get; set; }

		[JsonPropertyName("de")]
		public bool? DE { get; set; }

		[JsonPropertyName("f")]
		public bool? F { get; set; }

		#endregion

		//************************************************************************

		
	}
}
