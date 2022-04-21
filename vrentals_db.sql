CREATE ROLE vrentalsuser WITH
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1;

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
    pk_users serial NOT NULL,
    vorname character varying,
    nachname character varying,
    geschlecht integer,
    geburtsdatum date,
    geburtsort character varying,
    username character varying,
    passwort character varying,
    rolle integer,
    fk_users_kontaktliste bit,
    registrierungstag date,
    letzteanmeldung date,
    PRIMARY KEY (pk_users)
);

ALTER TABLE IF EXISTS rentals.tbl_users
    ADD COLUMN benutzermerkmal character varying;

ALTER TABLE IF EXISTS rentals.tbl_users
    ADD COLUMN merkmalgiltbis date;
	
ALTER TABLE IF EXISTS rentals.tbl_users
OWNER TO postgres;

CREATE SEQUENCE rentals.tbl_users_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_users_seq to vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_users TO vrentalsuser;


-- #########################################################################
-- ###################### TABLE kraftfahrzeuge #############################
-- #########################################################################

CREATE TABLE rentals.tbl_kraftfahrzeuge
(
    kraftfahrzeuge_id numeric(10) NOT NULL,
    mietpreis double precision,
    gegenstandzustand integer,
    kategorie character varying(50)
	-- bilder liste
	-- standortliste
	--aktuellerstandort
);

ALTER TABLE IF EXISTS rentals.tbl_kraftfahrzeuge
OWNER TO postgres;
	
ALTER TABLE IF EXISTS rentals.tbl_kraftfahrzeuge
ADD CONSTRAINT kraftfahrzeuge_pk PRIMARY KEY (kraftfahrzeuge_id);

CREATE SEQUENCE rentals.tbl_kraftfahrzeuge_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_kraftfahrzeuge_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_kraftfahrzeuge TO vrentalsuser;


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

CREATE TABLE rentals.tbl_kraftfahrzeuge_ausgaben
(
    kraftfahrzeuge_id numeric(10) NOT NULL,
    ausgaben_id numeric(10) NOT NULL
);

ALTER TABLE IF EXISTS rentals.tbl_kraftfahrzeuge_ausgaben
    OWNER TO postgres;
	
ALTER TABLE rentals.tbl_kraftfahrzeuge_ausgaben
ADD CONSTRAINT kraftfahrzeuge_ausgaben_pk PRIMARY KEY (kraftfahrzeuge_id, ausgaben_id);

ALTER TABLE rentals.tbl_kraftfahrzeuge_ausgaben ADD CONSTRAINT kraftfahrzeugeausgaben_ausgaben_fk FOREIGN KEY (ausgaben_id) REFERENCES rentals.tbl_ausgaben (ausgaben_id);
ALTER TABLE rentals.tbl_kraftfahrzeuge_ausgaben ADD CONSTRAINT kraftfahrzeugeausgaben_fahrzeuge_fk FOREIGN KEY (kraftfahrzeuge_id) REFERENCES rentals.tbl_kraftfahrzeuge (kraftfahrzeuge_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_kraftfahrzeuge_ausgaben TO vrentalsuser;


-- #########################################################################
-- ############################ TABLE schaden ##############################
-- #########################################################################

CREATE TABLE rentals.tbl_schaden
(
    schaden_id numeric(10) NOT NULL,
    schadensart character varying,
    beschreibung text,
    anfallendekosten double precision
	-- bilder liste
);

ALTER TABLE IF EXISTS rentals.tbl_schaden
    OWNER to postgres;
	
ALTER TABLE rentals.tbl_schaden
ADD CONSTRAINT schaden_pk PRIMARY KEY (schaden_id);

CREATE SEQUENCE rentals.tbl_schaden_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_schaden_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_schaden TO vrentalsuser;

	
-- #########################################################################
-- ############################# TABLE bilder ##############################
-- #########################################################################
	
CREATE TABLE rentals.tbl_bilder
(
    bilder_id numeric(10) NOT NULL,
    bild bytea
);

ALTER TABLE IF EXISTS rentals.tbl_bilder
    OWNER to postgres;
	
ALTER TABLE rentals.tbl_bilder
ADD CONSTRAINT bilder_pk PRIMARY KEY (bilder_id);

CREATE SEQUENCE rentals.tbl_bilder_seq START WITH 1 INCREMENT BY 1;
GRANT USAGE ON rentals.tbl_bilder_seq TO vrentalsuser;

GRANT SELECT, INSERT, UPDATE, DELETE ON rentals.tbl_bilder TO vrentalsuser;