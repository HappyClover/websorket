var mysql = require('mysql2/promise');
var pool = mysql.createPool({
    host: 'localhost',
    post: 3000,
    user: 'wingstation',
    password: 'BaKuMan221!',
    database: 'Wingstation_test'
});

const DB = async(type, sql, params) => { // async, await
    try {
        // state : 쿼리문 실행 성공시 true 실패 false
        // error : 쿼리문 error 정보 반환
        let result = {}; // 반환 값
        const connection = await pool.getConnection(async conn => conn); // 생성된 풀 정보로 DB 연결
        try {
            const [rows] = await connection.query(sql, params); // sql 쿼리문 실행
            if(type == "GET") result.row = rows;
            result.state = true;
            connection.release(); // 사용된 풀 반환
            return result;
        } catch (err) {
            console.log('Query Error');
            result.state = false;
            result.error = err;
            connection.release();
            return result;
        }
    } catch (err) {
        console.log('DB Error');
        result.state = false;
        result.error = err;
        return result;
    }
}

module.exports = DB;