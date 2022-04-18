namespace VRentalsClasses
{
    public enum GeschlechtsTyp 
    { 
        unbekannt = 0,
        maskulin = 1, 
        feminin = 2, 
        divers = 3,
    }

    public interface IPerson
    {
        public int? UserId { get; set; }
        public string? Vorname { get; set; }

        public string? Nachname { get; set; }

        public GeschlechtsTyp Geschlecht { get; set; }

        public DateTime? Geburtsdatum { get; set; }

        public string? GeburtsOrt { get; set; }
    }
}