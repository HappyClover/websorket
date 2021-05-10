var express = require('express')
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
//mysqlDB.connect();

//회원가입 처리
router.post('/', (req, res) => {
    console.log(req.body);
    
    const api_key = req.body.key;
    const phone = req.body.phone;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const marketing = req.body.marketing;

    const port_type = req.body.port_type;
    const port_voltage = req.body.port_voltage;
    const port_ampere = req.body.port_ampere;

    if(checkAPI(api_key)){

    }else{
    let result = {
        "result": false,
        "code": "100",
        "detail": "API키 불일치"
    }
    }

    var query = "insert into user(first_name, last_name, phone, status) values(?,?,?,?)";
    var value = [first_name, last_name, phone, 1];

    // mysqlDB.query(query,value, function (err, rows, fields) {
    //   if (!err) {
    //     var result = [
    //       {'result' : true }
    //     ]
    //   } else {
    //     console.log('query error : ' + err);
    //     return false;
    //   }
    // });  

    
});


//충전 전 유저 확인
router.get('/charge/user_check/', (req, res) => {
    var api_key = req.query.key;
    const token = req.query.token;
    // const identifier = req.body.identifier;
    // const token = req.body.token;

    let isUsing = false;
    let isPay = false;
    let isBlacklist = false;
    let isNotUser = false;

    if(api_key != "test"){
    res.send("잘못된 api키 입니다.");
    return false;
    }

    //사용중인 충전소가 있는지
    var query = "select station_usage_history.id as history_id, station_usage_history.end as history_end, station_usage_history.status as history_status, "+
    "user_pay_history.aid "+
        "from user "+
        "left join station_usage_history on station_usage_history.user_id = user.id "+
        "left join user_pay_history on user_pay_history.user_id = user.id "+
        "where user.token = ?";
    var value = (token);

    mysqlDB.query(query,value, function (err, rows, fields) {
    if (!err) {
        if(rows.length<1){

        } else{
        if(rows[0].status >=3)
            isPay = true;

        }
    } else {
        console.log('1. query error : ' + err + '\nquery : ' + query +'\n');
    }
    });

    //미결제 내역이 있는지
    var query = "select user.id, "+
    "user_pay_history.aid "+
    "from user "+
        "left join user_pay_history on user_pay_history.user_id = user.id "+
    "where token = ?";
var value = (token);

mysqlDB.query(query,value, function (err, rows, fields) {
    if (!err) {
    if(rows.length<1){
    } else {
        for(var i =0; i<rows.length; i++){
        if(rows[i].aid == null){
            isPay = true;
            break;
        }
        }
    }
    } else {
    console.log('2. query error : ' + err + '\nquery : ' + query+'\n');
    }

});

    //블랙리스트 유저인지, 충전규격 등록이 되어 있는지
    var query = "select user.status, charge_spec.id "
    + "from user "
    + "left join charge_spec on charge_spec.user_id = user.id "
    + "where token = ?";
    var value = (token);
    
    mysqlDB.query(query,value, function (err, rows, fields) {
    if (!err) {
        if(rows.length<1){
        
        } else {
        for(var i =0; i<rows.length; i++){
            if(rows[i].aid == null){
            isPay = true;
            break;
            }
        }
        }

    } else {
        console.log('3. query error : ' + err + '\nquery : ' + query +'\n');
    }
    });

    console.log(isPay+' '+isUsing+' '+isBlacklist);

    if(isUsing || isBlacklist || isPay ){
    var result, msg, code;

    if(isUsing){
        msg = '아직 사용중인 스테이션이 있습니다.';
        code = 401;
    }

    if(isPay){
        msg = '미결제 내역이 있습니다. 마이페이지를 확인해 주세요';
        code = 402;
    }

    if(isBlacklist){
        msg = '사용이 불가능한 상태입니다. 고객센터로 문의해 주세요.';
        code = 999;
    }
    
    var result = {
        'result': false,
        'code': code,
        'message': msg
    }
    res.send(result);
    } else {
    var result = {
        'result': true,
        'code': true,
        'detail': "success"
    }

    res.send(result);

    }
});

//QR코드 인식 시
router.post('/charge/station_check/', (req, res) => {
    var api_key = req.body.key;
    const qrCode = req.body.code;
    const token = req.body.token;
    // const identifier = req.body.identifier;
    // const token = req.body.token;

    if(api_key != "test"){
    result = {
        'result': false,
        'code': 900,
        'message': '일치하는 API키가 없음',
        'station': null
    } 
    console.log(result);
    res.send(result);
    return false;
    }

    //스테이션 정보 확인
    var query = "select * "+
        "from station "+
        "where code = ?";
    var value = (qrCode);

    var result;


    mysqlDB.query(query,value, function (err, rows, fields) {
    if (!err) {
        if(rows.length<1){
        result = {
            'result': false,
            'code': 999,
            'message': '일치하는 스테이션이 없습니다.'
        } 
        } else{
        result = {
            'result': true,
            'code': 000,
            'message': 'success',
            'station': {
            'id': rows[0].identifier,
            'lat': rows[0].latitude,
            'long': rows[0].longitude,
            'name': rows[0].name,
            'able': true,
            }
        } 
        console.log(result);
        }
        res.send(result);

    } else {
        console.log('1. query error : ' + err + '\nquery : ' + query +'\n');
    }
    });

    //사용자 충전 전류 확인
    var query = "select * "+
        "from user "+
        "where token = ?";
    var value = (qrCode);

    var result;


    mysqlDB.query(query,value, function (err, rows, fields) {
    if (!err) {
        if(rows.length<1){
        result = {
            'result': false,
            'code': 999,
            'message': '일치하는 스테이션이 없습니다.'
        } 
        } else{
        result = {
            'result': true,
            'code': 000,
            'message': 'success',
            'station': {
            'id': rows[0].identifier,
            'lat': rows[0].latitude,
            'long': rows[0].longitude,
            'name': rows[0].name,
            'able': true,
            }
        } 
        console.log(result);
        }
        res.send(result);

    } else {
        console.log('1. query error : ' + err + '\nquery : ' + query +'\n');
    }
    });


});

//메인 화면
router.get('/get/main/', (req, res) => {
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
        "code": "100",
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


//주소 검색 기능
router.get('/get/station_address/', (req, res) => {
    var api_key = req.query.key;
    const address = "%"+req.query.address+"%";

    if(!checkAPI(api_key)){
    result = {
        "result": false,
        "code": "100",
        "detail": "API키 불일치"
    }
    res.send(result);
    } else {
    var query = "select id, name, adress, latitude as 'lat', longitude as 'long' from station where adress like ?";
    var value = address;
    
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
            "station": rows,
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


//마이페이지
router.get('/mypage/info/get/myinfo/', (req, res) => {
    var api_key = req.query.key;
    const token = req.query.token;

    if(!checkAPI(api_key)){
    result = {
        "result": false,
        "code": "100",
        "detail": "API키 불일치"
    }
    res.send(result);
    } else {
    var query = "select user.first_name, user.last_name, user.email, user.billingcard, charge_spec.volt, charge_spec.ampere, charge_spec.port_type from user left join charge_spec on user.id = charge_spec.user_id where token = ?";
    var value = token;
    
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
            "user": {
                "name": rows[0].last_name+" "+rows[0].first_name,
                "email": rows[0].email,
                "card_info": rows[0].billingcard,
            },
            "charge":{
                "type": rows[0].port_type,
                "voltage": rows[0].volt,
                "ampere": rows[0].ampere
            }
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

//마이페이지
router.post('/mypage/info/update/myinfo/', (req, res) => {
    var api_key = req.query.key;
    const token = req.query.token;

    if(!checkAPI(api_key)){
    result = {
        "result": false,
        "code": "100",
        "detail": "API키 불일치"
    }
    res.send(result);
    } else {
    var query = "select user.first_name, user.last_name, user.email, user.billingcard, charge_spec.volt, charge_spec.ampere, charge_spec.port_type from user left join charge_spec on user.id = charge_spec.user_id where token = ?";
    var value = token;
    
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
            "user": {
                "name": rows[0].last_name+" "+rows[0].first_name,
                "email": rows[0].email,
                "card_info": rows[0].billingcard,
            },
            "charge":{
                "type": rows[0].port_type,
                "voltage": rows[0].volt,
                "ampere": rows[0].ampere
            }
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


//공지사항
router.get('/notice/get/list/', (req, res) => {
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

//공지사항
router.get('/notice/get/list/', (req, res) => {
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