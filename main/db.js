const { Pool } = require('pg')
const parse = require('pg-connection-string')
// const config = parse('postgres://postgres:Myweb@234@localhost:5432/mydb')
const config = parse(process.env.DATABASE_URL)


const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
  ssl: { rejectUnauthorized: false }
})

module.exports = pool
