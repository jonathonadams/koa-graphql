-- Postgress comand
-- login: psql --u <usernam>
-- exit \q
-- list all databases: \list ; \l
-- list all tablse in current database: \dt
-- list all users: \du;
-- describe table \d <table_name>
-- connect to a database: \connect <database_name>
-- describe table \d+ <tablename>
-- Note :PRIMARY KEY will create implicit index "<table_name>_pkey" for table "<table_name>"


DROP DATABASE todo_db;
CREATE DATABASE todo_db;

\connect todo_db;

--  Add the extension for the uuid generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


DROP TABLE IF EXISTS server_state;
CREATE TABLE server_state (
  id SERIAL PRIMARY KEY   NOT NULL,
  refresh_tokens JSONB NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1() NOT NULL,
  first_name VARCHAR(255)                        NOT NULL,
  last_name VARCHAR(255)                         NOT NULL,
  username VARCHAR(255)                          NOT NULL,
  email_address VARCHAR(255)                     NOT NULL,
  date_of_birth DATE                             NOT NULL,
  settings JSONB                                 NOT NULL,
  hashed_password VARCHAR(255)                   NOT NULL,
  scope INT                                      NOT NULL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  CONSTRAINT unique_username UNIQUE (username)
);
CREATE INDEX idx_users_username ON users(username);


DROP TABLE IF EXISTS todos;
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1()        NOT NULL,
  user_id UUID REFERENCES users (id) ON DELETE CASCADE  NOT NULL,
  title VARCHAR (255)                                   NOT NULL,
  description TEXT                                      NOT NULL,
  completed BOOLEAN                                     NOT NULL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);