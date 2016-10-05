-- Clear old schema if needed

DROP SCHEMA IF EXISTS mosquito CASCADE;

-- Create new schema

CREATE SCHEMA mosquito;

-- Create schema tables and indexes

CREATE TABLE mosquito.trap (
  id serial NOT NULL,
  name character varying(63) NOT NULL,
  comment text,
  CONSTRAINT trap_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);
COMMENT ON TABLE mosquito.trap IS 'Common Mosquito trap types. Other trap types may be listed under "other" with details in the comment field.';

CREATE TABLE mosquito.species (
  id serial NOT NULL,
  name character varying(63) NOT NULL,
  CONSTRAINT species_pkey PRIMARY KEY (id),
  CONSTRAINT unique_species UNIQUE (name)
)
WITH (
  OIDS=FALSE
);
COMMENT ON TABLE mosquito.species IS 'Mosquito species that are present in the US.';

CREATE TABLE mosquito.state (
  code character(2) NOT NULL,
  name character varying(31) NOT NULL,
  CONSTRAINT state_pkey PRIMARY KEY (code),
  CONSTRAINT unique_state UNIQUE (name)
)
WITH (
  OIDS=FALSE
);
COMMENT ON TABLE mosquito.state IS 'US States lised by their capitalized 2 character code, such as AZ.';

CREATE TABLE mosquito.county (
  id serial NOT NULL,
  name character varying(63) NOT NULL,
  state_code character(2) NOT NULL,
  CONSTRAINT county_pkey PRIMARY KEY (id),
  CONSTRAINT county_state_fkey FOREIGN KEY (state_code)
    REFERENCES mosquito.state (code) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
COMMENT ON TABLE mosquito.county IS 'US Counties, tied to their parent state.';

CREATE INDEX county_state_index
  ON mosquito.county
  USING btree
  (state_code COLLATE pg_catalog."default");

CREATE TABLE mosquito.collection (
  id serial NOT NULL,
  year smallint NOT NULL,
  month smallint,
  week smallint,
  state_code character(2) NOT NULL,
  county_id integer NOT NULL,
  trap_id integer,
  species_id integer NOT NULL,
  pools integer NOT NULL,
  individuals integer,
  trap_nights smallint,
  wnv_results integer NOT NULL,
  comment text,
  CONSTRAINT record_pkey PRIMARY KEY (id),
  CONSTRAINT collection_state_fkey FOREIGN KEY (state_code)
    REFERENCES mosquito.state (code) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT collection_county_fkey FOREIGN KEY (county_id)
    REFERENCES mosquito.county (id) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT collection_species_fkey FOREIGN KEY (species_id)
    REFERENCES mosquito.species (id) MATCH SIMPLE
    ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
COMMENT ON TABLE mosquito.collection IS 'Mosquito population collection record, tied to the associated location and trap type.';

CREATE INDEX collection_state_index
  ON mosquito.collection
  USING btree
  (state_code COLLATE pg_catalog."default");

CREATE INDEX collection_county_index
  ON mosquito.collection
  USING btree
  (county_id);

CREATE INDEX collection_species_index
  ON mosquito.collection
  USING btree
  (species_id);

-- Fill schema with allowed values

-- Traps
INSERT INTO mosquito.trap (id, name, comment)
  VALUES (1, 'test type', null);
INSERT INTO mosquito.trap (id, name, comment)
  VALUES (2, 'other', null);

-- Species
INSERT INTO mosquito.species (id, name)
  VALUES (1, 'test species');

-- US States
INSERT INTO mosquito.state (code, name)
  VALUES ('AL', 'Alabama');
INSERT INTO mosquito.state (code, name)
  VALUES ('AK', 'Alaska');
INSERT INTO mosquito.state (code, name)
  VALUES ('AZ', 'Arizona');
INSERT INTO mosquito.state (code, name)
  VALUES ('AR', 'Arkansas');
INSERT INTO mosquito.state (code, name)
  VALUES ('CA', 'California');
INSERT INTO mosquito.state (code, name)
  VALUES ('CO', 'Colorado');
INSERT INTO mosquito.state (code, name)
  VALUES ('CT', 'Connecticut');
INSERT INTO mosquito.state (code, name)
  VALUES ('DE', 'Delaware');
INSERT INTO mosquito.state (code, name)
  VALUES ('FL', 'Florida');
INSERT INTO mosquito.state (code, name)
  VALUES ('GA', 'Georgia');
INSERT INTO mosquito.state (code, name)
  VALUES ('HI', 'Hawaii');
INSERT INTO mosquito.state (code, name)
  VALUES ('ID', 'Idaho');
INSERT INTO mosquito.state (code, name)
  VALUES ('IL', 'Illinois');
INSERT INTO mosquito.state (code, name)
  VALUES ('IN', 'Indiana');
INSERT INTO mosquito.state (code, name)
  VALUES ('IA', 'Iowa');
INSERT INTO mosquito.state (code, name)
  VALUES ('KS', 'Kansas');
INSERT INTO mosquito.state (code, name)
  VALUES ('KY', 'Kentucky');
INSERT INTO mosquito.state (code, name)
  VALUES ('LA', 'Louisiana');
INSERT INTO mosquito.state (code, name)
  VALUES ('ME', 'Maine');
INSERT INTO mosquito.state (code, name)
  VALUES ('MD', 'Maryland');
INSERT INTO mosquito.state (code, name)
  VALUES ('MA', 'Massachusetts');
INSERT INTO mosquito.state (code, name)
  VALUES ('MI', 'Michigan');
INSERT INTO mosquito.state (code, name)
  VALUES ('MN', 'Minnesota');
INSERT INTO mosquito.state (code, name)
  VALUES ('MS', 'Mississippi');
INSERT INTO mosquito.state (code, name)
  VALUES ('MO', 'Missouri');
INSERT INTO mosquito.state (code, name)
  VALUES ('MT', 'Montana');
INSERT INTO mosquito.state (code, name)
  VALUES ('NE', 'Nebraska');
INSERT INTO mosquito.state (code, name)
  VALUES ('NV', 'Nevada');
INSERT INTO mosquito.state (code, name)
  VALUES ('NH', 'New Hampshire');
INSERT INTO mosquito.state (code, name)
  VALUES ('NJ', 'New Jersey');
INSERT INTO mosquito.state (code, name)
  VALUES ('NM', 'New Mexico');
INSERT INTO mosquito.state (code, name)
  VALUES ('NY', 'New York');
INSERT INTO mosquito.state (code, name)
  VALUES ('NC', 'North Carolina');
INSERT INTO mosquito.state (code, name)
  VALUES ('ND', 'North Dakota');
INSERT INTO mosquito.state (code, name)
  VALUES ('OH', 'Ohio');
INSERT INTO mosquito.state (code, name)
  VALUES ('OK', 'Oklahoma');
INSERT INTO mosquito.state (code, name)
  VALUES ('OR', 'Oregon');
INSERT INTO mosquito.state (code, name)
  VALUES ('PA', 'Pennsylvania');
INSERT INTO mosquito.state (code, name)
  VALUES ('RI', 'Rhode Island');
INSERT INTO mosquito.state (code, name)
  VALUES ('SC', 'South Carolina');
INSERT INTO mosquito.state (code, name)
  VALUES ('SD', 'South Dakota');
INSERT INTO mosquito.state (code, name)
  VALUES ('TN', 'Tennessee');
INSERT INTO mosquito.state (code, name)
  VALUES ('TX', 'Texas');
INSERT INTO mosquito.state (code, name)
  VALUES ('UT', 'Utah');
INSERT INTO mosquito.state (code, name)
  VALUES ('VT', 'Vermont');
INSERT INTO mosquito.state (code, name)
  VALUES ('VA', 'Virginia');
INSERT INTO mosquito.state (code, name)
  VALUES ('WA', 'Washington');
INSERT INTO mosquito.state (code, name)
  VALUES ('WV', 'West Virginia');
INSERT INTO mosquito.state (code, name)
  VALUES ('WI', 'Wisconsin');
INSERT INTO mosquito.state (code, name)
  VALUES ('WY', 'Wyoming');

-- Counties (probably be done differently later because there's over 3000)
INSERT INTO mosquito.county (id, name, state_code)
  VALUES (1, 'Maricopa', 'AZ');
INSERT INTO mosquito.county (id, name, state_code)
  VALUES (2, 'Honolulu', 'HI');
