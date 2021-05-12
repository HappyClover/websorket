var express = require('express');
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
//mysqlDB.connect();

router.get('/', (req, res) => {
    res.send("스테이션 사용하기 위한 웹앱 접근 홈페이지입니다. \n상세 문의는 주식회사 셰빌리티(1600-2834)로 연락주세요");
});

router.get('/request/', (req, res) => {
    res.render('./router/webapp/index_b.ejs');
});
  
router.post('/request/', (req, res) => {
    const api_key = req.body.key;
    const port_code = req.body.code;

    let result = false;
    let err_code = 0;
    let msg = '';

    let station_id = 0;
    let station_name = "ㅇㅅㅇ";
    let station_port = "알수없음";

    let company_name = "테스트";

    console.log("key : " + api_key);
    console.log("port : " + port_code);
    

    var value = (api_key);
    var query = "select * from admin where api = ?";
    mysqlDB.query(query,value, function (err, rows, fields) {
        console.log(rows);

        if(!err){
            if(rows.length < 1){
                result = false;
                err_code = 999;
                msg = "api키 불일치";
                res.render('./router/webapp/index.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});            
            } else {
                var query = "select station.code, station.name, station_port.number from station_port "
                +"inner join station on station_port.station_id = station.id "
                +"where station_port.code = ?";
                var value = (port_code);
        
                mysqlDB.query(query,value, function (err, rows, fields) {
        
                    if (!err) {
                    if(rows.length<1){
                        result = false;
                        err_code = 989;
                        msg = "qr코드 불일치";
        
                        res.render('./router/webapp/index.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});
        
                    } else {
                        result = true;
                        err_code = 000;
                        msg = "정상";
        
                        station_name = rows[0].name;
                        station_id = rows[0].code;
                        station_port = rows[0].number;
                    }
                    console.log({result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});
                    res.render('./router/webapp/index.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});
        
                    } else {
                    console.log(err);
        
                    result = false;
                    err_code = 979;
                    msg = "DB에러";
                    res.render('./router/webapp/index.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});
        
                    }
                }); 
            }
        } else {
            result = false;
            err_code = 978;
            msg = "DB에러";
            res.render('./router/webapp/index.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});

        }
    });

    
    
    // if (api_key == "test"){

    //     var query = "select station.code, station.name, station_port.number from station_port "
    //     +"inner join station on station_port.station_id = station.id "
    //     +"where station_port.code = ?";
    //     var value = (port_code);

    //     mysqlDB.query(query,value, function (err, rows, fields) {

    //         if (!err) {
    //         if(rows.length<1){
    //             result = false;
    //             err_code = 989;
    //             msg = "qr코드 불일치";

    //             res.render('./router/webapp/request.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});

    //         } else {
    //             result = true;
    //             err_code = 000;
    //             msg = "정상";

    //             station_name = rows[0].name;
    //             station_id = rows[0].code;
    //             station_port = rows[0].number;
    //         }
    //         res.render('./router/webapp/request.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});

    //         } else {
    //         console.log(err);

    //         result = false;
    //         err_code = 979;
    //         msg = "DB에러";
    //         res.render('./router/webapp/request.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});

    //         }
    //     });  
    // } else {
    // result = false;
    // err_code = 999;
    // msg = "api키 불일치";
    // res.render('./router/webapp/request.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});

    // }
    console.log(result);


});

module.exports = router;