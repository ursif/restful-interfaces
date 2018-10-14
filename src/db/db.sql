/* We use UUID as our primary keys */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* A user is a person that can take
    actions inside the system */
CREATE TABLE users(
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

/* A record is a general purpose note
    that a user can make */
CREATE TABLE records(
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  title VARCHAR(240) NOT NULL,
  message TEXT,
  keywords VARCHAR(100)[],
  url TEXT,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

/* A todoitem can be in any of these states */
CREATE TYPE todo_status as ENUM('done', 'started', 'ready');

CREATE TABLE lists(
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  keywords TEXT[],
  url TEXT,
  title VARCHAR(240),
  message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

/* todos are a list of todo items
    associated with some meta data */
CREATE TABLE todos(
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  list UUID REFERENCES lists(id),
  status todo_status NOT NULL DEFAULT 'ready',
  title TEXT NOT NULL,
  keywords TEXT[],
  message TEXT,
  url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

/* A reminder is a note for future self
    about something that you have to
    by a certain time.
    
    We can also attach a reminder to a list */
CREATE TABLE reminders(
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(240) NOT NULL,
  list UUID REFERENCES lists(id),
  message TEXT,
  url TEXT,
  keywords TEXT[],
  end_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);