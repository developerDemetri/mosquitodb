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
