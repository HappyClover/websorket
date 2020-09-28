var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    post: 3000,
    user: 'admin',
    password: 'BaKuMan221!',
    database: 'testdb'
});

module.exports = connection;