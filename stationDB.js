var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    post: 3000,
    user: 'wingstation',
    password: 'BaKuMan221!',
    database: 'Wingstation_test'
});

module.exports = connection;