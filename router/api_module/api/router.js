var express = require('express')
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
//mysqlDB.connect();


//스테이션 
// var router_api_app = require('./router/api_module/api/app/router.js');
// var router_api_station = require('./router/api_module/api/station/router');


//자동 로그인 처리
router.get('/', (req, res) => {
    res.send("윙스테이션 api입니다. 접근 키 발급 관련은 주식회사 셰빌리티(1600-2834) 또는 cto@shability.io로 문의주세요");

});



//스테이션 관련 처리
router.get('/station', (req, res) => {
    res.send("스테이션 라우터");
});

//스테이션 관련 처리
router.get('/station/list', (req, res) => {
    const api_key = req.query.key;
    const min_lat = req.query.min_lat;
    const min_long = req.query.min_long;  
    const max_lat = req.query.max_lat;
    const max_long = req.query.max_long;

    var station_result = null;
    let result;

    // const identifier = req.body.identifier;
    // const token = req.body.token;


    //api키 체크
    if(!checkAPI(api_key)){
    result = {
        "result": false,
        "code": "999",
        "detail": "API키 불일치"
    }
    res.send(result);

    } else {
        //스테이션 리스트 가져오기
        var query = "select id, latitude, longitude, adress, identifier, name from station where (latitude > ? and longitude > ? ) and (latitude < ? and longitude < ? )";
        var value = [min_lat, min_long, max_lat, max_long];
        
        mysqlDB.query(query, value, function (err, rows, fields) {
            if (!err) {
                if(rows.length<1){
                    station_result = null;
                    
                } else {
                    station_result = Array();

                    for(let i=0; i<rows.length; i++){
                    console.log(i);

                    let result = {
                        "lat": rows[i]['latitude'],
                        "long": rows[i]['longitude'],
                        "station_id": rows[i]['id'],
                        "name": rows[i]['name'],
                        "id": rows[i]['identifier'],
                        "able": true
                    }
                    station_result.push(result);
                    }
                }
            } else {
            console.log('query error : ' + err);
            station_result = null;
            }

            console.log(station_result);
            let use_data = null;
            //사용 여부
        
            let result = {
            "result": true,
            "station": station_result,
            "use": use_data
            }
        
            res.send(result);
        });  
    }
});

//스테이션 관련 처리
router.get('/station/info', (req, res) => {
    res.send("스테이션 라우터");
});

//스테이션 관련 처리
router.get('/station/usage', (req, res) => {
    res.send("스테이션 라우터");
});

module.exports = router;