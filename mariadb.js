var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'wingstation',
    post: 3000,
    user: 'admin',
    password: 'BaKuMan221!',
    database: 'testdb'
});

module.exports = connection;