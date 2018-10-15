module.exports = async (ctx, next) => {
  if (ctx.request.path === '/schemas') {
    ctx.body = {
      data: await ctx.db.pool
        .query(
          `
          SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public'
        `
        )
        .then(({ rows }) => rows)
        .then(list => list.map(({ table_name }) => table_name))
        .then(list =>
          Promise.all(
            list.map(table =>
              ctx.db.pool
                .query(
                  `
                    SELECT * FROM information_schema.columns
                      WHERE table_name ='${table}'
                  `
                )
                .then(({ rows }) => rows)
                .then(rows => ({
                  table,
                  columns: rows.map(
                    ({
                      data_type,
                      column_name,
                      udt_name,
                      is_nullable,
                      column_default
                    }) => ({
                      type: `${data_type}${
                        data_type === udt_name ? '' : ' ' + udt_name
                      }`,
                      name: column_name,
                      nullable: is_nullable === 'YES',
                      defaultValue: column_default
                    })
                  )
                }))
            )
          )
        )
    }
  } else {
    return next()
  }
}
