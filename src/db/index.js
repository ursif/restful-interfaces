const pool = require('./pool')

const create = (pool, table) => (data, returning = '*') => {
  const keys = Object.keys(data)

  return pool
    .query(
      `
  INSERT INTO ${table} (${keys.join(', ')})
    VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')})
    RETURNING ${returning}
`,
      keys.map(key => data[key])
    )
    .then(({ rows }) => rows[0])
}

const read = (pool, table) => (
  options,
  returning = '*',
  query = 'WHERE 1 = 1'
) => {
  const { limit, offset, order_by, sort } = options

  return pool
    .query(
      `
  SELECT ${returning} FROM ${table}
      ${query}
      ORDER BY ${order_by} ${sort}
      LIMIT ${limit}
      OFFSET ${offset}
`
    )
    .then(({ rows }) => rows)
}

const update = (pool, table) => (data, returning = '*') => {
  const { id, ...update } = data
  if (!id) {
    const err = new Error('Must give update an ID value')

    err.code = 401

    throw err
  }

  if (!update) {
    return {
      id
    }
  }

  const keys = Object.keys(update)

  return pool
    .query(
      `
  UPDATE ${table}
    SET ${keys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ')}, last_updated = $${keys.length + 1}
    WHERE id = $${keys.length + 2}
    RETURNING ${returning}
`,
      keys.map(key => update[key]).concat(new Date().toISOString(), id)
    )
    .then(({ rows }) => rows[0])
}

const destroy = (pool, table) => (id, returning = '*') => {
  if (!id) {
    const err = new Error('No Id given to destroy')
    err.code = 403

    throw err
  }

  return pool
    .query(
      `
    DELETE FROM ${table}
      WHERE id = $1
      RETURNING ${returning}
  `,
      [id]
    )
    .then(({ rows }) => rows[0])
}

const byId = (pool, table) => (id, returning = '*') => {
  if (!id) {
    const err = new Error('No Id given to byId')

    err.code = 403

    throw err
  }

  return pool
    .query(`SELECT ${returning} FROM ${table} WHERE id = $1`, [id])
    .then(({ rows }) => rows[0])
}

const db = Object.assign(
  table => ({
    create: create(pool, table),
    read: read(pool, table),
    update: update(pool, table),
    destroy: destroy(pool, table),
    byId: byId(pool, table)
  }),
  pool
)

module.exports = db
