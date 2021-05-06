var express = require('express')
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
//mysqlDB.connect();

//스테이션 리스트
router.get('/station', (req, res) => {
    var api_key = req.query.key;
    const page = req.query.page;
    const type = req.query.type;

    var type_where = "";

    if(!checkAPI(api_key)){
    result = {
        "result": false,
        "code": "100",
        "detail": "API키 불일치"
    }

    res.send(result);
    } else {

    if(page == null || page =="" || page == " "){
        page = 1;
    }

    if(type == null || type =="" || type == " " || type==0){
        type_where = ""
    } else {
        type_where = "where type = ?"
    }

    
    var query = "select id, title, accent as important, date, type from notice "+type_where+" order by id DESC";

    var value;

    if(type_where != ""){
        value = [type];
    }
    
    mysqlDB.query(query,value, function (err, rows, fields) {
        if (!err) {
        if(rows.length<1){
            result = {
            "result": false,
            "code": "201",
            "detail": "일치하는 데이터가 없습니다."
            }
            res.send(result);
        } else {
            result = {
            "result": true,
            "list": rows
            }
            res.send(result);
        }
        } else {
        console.log('query error : ' + err);
        return false;
        }
    });  
    }
});

module.exports = router;