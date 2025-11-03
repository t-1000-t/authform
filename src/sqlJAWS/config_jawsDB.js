require('dotenv').config()

module.exports = {
  host: process.env.JAWSDB_URL,
  db: process.env.JAWS_DB,
  user: process.env.JAWSDB_USER,
  password: process.env.JAWSDB_PASSWORD,
  port_db: process.env.JAWSDB_PORT,
}
