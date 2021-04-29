var express = require('express')
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
//mysqlDB.connect();

router.get('/request/', (req, res) => {
    res.render('./router/api_module/sharing/index.ejs');
});
  
router.post('/request/', (req, res) => {
    console.log("post");

    const api_key = req.body.key;
    const port_code = req.body.code;

    let result = false;
    let err_code = 0;
    let msg = '';

    let station_id = 0;
    let station_name = "ㅇㅅㅇ";
    let station_port = "알수없음";

    let company_name = "테스트";
    
    
    if (api_key == "test"){

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

            res.render('./router/api_module/sharing/request.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});

        } else {
            result = true;
            err_code = 000;
            msg = "정상";

            station_name = rows[0].name;
            station_id = rows[0].code;
            station_port = rows[0].number;
        }
        res.render('./router/api_module/sharing/request.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code, station_id});

        } else {
        console.log(err);

        result = false;
        err_code = 979;
        msg = "DB에러";
        res.render('./router/api_module/sharing/request.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code});

        }
    });  
    } else {
    result = false;
    err_code = 999;
    msg = "api키 불일치";
    res.render('./router/api_module/sharing/request.ejs', {result, err_code, msg, station_name, station_port, company_name, api_key, port_code});

    }
    console.log(result);


});

module.exports = router;