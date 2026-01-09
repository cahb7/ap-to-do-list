const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  database: 'todolist',
  connectionLimit: 5
});

module.exports = pool;
