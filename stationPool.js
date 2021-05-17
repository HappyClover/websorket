const mysql = require("mysql2");

const dbsecret = {
    host: 'localhost',
    post: 3000,
    user: 'wingstation',
    password: 'BaKuMan221!',
    database: 'Wingstation_test'
};

const pool = mysql.createPool(

  dbsecret                                             //db.json이라는 파일에서 mysql 정보를 가져옵니다.

);

const promisePool = pool.promise();

module.exports = promisePool;
