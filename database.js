const mysql = require('mysql2')
const config = require('../config/config.json')

const connection = mysql.createConnection({
  host: config.localhost,
  password: config.password,
  user: config.user,
  database: config.database
})

module.exports = connection