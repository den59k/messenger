CREATE EXTENSION pgcrypto;

CREATE TABLE users (
	id serial PRIMARY KEY,
  name text,
	login text,
	password bytea,
	last_login_time bigint,
	status text,
	avatar text
);

CREATE UNIQUE INDEX ON users (lower(login));

CREATE TABLE refresh_tokens (
	user_id int,
	token text PRIMARY KEY,
	timestamp bigint
);

-- Дальше все остальное
CREATE TYPE group_access AS ENUM ('public', 'private');

CREATE TABLE groups (
	id serial PRIMARY KEY,
	creator_id int,
	name text,
	access group_access,
	avatar text,
	creation_time bigint
);

CREATE TABLE users_groups (
	user_id integer,
	group_id integer,
	PRIMARY KEY (user_id, group_id)
);

-- Механизм сообщений

CREATE TABLE confs (
	id serial PRIMARY KEY,
	last_message_id int DEFAULT 0,
	last_call_id int DEFAULT 0
);

CREATE TABLE ls_confs (
	user_one int,
	user_two int,
	PRIMARY KEY (user_one, user_two)
) INHERITS (confs);


CREATE TABLE group_confs (
	group_id int
) INHERITS (confs);


CREATE TABLE user_conf (
	user_id int,
	conf_id int,
	last_message_id int DEFAULT 0,
	last_call_id int DEFAULT 0,
	PRIMARY KEY (user_id, conf_id)
);

CREATE TABLE messages (
	id int,
	conf_id int,
	sender_id int,
	text text,
	attachment jsonb[],
	time bigint,
	readed boolean DEFAULT true,
	PRIMARY KEY (id, conf_id)
);