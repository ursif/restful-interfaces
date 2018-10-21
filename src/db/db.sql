/* We use UUID as our primary keys */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* An ask is something that has
    been asked of me that I need
    to get done */
CREATE TABLE asks (
  id UUID NOT NULL DEFAULT uuid_generate_v4 () PRIMARY KEY,
  title VARCHAR(240) NOT NULL,
  message TEXT,
  keywords TEXT [ ],
  url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(50),
  due_date TIMESTAMP,
  priority SMALLINT,
  meta jsonb
);

