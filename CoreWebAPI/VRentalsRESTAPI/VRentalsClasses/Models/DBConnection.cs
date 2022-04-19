using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Npgsql;
using System.Configuration;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Text.Json;
using System.Reflection;

namespace VRentalsClasses.Models
{
	public class DBConnection
	{


		public static string ReadConfiguration(string key, string defaultValue = null) => ReadConfiguration<string>(key, defaultValue);
		public static T ReadConfiguration<T>(string key, T defaultValue = default(T))
		{
			StreamReader reader = new StreamReader("appsettings.json", Encoding.UTF8);
			string json = reader.ReadToEnd();
			reader.Close();

			Type type = typeof(T);
			Type jeType = typeof(JsonElement);

			Dictionary<string, object> d = (Dictionary<string, object>)JsonSerializer.Deserialize(json, typeof(Dictionary<string, object>), new JsonSerializerOptions { ReadCommentHandling = JsonCommentHandling.Skip, AllowTrailingCommas = true });
			if (d.ContainsKey(key))
			{
				MethodInfo getMethod = jeType.GetMethods().SingleOrDefault<MethodInfo>(mi => mi.Name == $"Get{type.Name}");
				if (getMethod != null) return (T)getMethod.Invoke(d[key], null);
				else return JsonSerializer.Deserialize<T>(d[key].ToString());
			}
			else return defaultValue;
		}


		private static NpgsqlConnection connection = null;

		public static NpgsqlConnection GetConnection()
		{
			if (connection == null)
			{
				string connString = ReadConfiguration<string>("DBConnectionString", "User ID=vrentalsuser;Password=wifi;Host=localhost;Port=5432;Database=vrentals_db;");
				connection = new NpgsqlConnection(connString);
			}
			return connection;
		}



	}
}
