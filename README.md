# @ursif/restful-interfaces

## Overview

This project showcases how to create a RESTful interface on top of a PostgresDB.

## Usage

_**Table of Contents**_

- [Adding a DB Table](#adding-a-db-table)
- [Adding a Route](#adding-a-route)
- [Adding the Validation](#adding-the-validation)
- [Adding Query Mapping](#adding-query-mapping)
- [Ensuring it Works](#ensuring-it-works)

This is meant to be used as a base level for your application. It offers a
common API for interacting with tables in Postgres while allowing the developer
to extend and modify with ease.

Let's see how we could add a new table, `events`, to our system. First, we would
design the table schema inside of `db.sql`. This file should be able to be ran
and get a developer the _most up to date_ version of the schema of the database.

> If you modify a table, add the update to the `CREATE` command instead of doing
> an `ALTER`. This SQL command is a way to get the _correct_ schema, not how to
> modify your current schema to match.

### Adding A DB Table

```sql
/* We are creating a new table called events
    which will hold all of the events that
    our users have created */
CREATE TABLE events(
  /* We use UUID as primary keys */
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  /* All events must have a title
      and it can be at max 240 characters */
  title VARCHAR(240) NOT NULL,
  /* Events can have a message, keywords,
    or a url */
  message TEXT,
  keywords TEXT[],
  url TEXT,
  /* We must assocciate a user
      as the creator of this event */
  user_id UUID NOT NULL REFERENCES users(id),
  /* And we keep a list of people that
      are attending the event */
  attending UUID[],
  /* We want to know when the event is */
  start_at TIMESTAMP NOT NULL,
  /* We also want to be able to say where it is */
  location TEXT,
  /* Then of course when it was
      created and last updated */
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);
```

Then, once we have a schema that we like, we need to enter the postgres instance
that we are using. If you are using `docker-compose`, you can find that by the
following:

```bash
docker ps

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
5d85c2252c9c        postgres:latest     "docker-entrypoint.s…"   4 hours ago         Up 4 hours          0.0.0.0:9999->5432/tcp   cms_postgres_1
```

and we can enter that instance with the following:

```bash
docker exec -it 5d85c2252c9c bash
root@5d85c2252c9c:/ psql -U timi cms
cms=CREATE TABLE events(...);
CREATE TABLE
cms= \q
root@5d85c2252c9c:/ exit
```

### Adding the Route

Now that we have the table created, we can add it to our `rest` routes:

`src/index.js`

```javascript
/**
 * Routes for REST Server
 */
const routes = ['users', 'todos', 'lists', 'reminders', 'records', 'events']
```

### Adding the Validation

Next, we have to add validations for the route. Let's do that!

`src/validations/events`

```js
/* Create a router instance */
const router = require('koa-rest-router')({ prefix: process.env.REST_PREFIX })

/* Set up the safe columns to return
  for this */
const safeColumns = '*'

/* Set up a common validator that
  just ensures the columns */
const generic = (ctx, next) => {
  ctx.restReturning = safeColumns

  // NOTE: _ALWAYS_ call next!
  return next()
}

const create = [
  (ctx, next) => {
    // We need a body to create something!
    if (!ctx.request.body) {
      const err = new Error('No body given for creating of a event!')

      err.code = 403

      throw err
    }

    const { body } = ctx.request

    // We need to know who created it!
    if (!body.user_id) {
      const err = new Error('You must give a user_id for the event!')

      err.code = 403

      throw err
    }

    // It will fail DB insertion if it doesn't have
    // a start_at date!
    if (!body.start_at) {
      const err = new Error('You must give a start at for the event!')

      err.code = 403

      throw err
    }

    // Everything is good to go!
    return next()
  },
  generic
]

router.resource('events', {
  create,
  show: generic,
  index: generic,
  remove: generic,
  update: generic
})

module.exports = router
```

Then, add the `require` to `src/valdiations/index.js`

```js
/* other requires */
const events = require('./events')

module.exports = {
  /* other exports */,
  events
}
```

### Adding Query Mapping

Sometimes the queries for the resource are complex and aren't just by ID or a
general lookup. Let's suppose that we want to be able to search by events of a
certain user. Let's add an `owner` query argument to the `index` search of
`events`.

`src/queries/events.js`

```js
const router = require('koa-rest-router')({ prefix: process.env.REST_PREFIX })

const index = (ctx, next) => {
  /**
   * Possible Query Args
   * owner = user_id of record to get
   */
  const { owner } = ctx.query

  const queries = [owner && ['user_id', '=', `'${owner}'`]].filter(Boolean)

  if (queries.length) {
    ctx.restQuery = queries.reduce(
      (a, [column, op, value]) =>
        a
          ? `${a} AND ${column} ${op} ${value}`
          : `WHERE ${column} ${op} ${value}`,
      ''
    )
  }

  return next()
}

router.resource('events', {
  index
})

module.exports = router
```

And of course, add it the queries export:

`src/queries/index.js`

```js
/* other requires */
const events = require('./events')

module.exports = {
  /* other exports */,
  events
}
```

### Ensuring it Works

Now, let's make sure it all works! Start up the server via

```bash
yarn dev
```

You should be able to create an `event` with this payload:

```json
{
  "user_id": "0109e82c-e705-4459-bdf8-def260e5b9d9",
  "start_at": "2018-10-16",
  "title": "My Event GetDown",
  "keywords": ["event", "testing"],
  "location": "1234 Main St, Knoxville, TN 37919",
  "url": "http://myawesomeevent.com"
}
```

And it should return to you

```json
{
  "data": {
    "id": "0f05a099-f46b-42a6-a583-49118d374ada",
    "title": "My Event GetDown",
    "message": null,
    "keywords": ["event", "testing"],
    "url": "http://myawesomeevent.com",
    "user_id": "0109e82c-e705-4459-bdf8-def260e5b9d9",
    "attending": null,
    "start_at": "2018-10-16T04:00:00.000Z",
    "location": "1234 Main St, Knoxville, TN 37919",
    "created_at": "2018-10-14T23:41:56.788Z",
    "last_updated": "2018-10-14T23:41:56.788Z"
  }
}
```

and going to `/events` should return

```json
{
  "data": [
    {
      "id": "0f05a099-f46b-42a6-a583-49118d374ada",
      "title": "My Event GetDown",
      "message": null,
      "keywords": ["event", "testing"],
      "url": "http://myawesomeevent.com",
      "user_id": "0109e82c-e705-4459-bdf8-def260e5b9d9",
      "attending": null,
      "start_at": "2018-10-16T04:00:00.000Z",
      "location": "1234 Main St, Knoxville, TN 37919",
      "created_at": "2018-10-14T23:41:56.788Z",
      "last_updated": "2018-10-14T23:41:56.788Z"
    }
  ]
}
```

Now, you can create another `event`, using a different `user_id`:

```json
{
  "user_id": "42373613-5c82-4f29-a50e-7e372fdcdfb2",
  "start_at": "2018-10-16",
  "title": "My Other Event GetDown",
  "keywords": ["event", "testing"],
  "location": "1234 Main St, Knoxville, TN 37919",
  "url": "http://myawesomeevent.com"
}
```

which should cause `GET /events` to return

```json
{
  "data": [
    {
      "id": "25002a64-043c-4f8b-9858-2d6b9d141c94",
      "title": "My Other Event GetDown",
      "message": null,
      "keywords": ["event", "testing"],
      "url": "http://myawesomeevent.com",
      "user_id": "42373613-5c82-4f29-a50e-7e372fdcdfb2",
      "attending": null,
      "start_at": "2018-10-16T04:00:00.000Z",
      "location": "1234 Main St, Knoxville, TN 37919",
      "created_at": "2018-10-14T23:48:06.771Z",
      "last_updated": "2018-10-14T23:48:06.771Z"
    },
    {
      "id": "0f05a099-f46b-42a6-a583-49118d374ada",
      "title": "My Event GetDown",
      "message": null,
      "keywords": ["event", "testing"],
      "url": "http://myawesomeevent.com",
      "user_id": "0109e82c-e705-4459-bdf8-def260e5b9d9",
      "attending": null,
      "start_at": "2018-10-16T04:00:00.000Z",
      "location": "1234 Main St, Knoxville, TN 37919",
      "created_at": "2018-10-14T23:41:56.788Z",
      "last_updated": "2018-10-14T23:41:56.788Z"
    }
  ]
}
```

Now, let's test that the `owner` query argument works:

`GET localhost:3210/api/v1/events?owner=42373613-5c82-4f29-a50e-7e372fdcdfb2`

```json
{
  "data": [
    {
      "id": "25002a64-043c-4f8b-9858-2d6b9d141c94",
      "title": "My Other Event GetDown",
      "message": null,
      "keywords": ["event", "testing"],
      "url": "http://myawesomeevent.com",
      "user_id": "42373613-5c82-4f29-a50e-7e372fdcdfb2",
      "attending": null,
      "start_at": "2018-10-16T04:00:00.000Z",
      "location": "1234 Main St, Knoxville, TN 37919",
      "created_at": "2018-10-14T23:48:06.771Z",
      "last_updated": "2018-10-14T23:48:06.771Z"
    }
  ]
}
```
