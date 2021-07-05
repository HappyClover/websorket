var express = require('express');
var moment = require('moment');

var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../../stationDB.js');
var pool = require('../../../stationPool.js');

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { count } = require('console');
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
router.get('/station/list',async (req, res) => {
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
    var company_id = await checkAPI(api_key, pool);

    if(!company_id){
        result = {
            "result": false,
            "code": "999",
            "detail": "API키 불일치"
        }
        res.send(result);

        add_api_log(null, req.url, '990',"API키 불일치 : "+api_key, getTimeStamp());

    } else {
        //스테이션 리스트 가져오기
        var query = "select id, latitude, longitude, adress, identifier, name from station where (latitude > ? and longitude > ? ) and (latitude < ? and longitude < ? )";
        var value = [min_lat, min_long, max_lat, max_long];
        
        mysqlDB.query(query, value, function (err, rows, fields) {
            if (!err) {
                console.log(rows);

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
                        "able": 2
                    }
                    station_result.push(result);
                    }
                }
            } else {
                add_api_log(null,req.url, '999',"DB에러 : "+err, getTimeStamp());
                console.log('query error : ' + err);
                station_result = null;
            }

            console.log(station_result);
            let use_data = null;
            //사용 여부
        
            let result = {
                "result": true,
                'code' : 0o00,
                'detail': 'success',
                "station": station_result,
            }
            add_api_log(company_id, req.url, '200',"success");

            res.json(result);
        });
        add_api_log(company_id ,req.url, '200',"success", getTimeStamp());

    }
});

//스테이션 관련 처리
router.get('/station/info',async (req, res) => {
    var api_key = req.query.key;
    const station_id = req.query.id;
    // const identifier = req.body.identifier;
    // const token = req.body.token;

    var company_id = await checkAPI(api_key, pool);

    if(!company_id){
        result = {
            'result': false,
            'code': 990,
            'detail': '일치하는 API키가 없음',
        }
        add_api_log(null, req.url, '990',"API키 불일치 : "+api_key, getTimeStamp());
        res.json(result);
    } else {

    //스테이션 정보 확인
    var query = "select station.identifier as station_id, station.name as station_name, station.latitude, station.longitude, station_port.code as port_code, station_port.number as port_numb, station_port.type as port_type "+
        "from station "+
        "inner join station_port on station.id = station_port.station_id "+
        "where station.identifier = ?";
    var value = [station_id];

    var result;

    mysqlDB.query(query,value, function (err, rows, fields) {
        if (!err) {
            if(rows.length<1){
                result = {
                    'result': false,
                    'code': 500,
                    'detail': '일치하는 스테이션이 없습니다.'
                } 
            } else{
                var port = Array();

                for(let i=0; i<rows.length; i++){
                    var result = {
                        'code' : rows[i].port_code,
                        'numb' : rows[i].port_numb,
                        'type' : rows[i].port_type,
                        'status' : 0
                    }
                    port.push(result);
                }
                result = {
                    'result': true,
                    'code': 0o00,
                    'detail': 'success',
                    'station': {
                    'id': rows[0].station_id,
                    'name': rows[0].station_name,
                    'lat': rows[0].latitude,
                    'long': rows[0].longitude,
                    'port' : port
                    }
                } 
            }
            add_api_log(company_id, req.url, '200',"success", getTimeStamp());

            res.json(result);

        } else {
            add_api_log(company_id,req.url, '999',"DB에러 : "+err, getTimeStamp());
            console.log('1. query error : ' + err + '\nquery : ' + query +'\n');

            result = {
                'result': false,
                'code': 510,
                'detail': 'DB 에러',
            } 
            res.json(result);
            return false;
        }
        });
    }

});

//스테이션 관련 처리
router.get('/station/usage',async (req, res) => {
    var api_key = req.query.key;
    var page = req.query.page;
    var period = req.query.period;

    // const identifier = req.body.identifier;
    // const token = req.body.token;

    var company_id = await checkAPI(api_key, pool);
    console.log('checkAPI : '+ company_id);

    if(!company_id){
        result = {
            'result': false,
            'code': 999,
            'detail': '일치하는 API키가 없음',
        } 
        console.log(result);
        add_api_log(null, req.url, '990',"API키 불일치 : "+api_key, getTimeStamp());

        res.json(result);
    } else {

        if(page == undefined || page == null) page = 1;
        if(period == undefined || period == null) period = 0;

        //스테이션 정보 확인
        var query = "select station_usage_history.*, station.identifier as station_id, station.name as station_name, station_port.number as port_numb "+
            "from station_usage_history "+
            "inner join station on station_usage_history.station_id = station.id "+
            "inner join station_port on station_usage_history.port_id = station_port.id "+
            "where user_type = 2 and "+
            "user_id = ? " +
            "order by id DESC";
        var value = [1];

        var result;

        mysqlDB.query(query,value, function (err, rows, fields) {
            if (!err) {
                if(rows.length<1){
                    result = null;
                } else{
                    var info = Array();

                    for(let i=0; i<rows.length; i++){
                        var temp = {
                            'id' : rows[i].id,
                            'date' : moment(rows[i].date).format("YYYY-MM-DD HH:mm:ss"),
                            'start' : moment(rows[i].start).format("YYYY-MM-DD HH:mm:ss"),
                            'complete' : moment(rows[i].charge_complete).format("YYYY-MM-DD HH:mm:ss"),
                            'end' : moment(rows[i].end).format("YYYY-MM-DD HH:mm:ss"),
                            'station' : {
                                'id' : rows[i].station_id,
                                'name' : rows[i].station_name,
                                'port_numb' : rows[i].port_numb
                            }
                        }
                        info.push(temp);
                    }
                    result = {
                        'result': true,
                        'code': 0o00,
                        'detail': 'success',
                        'total': rows.length,
                        'total_page': Math.floor(rows.length%15)+1,
                        'page': page,
                        'info': info
                    } 
                }
                add_api_log(company_id, req.url, '200',"success",getTimeStamp());

                res.json(result);

            } else {
                console.log('1. query error : ' + err + '\nquery : ' + query +'\n');

                result = {
                    'result': false,
                    'code': 510,
                    'detail': 'DB 에러',
                }
                add_api_log(company_id,req.url, '999',"DB에러 : "+err, getTimeStamp());

                res.json(result);
                return false;
            }
            });
    }

});

async function checkAPI(key, pool, req){
    var query = "select * from admin where api = ?";
    var value = [key];

    const result = await pool.query(query,value);


    // var query = "insert into api_result(admin_id)";
    // var value = [key];

    // const result1 = await pool.excute(query,value);


    if (result[0].length > 0)
        return result[0][0]['id'];
    else
        return false;



    // var result = mysqlDB.query(query,value, function (err, rows, fields) {
    //     if (!err) {
    //         if(rows.length<1){ 
    //             console.log('checkAPI : false')
    //             return false;
                
    //         } else{
    //             console.log('checkAPI : '+rows[0].id)
    //             return rows[0].id;
    //         }

    //     } else {
    //         console.log('1. query error : ' + err + '\nquery : ' + query +'\n');
    //         return false;
    //     }
    // });

    // console.log('promise return : '+result);

    // return result;
}

function add_api_log(admin_id, url, result, msg, date){
    const query = "insert into log_api(admin_id, url, result, message, date) values(?,?,?,?,?)";
    const value = [admin_id, url, result, msg, date];

    mysqlDB.query(query,value, function (err, rows, fields) {
        if (!err) {
            return true;
        } else {
            console.log('query error : ' + err);
            return false;
        }
    });
}

function getTimeStamp() {
    var d = new Date();
    var s =
        leadingZeros(d.getFullYear(), 4) + '-' +
        leadingZeros(d.getMonth() + 1, 2) + '-' +
        leadingZeros(d.getDate(), 2) + ' ' +

        leadingZeros(d.getHours(), 2) + ':' +
        leadingZeros(d.getMinutes(), 2) + ':' +
        leadingZeros(d.getSeconds(), 2);

    return s;
}

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

module.exports = router;