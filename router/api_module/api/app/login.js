var express = require('express')
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
//mysqlDB.connect();


//자동 로그인 처리
router.post('/', (req, res) => {
    var api_key = req.body.key;
    const token = req.body.token;
    const identifier = req.body.identifier;
    // const identifier = req.body.identifier;
    // const token = req.body.token;

    if(api_key != "test"){
        let result = {
        "result": false,
        "code": "100",
        "detail": "API키 불일치"
        }

        res.send(result);
    } else {
        var query = "select id, phone, identifier from user where token = ?";
        var value = [token];

        mysqlDB.query(query,value, function (err, rows, fields) {
        if (!err) {
            if(rows.length<1){
            let result = {
                "result": false,
                "code": "500",
                "detail": "일치하는 토큰이 없음"
            }
            res.send(result);
            } else {
            let user_numb = rows[0].id;
            let user_identifier = rows[0].identifier;
            let phone = rows[0].phone;
            
            if(user_identifier==identifier){
                let newToken = encrypt(phone,cryKey);
                var query = "update user set token = ? where token = ?";
                var value = [newToken, token];
            
                mysqlDB.query(query,value, function (err, rows, fields) {
                if(err){
                    let result = {
                    "result": false,
                    "code": "550",
                    "detail": "DB 업데이트 실패"
                    }
                    res.send(result);
                } else{
                    let result = {
                    "result": true,
                    "token": newToken
                    }
                    res.send(result);
                }
                });
            } else {
                console.log(identifier +"  "+user_identifier);

                let result = {
                "result": false,
                "code": "501",
                "detail": "식별자 불일치"
                }
                res.send(result);
            }
            }
        } else {
            console.log('query error : ' + err);
            return false;
        }
        });  
    }
});

//새로운 로그인 처리
router.post('/new/', (req, res) => {
var api_key = req.body.key;
const identifier = req.body.identifier;
const phone = req.body.phone;

if(checkAPI(api_key)){
    var query = "select * from user where phone = ?";
    var value = phone;
    
    mysqlDB.query(query,value, function (err, rows, fields) {
    if (!err) {
        if(rows.length<1){
        let result = {
            "result": true,
            "token": null
        }
        res.send(result);
        } else {
        let user_numb = rows[0].id;
        
            let newToken = encrypt(phone,cryKey);
            var query = "update user set token = ?, identifier = ? where id = ?";
            var value = [newToken,identifier, user_numb];
        
            mysqlDB.query(query,value, function (err, rows, fields) {
            if(err){
                let result = {
                "result": false,
                "code": "550",
                "detail": "DB 업데이트 실패"
                }
                res.send(result);
            } else{
                let result = {
                "result": true,
                "token": newToken
                }
                res.send(result);
            }
            });
        }
        return true;
    } else {
        console.log('query error : ' + err);
        return false;
    }
    });  
}
});

//인증번호 발송
router.post('/getcert/', (req, res) => {
    const api_key = req.body.key;
    const phone = req.body.phone;

    if(checkAPI(api_key)){
        let cert = Mathjs.randomInt(100000,999999);
        let result = {
        "result": true,
        "numb": cert
        }
        res.send(result);
    } else {
        let result = {
        "result": false,
        "code": "100",
        "detail": "API키 불일치"
        }
        res.send(result);
    }
});

//회원가입 처리
router.post('/join/', (req, res) => {
    console.log(req.body);

    const api_key = req.body.key;
    const phone = req.body.phone;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const marketing = req.body.marketing;
    const identifier = req.body.identifier;

    const port_type = req.body.port_type;
    const port_voltage = req.body.port_voltage;
    const port_ampere = req.body.port_ampere;

    const billing_key = req.body.billing_key;

    const status = 1;

    var token = null;


    if(checkAPI(api_key)){
        token = encrypt(phone, cryKey);

        var query = "insert into user(first_name, last_name, phone, email, marketing, billingkey, status, token, identifier) values(?,?,?,?,?,?,?,?,?)";
        var param = [first_name, last_name, phone, email, marketing, billing_key, status, token, identifier];

        //, port_type, port_voltage, port_ampere, 
        mysqlDB.query(query,param, function (err, rows, fields) {
            if (!err) {
            var user_numb = rows.insertId;

            let query1 = "insert into charge_spec(user_id, mobility_type, port_type, volt, ampere, date) values(?,?,?,?,?,?)";
            let param1 = [user_numb, 1, port_type, port_voltage, port_ampere, getTimeStamp()];

            mysqlDB.query(query1,param1, function (err, rows, fields) {
                
                if(!err){

                } else {
                console.log(err);
                }

            });

            const result = {
                "result" : true,
                "token": token
            }
            res.send(result);
            } else {
            console.log('query error : ' + err);
            res.send(err);

            return false;
            }
        });
    } else {
        let result = {
            "result": false,
            "code": "100",
            "detail": "API키 불일치"
        }

        res.send(result);

    }
});

module.exports = router;