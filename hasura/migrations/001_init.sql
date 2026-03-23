-- hasura/migrations/001_init.sql
-- Postgres runs this automatically on first container boot

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- departments (created first because users references it)
CREATE TABLE departments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  head_id     UUID,
  name        TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT now(),
  updated_at  TIMESTAMP DEFAULT now(),
  deleted_at  TIMESTAMP
);

-- users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password      TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin','department','intern')),
  department_id UUID REFERENCES departments(id),
  created_at    TIMESTAMP DEFAULT now(),
  updated_at    TIMESTAMP DEFAULT now(),
  deleted_at    TIMESTAMP
);

-- back-fill the FK we couldn't add before users existed
ALTER TABLE departments
  ADD CONSTRAINT fk_dept_head
  FOREIGN KEY (head_id) REFERENCES users(id);

-- institutes
CREATE TABLE institutes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  location    TEXT,
  created_at  TIMESTAMP DEFAULT now(),
  updated_at  TIMESTAMP DEFAULT now(),
  deleted_at  TIMESTAMP
);

-- internship_status lookup table
CREATE TABLE internship_status (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL
);

INSERT INTO internship_status (status)
VALUES ('pending'), ('active'), ('completed'), ('terminated');

-- interns (references everything above)
CREATE TABLE interns (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  department_id UUID NOT NULL REFERENCES departments(id),
  name          TEXT NOT NULL,
  gender        TEXT,
  phone         TEXT,
  institute_id  UUID REFERENCES institutes(id),
  start_date    DATE,
  end_date      DATE,
  status_id     UUID REFERENCES internship_status(id),
  created_at    TIMESTAMP DEFAULT now(),
  updated_at    TIMESTAMP DEFAULT now(),
  deleted_at    TIMESTAMP
);

-- Default admin — password is Admin@123
INSERT INTO users (email, password, role)
VALUES (
  'admin@intern.com',
  '$2b$12$cDCZOMk1bSz11pKrFSSTq.6.MY8QxPLigIRSxJvNLWnxyGNOR7lOu',
  'admin'
);