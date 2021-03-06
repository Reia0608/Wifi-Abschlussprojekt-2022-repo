-- #########################################################################
-- ####################### DATABASE vrentals_db ############################
-- #########################################################################

CREATE DATABASE vrentals_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

-- #########################################################################
-- ######################### ROLE vrentaluser ##############################
-- #########################################################################

CREATE ROLE vrentalsuser WITH
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1;

-- #########################################################################
-- ########################## SCHEMA rentals ###############################
-- #########################################################################

CREATE SCHEMA rentals
    AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA rentals TO vrentalsuser;
ALTER ROLE vrentalsuser
	PASSWORD 'wifi';

-- #########################################################################
-- ############################ TABLE users ################################
-- #########################################################################

CREATE TABLE rentals.tbl_users
(
    users_id NUMERIC NOT NULL,
    vorname character varying,
    nachname character varying,
    geschlecht integer,
    geburtsdatum date,
    geburtsort character varying,
    username character varying,
    passwort character varying,
    rolle integer,
    registrierungstag date,
    letzteanmeldung date,
	kontakt_id numeric,
	kundennummer numeric,
	istfahrer boolean,
	status integer,
	fuehrerscheinausstellungsdatum date,
	fuehrerscheinablaufdatum date,
	fuehrerscheinnummer character varying,
	
    PRIMARY KEY (users_id)
);

ALTER TABLE IF EXISTS rentals.tbl_users
    ADD COLUMN benutzermerkmal character varying;

ALTER TABLE IF EXISTS rentals.tbl_users
    ADD COLUMN merkmalgiltbis date;
	
ALTER TABLE IF EXISTS rentals.tbl_users
    ADD COLUMN bilder_id NUMERIC;

ALTER TABLE IF EXISTS rentals.tbl_users
    ALTER COLUMN istfahrer SET DEFAULT false;
	
ALTER TABLE IF EXISTS rentals.tbl_users
OWNER TO postgres;

CREATE SEQUENCE rentals.tbl_users_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_users_seq to vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_users TO vrentalsuser;

-- CREATE MATERIALIZED VIEW mvw_users
-- AS
-- SELECT users.users_id, to_tsvector(concat_ws(' ', users.vorname, users.nachname, users.geburtsort, users.username, kontakt.kategorie, kontakt.wert)) AS tsv_users
-- FROM rentals.tbl_users AS users
-- INNER JOIN rentals.tbl_kontakt AS kontakt ON kontakt.kontakt_id = users.users_id;

-- #########################################################################
-- ########################## TABLE kontakt ################################
-- #########################################################################

CREATE TABLE rentals.tbl_kontakt
(
    kontakt_id numeric NOT NULL,
    kategorie character varying,
    wert character varying
);

ALTER TABLE IF EXISTS rentals.tbl_kontakt
    OWNER to postgres;

ALTER TABLE rentals.tbl_kontakt
	ADD CONSTRAINT kontakt_pk PRIMARY KEY (kontakt_id);
	
CREATE SEQUENCE rentals.tbl_kontakt_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_kontakt_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_kontakt TO vrentalsuser;

-- #########################################################################
-- ###################### TABLE kraftfahrzeug #############################
-- #########################################################################

CREATE TABLE rentals.tbl_kraftfahrzeug
(
    kraftfahrzeug_id numeric(10) NOT NULL,
    mietpreis double precision,
    gegenstandzustand integer,
    kategorie character varying(50),
	marke character varying,
	modell character varying,
	ausgabenstelle_id numeric,
	kennzeichen character varying,
	baujahr numeric,
	klasse character varying
	-- bilder liste
	-- standortliste
	--aktuellerstandort
);

ALTER TABLE IF EXISTS rentals.tbl_kraftfahrzeug
	OWNER TO postgres;
	
ALTER TABLE IF EXISTS rentals.tbl_kraftfahrzeug
	ADD CONSTRAINT kraftfahrzeuge_pk PRIMARY KEY (kraftfahrzeug_id);

ALTER TABLE IF EXISTS rentals.tbl_kraftfahrzeug
    ADD COLUMN bilder_id NUMERIC;
	
ALTER TABLE IF EXISTS rentals.tbl_kraftfahrzeug
    ADD COLUMN aktueller_standort_id numeric;

ALTER TABLE IF EXISTS rentals.tbl_kraftfahrzeug
    ADD COLUMN adresse_id numeric;

CREATE SEQUENCE rentals.tbl_kraftfahrzeug_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_kraftfahrzeug_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_kraftfahrzeug TO vrentalsuser;


-- #########################################################################
-- ############################ TABLE ausgaben #############################
-- #########################################################################


CREATE TABLE rentals.tbl_ausgaben
(
    ausgaben_id numeric(10) NOT NULL,
    kosten_art character varying,
    kosten double precision
);

ALTER TABLE IF EXISTS rentals.tbl_ausgaben
    OWNER TO postgres;

ALTER TABLE rentals.tbl_ausgaben
	ADD CONSTRAINT ausgaben_pk PRIMARY KEY (ausgaben_id);

CREATE SEQUENCE rentals.tbl_ausgaben_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_ausgaben_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_ausgaben TO vrentalsuser;


-- #########################################################################
-- ##################### TABLE kraftfahrzeuge_ausgaben #####################
-- #########################################################################

CREATE TABLE rentals.tbl_kraftfahrzeug_ausgaben
(
    kraftfahrzeug_id numeric(10) NOT NULL,
    ausgaben_id numeric(10) NOT NULL
);

ALTER TABLE IF EXISTS rentals.tbl_kraftfahrzeug_ausgaben
    OWNER TO postgres;
	
ALTER TABLE rentals.tbl_kraftfahrzeug_ausgaben
	ADD CONSTRAINT kraftfahrzeuge_ausgaben_pk PRIMARY KEY (kraftfahrzeug_id, ausgaben_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_kraftfahrzeug_ausgaben TO vrentalsuser;


-- #########################################################################
-- ############################ TABLE schaden ##############################
-- #########################################################################

CREATE TABLE rentals.tbl_schaden
(
    schaden_id numeric(10) NOT NULL,
    schadensart character varying,
    beschreibung text,
    anfallendekosten double precision,
	schaden_datum date,
	kraftfahrzeug_id numeric,
	anhaenger_id numeric
);

ALTER TABLE IF EXISTS rentals.tbl_schaden
    ADD COLUMN bilder_id NUMERIC;

ALTER TABLE IF EXISTS rentals.tbl_schaden
    OWNER to postgres;
	
ALTER TABLE rentals.tbl_schaden
	ADD CONSTRAINT schaden_pk PRIMARY KEY (schaden_id);

CREATE SEQUENCE rentals.tbl_schaden_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_schaden_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_schaden TO vrentalsuser;

-- #########################################################################
-- ######################## TABLE ausgabenstelle ###########################
-- #########################################################################

CREATE TABLE rentals.tbl_ausgabenstelle
(
    ausgabenstelle_id numeric NOT NULL,
    adresse_id numeric,
	ausgabenstelle_bezeichnung character varying,
	ausgabenstelle_adresse character varying
);

ALTER TABLE rentals.tbl_ausgabenstelle
	ADD CONSTRAINT ausgabenstelle_pk PRIMARY KEY (ausgabenstelle_id);

CREATE SEQUENCE rentals.tbl_ausgabenstelle_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_ausgabenstelle_seq TO vrentalsuser;

ALTER TABLE IF EXISTS rentals.tbl_ausgabenstelle
    OWNER to postgres;
	
GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_ausgabenstelle TO vrentalsuser;
	
-- #########################################################################
-- ########################## TABLE anhaenger ##############################
-- #########################################################################

CREATE TABLE rentals.tbl_anhaenger
(
    anhaenger_id numeric NOT NULL,
    aktueller_standort_id numeric,
    ausgaben_id numeric,
    schaden_id numeric,
    art character varying,
    gegenstandzustand integer,
    kategorie character varying,
    bilder_id numeric,
    adresse_id numeric,
	marke character varying,
	modell character varying,
	mietpreis DOUBLE PRECISION,
	ausgabenstelle_id numeric
);

ALTER TABLE rentals.tbl_anhaenger
	ADD CONSTRAINT anhaenger_pk PRIMARY KEY (anhaenger_id);

CREATE SEQUENCE rentals.tbl_anhaenger_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_anhaenger_seq TO vrentalsuser;

ALTER TABLE IF EXISTS rentals.tbl_anhaenger
    OWNER to postgres;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_anhaenger TO vrentalsuser;
	
-- #########################################################################
-- ############################ TABLE adresse ##############################
-- #########################################################################

	CREATE TABLE rentals.tbl_adresse
(
    adresse_id NUMERIC,
    bezeichnung character varying,
    land character varying,
    stadt_ort character varying,
    plz character varying,
    strasse character varying,
    strassennummer character varying,
	anhaenger_id NUMERIC,
	kraftfahrzeug_id NUMERIC,
	ausgabenstelle_id NUMERIC,
	users_id NUMERIC
);

ALTER TABLE rentals.tbl_adresse
	ADD CONSTRAINT adresse_pk PRIMARY KEY (adresse_id);

CREATE SEQUENCE rentals.tbl_adresse_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_adresse_seq TO vrentalsuser;

ALTER TABLE IF EXISTS rentals.tbl_adresse
    OWNER to postgres;
	
GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_adresse TO vrentalsuser;
	
-- #########################################################################
-- ############################# TABLE bilder ##############################
-- #########################################################################
	
CREATE TABLE rentals.tbl_bilder
(
    bilder_id numeric(10) NOT NULL,
    bild_bytes bytea,
	kraftfahrzeug_id numeric,
	anhaenger_id numeric,
	users_id numeric,
	schaden_id numeric
);

ALTER TABLE IF EXISTS rentals.tbl_bilder
    ADD COLUMN bild_url character varying;

ALTER TABLE IF EXISTS rentals.tbl_bilder
    OWNER to postgres;
	
ALTER TABLE rentals.tbl_bilder
	ADD CONSTRAINT bilder_pk PRIMARY KEY (bilder_id);

CREATE SEQUENCE rentals.tbl_bilder_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_bilder_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_bilder TO vrentalsuser;

-- #########################################################################
-- ############################ TABLE bewegung #############################
-- #########################################################################

CREATE TABLE rentals.tbl_bewegung
(
    bewegung_id numeric NOT NULL,
    users_id numeric,
    bewegungsdatum date,
    beschreibung text,
    grund text,
	mietgegenstand_id numeric
);

ALTER TABLE IF EXISTS rentals.tbl_bewegung
    OWNER to postgres;
	
ALTER TABLE rentals.tbl_bewegung
	ADD CONSTRAINT bewegung_pk PRIMARY KEY (bewegung_id);
	
CREATE SEQUENCE rentals.tbl_bewegung_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_bewegung_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_bewegung TO vrentalsuser;

-- #########################################################################
-- ######################### TABLE mietgegenstand ##########################
-- #########################################################################

CREATE TABLE rentals.tbl_mietgegenstand
(
    mietgegenstand_id numeric NOT NULL,
    anhaenger_id numeric,
    kraftfahrzeug_id numeric
);

ALTER TABLE IF EXISTS rentals.tbl_mietgegenstand
    OWNER to postgres;
	
ALTER TABLE rentals.tbl_mietgegenstand
	ADD CONSTRAINT mietgegenstand_pk PRIMARY KEY (mietgegenstand_id);
	
CREATE SEQUENCE rentals.tbl_mietgegenstand_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_mietgegenstand_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_mietgegenstand TO vrentalsuser;

-- ######################################################################################
-- ############################# TABLE fuehrerscheinklasse ##############################
-- ######################################################################################

CREATE TABLE rentals.tbl_fuehrerscheinklasse
(
    fuehrerscheinklasse_id numeric NOT NULL,
    fuehrerscheinklasse character varying,
    beschreibung text,
    gewicht numeric,
    raederanzahl numeric,
    sitzplaetze numeric,
    gesamtmasse numeric,
    geschwindigkeit numeric,
    motorleistung numeric,
    users_id numeric
);

ALTER TABLE IF EXISTS rentals.tbl_fuehrerscheinklasse
    OWNER TO postgres;

ALTER TABLE rentals.tbl_fuehrerscheinklasse
	ADD CONSTRAINT fuehrerscheinklasse_pk PRIMARY KEY (fuehrerscheinklasse_id);
	
CREATE SEQUENCE rentals.tbl_fuehrerscheinklasse_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_fuehrerscheinklasse_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_mietgegenstand TO vrentalsuser;

-- ######################################################################
-- ############################# TABLE fsk ##############################
-- ######################################################################

CREATE TABLE rentals.tbl_fsk
(
    fsk_id serial NOT NULL,
    users_id numeric,
    am boolean,
    a1 boolean,
    a2 boolean,
    a boolean,
    b1 boolean,
    b boolean,
    c1 boolean,
    c boolean,
    d1 boolean,
    d boolean,
    be boolean,
    c1e boolean,
    ce boolean,
    d1e boolean,
    de boolean,
    f boolean
);

ALTER TABLE IF EXISTS rentals.tbl_fsk
    OWNER to postgres;

ALTER TABLE rentals.tbl_fsk
	ADD CONSTRAINT fsk_pk PRIMARY KEY (fsk_id);
	
-- CREATE SEQUENCE rentals.tbl_fsk_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_fsk_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_fsk TO vrentalsuser;

-- #########################################################################
-- ############################# FOREIGN KEYS ##############################
-- #########################################################################

ALTER TABLE rentals.tbl_users 
	ADD CONSTRAINT users_bilder_fk FOREIGN KEY (bilder_id) REFERENCES rentals.tbl_bilder (bilder_id);

ALTER TABLE rentals.tbl_schaden 
	ADD CONSTRAINT schaden_bilder_fk FOREIGN KEY (bilder_id) REFERENCES rentals.tbl_bilder (bilder_id);

ALTER TABLE rentals.tbl_anhaenger 
	ADD CONSTRAINT anhaenger_adresse_fk FOREIGN KEY (adresse_id) REFERENCES rentals.tbl_adresse (adresse_id);

-- Note: habe aus Versehen einen foreign key namens anhaenger_adresse_fk in der Tabelle tbl_ausgabenstelle angelegt. Habe es mit forlgender Command wieder gel??scht:
--ALTER TABLE rentals.tbl_ausgabenstelle
--DROP CONSTRAINT anhaenger_adresse_fk;

-- VORSICHT! Schlechter Name aktueller_standort_fk sollte anhaenger_adresse_fk heissen!

ALTER TABLE rentals.tbl_anhaenger 
	ADD CONSTRAINT aktueller_standort_fk FOREIGN KEY (aktueller_standort_id) REFERENCES rentals.tbl_adresse (adresse_id);

ALTER TABLE rentals.tbl_anhaenger 
	ADD CONSTRAINT anhaenger_ausgaben_fk FOREIGN KEY (ausgaben_id) REFERENCES rentals.tbl_ausgaben (ausgaben_id);

ALTER TABLE rentals.tbl_anhaenger 
	ADD CONSTRAINT anhaenger_schaden_fk FOREIGN KEY (schaden_id) REFERENCES rentals.tbl_schaden (schaden_id);

ALTER TABLE rentals.tbl_anhaenger 
	ADD CONSTRAINT anhaenger_bilder_fk FOREIGN KEY (bilder_id) REFERENCES rentals.tbl_bilder (bilder_id);

ALTER TABLE rentals.tbl_kraftfahrzeug
	ADD CONSTRAINT kraftfahrzeuge_adresse_fk FOREIGN KEY (adresse_id) REFERENCES rentals.tbl_adresse (adresse_id);
	
ALTER TABLE rentals.tbl_kraftfahrzeug
	ADD CONSTRAINT kraftfahrzeuge_ausgabenstelle_fk FOREIGN KEY (ausgabenstelle_id) REFERENCES rentals.tbl_ausgabenstelle (ausgabenstelle_id);
	
ALTER TABLE rentals.tbl_anhaenger
	ADD CONSTRAINT anhaenger_ausgabenstelle_fk FOREIGN KEY (ausgabenstelle_id) REFERENCES rentals.tbl_ausgabenstelle (ausgabenstelle_id);
	
ALTER TABLE rentals.tbl_kraftfahrzeug
	ADD CONSTRAINT aktueller_kfz_standort_fk FOREIGN KEY (aktueller_standort_id) REFERENCES rentals.tbl_adresse (adresse_id);

ALTER TABLE rentals.tbl_kraftfahrzeug
	ADD CONSTRAINT kraftfahrzeuge_bilder_fk FOREIGN KEY (bilder_id) REFERENCES rentals.tbl_bilder (bilder_id);

ALTER TABLE rentals.tbl_kraftfahrzeug_ausgaben 
	ADD CONSTRAINT kraftfahrzeugeausgaben_ausgaben_fk FOREIGN KEY (ausgaben_id) REFERENCES rentals.tbl_ausgaben (ausgaben_id);
	
ALTER TABLE rentals.tbl_kraftfahrzeug_ausgaben 
	ADD CONSTRAINT kraftfahrzeugeausgaben_fahrzeug_fk FOREIGN KEY (kraftfahrzeug_id) REFERENCES rentals.tbl_kraftfahrzeug (kraftfahrzeug_id);

ALTER TABLE rentals.tbl_mietgegenstand
	ADD CONSTRAINT mietgegenstand_anhaenger_fk FOREIGN KEY (anhaenger_id) REFERENCES rentals.tbl_anhaenger (anhaenger_id);
	
ALTER TABLE rentals.tbl_mietgegenstand
	ADD CONSTRAINT mietgegenstand_kraftfahrzeug_fk FOREIGN KEY (kraftfahrzeug_id) REFERENCES rentals.tbl_kraftfahrzeug (kraftfahrzeug_id);

ALTER TABLE rentals.tbl_bewegung
	ADD CONSTRAINT bewegung_mietgegenstand_fk FOREIGN KEY (mietgegenstand_id) REFERENCES rentals.tbl_mietgegenstand (mietgegenstand_id);
	
ALTER TABLE rentals.tbl_users
	ADD CONSTRAINT users_kontakt_fk FOREIGN KEY (kontakt_id) REFERENCES rentals.tbl_kontakt (kontakt_id);
	
ALTER TABLE rentals.tbl_schaden
	ADD CONSTRAINT schaden_kraftfahrzeug_fk FOREIGN KEY (kraftfahrzeug_id) REFERENCES rentals.tbl_kraftfahrzeug (kraftfahrzeug_id);
	
ALTER TABLE rentals.tbl_schaden
	ADD CONSTRAINT schaden_anhaenger_fk FOREIGN KEY (anhaenger_id) REFERENCES rentals.tbl_anhaenger (anhaenger_id);
	
ALTER TABLE rentals.tbl_bilder
	ADD CONSTRAINT bilder_kraftfahrzeug_fk FOREIGN KEY (kraftfahrzeug_id) REFERENCES rentals.tbl_kraftfahrzeug (kraftfahrzeug_id);
	
ALTER TABLE rentals.tbl_bilder
	ADD CONSTRAINT bilder_anhaenger_fk FOREIGN KEY (anhaenger_id) REFERENCES rentals.tbl_anhaenger (anhaenger_id);
	
ALTER TABLE rentals.tbl_bilder
	ADD CONSTRAINT bilder_users_fk FOREIGN KEY (users_id) REFERENCES rentals.tbl_users (users_id);
	
ALTER TABLE rentals.tbl_bilder
	ADD CONSTRAINT bilder_schaden_fk FOREIGN KEY (schaden_id) REFERENCES rentals.tbl_schaden (schaden_id);
	
ALTER TABLE rentals.tbl_adresse
	ADD CONSTRAINT adresse_users_fk FOREIGN KEY (users_id) REFERENCES rentals.tbl_users (users_id);
	
ALTER TABLE rentals.tbl_adresse
	ADD CONSTRAINT adresse_anhaenger_fk FOREIGN KEY (anhaenger_id) REFERENCES rentals.tbl_anhaenger (anhaenger_id);
	
ALTER TABLE rentals.tbl_adresse
	ADD CONSTRAINT adresse_kraftfahrzeug_fk FOREIGN KEY (kraftfahrzeug_id) REFERENCES rentals.tbl_kraftfahrzeug (kraftfahrzeug_id);
	
ALTER TABLE rentals.tbl_adresse
	ADD CONSTRAINT adresse_ausgabenstelle_fk FOREIGN KEY (ausgabenstelle_id) REFERENCES rentals.tbl_ausgabenstelle (ausgabenstelle_id);
	
ALTER TABLE rentals.tbl_fuehrerscheinklasse
	ADD CONSTRAINT users_fuehrerscheinklasse_fk FOREIGN KEY (users_id) REFERENCES rentals.tbl_users (users_id);
	
ALTER TABLE rentals.tbl_fsk
	ADD CONSTRAINT users_fsk_fk FOREIGN KEY (users_id) REFERENCES rentals.tbl_users (users_id);
	
-- ##################################################################
-- ############################# VIEWS ##############################
-- ##################################################################

CREATE VIEW rentals.staff_list AS 
SELECT
tbl_users.users_id AS uid,
tbl_users.vorname,
tbl_users.nachname,
tbl_users.username,
tbl_users.istfahrer,
tbl_users.status,
tbl_users.rolle,
tbl_fsk.am,
tbl_fsk.a1,
tbl_fsk.a2,
tbl_fsk.a,
tbl_fsk.b1,
tbl_fsk.b,
tbl_fsk.c1,
tbl_fsk.c,
tbl_fsk.d1,
tbl_fsk.d,
tbl_fsk.be,
tbl_fsk.c1e,
tbl_fsk.ce,
tbl_fsk.d1e,
tbl_fsk.de,
tbl_fsk.f
FROM rentals.tbl_users
LEFT JOIN rentals.tbl_fsk USING (users_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.staff_list TO vrentalsuser;


CREATE VIEW rentals.car_list AS 
SELECT
tbl_kraftfahrzeug.kraftfahrzeug_id AS kid,
tbl_kraftfahrzeug.mietpreis,
tbl_kraftfahrzeug.gegenstandzustand,
tbl_kraftfahrzeug.kategorie,
tbl_kraftfahrzeug.aktueller_standort_id,
tbl_kraftfahrzeug.adresse_id,
tbl_kraftfahrzeug.marke,
tbl_kraftfahrzeug.modell,
tbl_kraftfahrzeug.ausgabenstelle_id,
tbl_kraftfahrzeug.kennzeichen,
tbl_kraftfahrzeug.baujahr,
tbl_kraftfahrzeug.klasse,
tbl_bilder.bild_bytes

FROM rentals.tbl_kraftfahrzeug
LEFT JOIN rentals.tbl_bilder USING (kraftfahrzeug_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.car_list TO vrentalsuser;