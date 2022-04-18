namespace VRentalsClasses
{
	public enum RollenTyp 
	{
		Kunde = 0,
		Admin = 1,
		User = 2,
	}

	public interface ILoginData
    {
		public string? UserName { get; set; }

		public string? Passwort { get; set; }

		public string? PasswortHash { get; set; }

		public RollenTyp Rolle { get; set; }

		public DateTime? RegistrierungsTag { get; set; }

		public DateTime? LetzteAnmeldung { get; set; }

		public string? BenutzerMerkmal { get; set; }

		public DateTime? MerkmalGiltBis { get; set; }
	}
}