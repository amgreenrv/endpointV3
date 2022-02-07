const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-ita',
    password: 'fallon87',
});

module.exports = pool.promise();