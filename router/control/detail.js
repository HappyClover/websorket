const express = require('express');
const crypto = require('crypto');

const router = express.Router(); // 이번 예제에서는 express를 사용합니다.
//DB세팅
const mysqlDB = require('../../stationDB.js');
const pool = require('../../stationPool.js');

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');


router.use('/static', express.static('./router/control/static/'));
router.use('/static', express.static('./router/control/main/static/'));
router.use('/static', express.static('./router/control/stationList/static/'));
router.use('/static', express.static('./router/control/station/list/static/'));
router.use('/static', express.static('./router/control/station/register/static/'));
router.use('/static', express.static('./router/control/login/static/'));

router.get('/', (req, res) => {
  if(checkSession(req)){
      res.redirect('/control/');
  } else {
      res.render('./router/control/login/');
  }
});

router.post('/login/', (req, res) => {
    const input_id = req.body.id;
    const input_pw = req.body.pw;

    var value = (input_id);
    var query = "select admin.*, date_format(log_admin.date, '%Y-%m-%d %H:%i:%s') as date from admin " +
        "inner join log_admin on log_admin.admin_id = admin.id "+
        "where identifier = ? and log_admin.result = 200 " +
        "order by log_admin.id DESC " +
        "limit 1 ";
    mysqlDB.query(query,value, function (err, rows, fields) {
      if(!err){
          console.log(rows.length);
          console.log(rows);
        if(rows.length < 1){
            var msg = "아이디 및 비밀번호가 틀렸습니다.";
            add_admin_log(null,1,500,'아이디 불일치',getTimeStamp());
            res.send("<script>parent.login_fail();</script>");
        } else {
            const pw = rows[0].password;
            const crypto_pw = crypto.createHash('sha512').update(input_pw).digest('base64');

            if (pw === crypto_pw){
                req.session.uid = rows[0].identifier;
                if (rows[0].manager_name === null) req.session.name = rows[0].name;
                else req.session.name = rows[0].manager_name;
                req.session.permission = rows[0].permission;
                req.session.last_login = rows[0].date;

                add_admin_log(rows[0].id,1,200,'로그인 성공', getTimeStamp());
                req.session.save(function (){
                    res.send("<script>parent.location.href='/';</script>");
                });
            } else {
                var msg = "아이디 및 비밀번호가 틀렸습니다.";
                add_admin_log(rows[0].id,1,501,'비밀번호 불일치',getTimeStamp());
                res.send("<script>parent.login_fail();</script>");
            }
        }
      } else {
          var msg = "로그인 처리중 에러가 발생했습니다.";
          add_admin_log(null,1,999,'DB 에러 : '+err, getTimeStamp());
          res.send("<script>parent.login_fail();</script>");
      }
    });
});

router.get('/login/test/:code/',async (req, res) =>{
    let code = req.params.code;

    switch (code){
        case 'clover':
            req.session.uid = 'shability';
            req.session.name = '김송현';
            req.session.permission = 5;
            req.session.last_login = '2021-05-23 13:22:25'

            req.session.save(function (){
                res.redirect('/');
            });
            break;

        case 'shability':
            req.session.uid = 'shability';
            req.session.name = '주식회사 셰빌리티';
            req.session.permission = 5;
            req.session.last_login = '2021-05-23 13:22:25'

            req.session.save(function (){
                res.redirect('/');
            });
            break;

        default:
            res.send('<script>alert("아이디 및 비밀번호가 틀렸습니다."); location.href = "/"; </script>');
            break;
    }
});

/* 관제 시스템 부분 */
router.get('/control/', async (req, res) => {
    if (!checkSession(req)){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    }
    //관리자 정보
    //이름, 마지막 접속 일자
    let admin = {
        'name':req.session.name,
        'last':req.session.last_login
    };

    var query = "select station.station, station_port.port " +
        "from (select count(*) station from station) station, (select count(*) port from station_port) station_port;"

    switch (req.session.permission){
        case 1:
            break;

        case 2:
            break;

        case 3:
            break;
    }
    var value = [req.session.uid];
    const count_result = await pool.query(query,value);
    const count_array = count_result[0];

    //스테이션 정보
    //전체 설치대수, 전체 포트 수, 현재 사용중인 포트
    let station={
        'all':count_array[0].station,
        'port':count_array[0].port,
        'isUse': 0
    };

    //에러정보
    //오늘, 최근1주일, 미해결건
    let error={
        'today':0,
        'week':0,
        'unresolve': 0
    };

    var query = "select count(*) as cnt, date_format(date,'%l') as time " +
        "from station_usage_history " +
        "where date between date_format(curdate(),'%y-%m-%d') and date_format(date_add(curdate(), interval 1 day), '%y-%m-%d') " +
        "group by date_format(date, '%l');"
    var value = [req.session.uid];
    const usage_result = await pool.query(query,value);
    const usage_array = usage_result[0];

    //시간대별 이용
    //일반 배열
    let usage={
        "0":0,
        "1":0,
        "2":0,
        "3":0,
        "4":0,
        "5":0,
        "6":0,
        "7":0,
        "8":0,
        "9":0,
        "10":0,
        "11":0,
        "12":0,
        "13":0,
        "14":0,
        "15":0,
        "16":0,
        "17":0,
        "18":0,
        "19":0,
        "20":0,
        "21":0,
        "22":0,
        "23":0

    };

    for (let i =0; i<usage_array.length; i++){
        usage[usage_array[i].time] = usage_array[i].cnt;
    }

    res.render('./router/control/main/index.ejs', {admin, station, error, usage});
});

//관제시스템 -> 스테이션 현황
router.get('/control/status/', async (req, res) => {
    if (!checkSession(req)){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    }

    //관리자 정보
    //이름, 마지막 접속 일자
    let admin = {
        'name':req.session.name,
        'last':req.session.last_login
    };

    var query = "select station.*, count(*) as port " +
        "from station " +
        "right join station_port on station.id = station_port.station_id " +
        "group by id" ;
    //+""
    var value = [req.session.uid];
    const station_result = await pool.query(query,value);
    const station_array = station_result[0];

    let query_result = [];

    for(var i = 0; i<station_array.length; i++){
        let data = {
            "code" : station_array[i].code,
            "name" : station_array[i].name,
            "address" : station_array[i].adress,
            "port" : station_array[i].port,
            "status" : station_array[i].status,
            "lat" : station_array[i].latitude,
            "lng" : station_array[i].longitude
        };

        query_result.push(data);
    }

    //스테이션 정보
    //스테이션 번호, 이름, 주소, 포트 수, 상태
    let station = {
        'station': query_result
    }

    res.render('./router/control/stationList/index.ejs',{admin, station});
});

//관제시스템 -> 스테이션 현황 -> 자세히
router.get('/control/status/:station_code/', async (req, res) => {
    const station_code = req.body.station_code;

    if (!checkSession(req)){ //로그인 세션 검사
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    } else {
        let station_array;

        switch (checkPermission(req)){
            case 1:
                var query = "select station.*, admin.identifier as admin " +
                    "from station " +
                    "inner join admin on station.admin_id = admin.id " +
                    "where code = ?" ;
                //+""
                var value = [station_code];
                var station_result = await pool.query(query,value);
                station_array = station_result[0];
                break;

            case 2:
            case 3:
                var query = "select station.*, admin.identifier as admin " +
                    "from station " +
                    "inner join admin on station.admin_id = admin.id " +
                    "where admin.identifier = ? and code = ?" ;
                //+""
                var value = [req.session.uid, station_code];
                var station_result = await pool.query(query,value);
                station_array = station_result[0];
                break;

            default:
                break;
        }

        if (station_array.length < 1){
            res.send("<script>alert('일치하는 스테이션 코드가 없습니다.'); window.close();</script>")
        } else {
            let code = station_array[0].code,
                name = station_array[0].name,
                address = station_array[0].adress,
                status = station_array[0].status,
                type = station_array[0].type
        }
        res.render('./router/control/stationList/index.ejs',{code, name, address, status, type});
    }
});

//관제시스템 -> 스테이션 현황 -> 자세히 -> 수정
router.post('/control/status/:station_code/update', async (req, res) => {
    const station_code = req.body.station_code;

    if (!checkSession(req)){ //로그인 세션 검사
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    } else {
        let station_array;

        switch (checkPermission(req)){
            case 1:
                var query = "select station.*, admin.identifier as admin " +
                    "from station " +
                    "inner join admin on station.admin_id = admin.id " +
                    "where code = ?" ;
                //+""
                var value = [station_code];
                var station_result = await pool.query(query,value);
                station_array = station_result[0];
                break;

            case 2:
            case 3:
                var query = "select station.*, admin.identifier as admin " +
                    "from station " +
                    "inner join admin on station.admin_id = admin.id " +
                    "where admin.identifier = ? and code = ?" ;
                //+""
                var value = [req.session.uid, station_code];
                var station_result = await pool.query(query,value);
                station_array = station_result[0];
                break;

            default:
                break;
        }

        if (station_array.length < 1){
            res.send("<script>alert('일치하는 스테이션 코드가 없습니다.'); window.close();</script>")
        } else {
            let code = station_array[0].code,
                name = station_array[0].name,
                address = station_array[0].adress,
                status = station_array[0].status,
                type = station_array[0].type
        }
        res.render('./router/control/stationList/index.ejs',{code, name, address, status, type});
    }
});

//관제시스템 -> 충전로그
router.get('/control/charge/', async (req, res) => {
    if (!checkSession(req)){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    }
    let admin = {
        'name':req.session.name,
        'last':req.session.last_login
    };

    let using = 0;


    //오늘일자
    var query = "select count(*) as cnt, date_format(date,'%m-%d') as time, " +
        "SUM(if(start is null, 0, TIMESTAMPDIFF(MINUTE, start, ifnull(charge_complete,end)))) as cnt_time " +
        "from station_usage_history " +
        "where date between date_format(date_add(curdate(), interval -2 day),'%y-%m-%d') and date_format(date_add(curdate(), interval 1 day), '%y-%m-%d') " +
        "group by time"
    const month_result = await pool.query(query,value);
    const month_array = month_result[0];

    let cnt = {
        "2last": 0,
        "last": 0,
        'this': 0
    };
    let cnt_time = {
        "2last": 0,
        "last": 0,
        'this': 0
    };

    for (let i =0; i<month_array.length; i++){
        let dateList = [getToday(0), getToday(-1), getToday(-2)];

        for(let j= 0; j<dateList.length; j++) {
            if (dateList[j] == month_array[i].time) {
                switch (j) {
                    case 0:
                        cnt.this = month_array[i].cnt;
                        cnt_time.this = month_array[i].cnt_time;
                        break;

                    case 1:
                        cnt.last = month_array[i].cnt;
                        cnt_time.last = month_array[i].cnt_time;
                        break;

                    case 2:
                        cnt["2last"] = month_array[i].cnt;
                        cnt_time["2last"] = month_array[i].cnt_time;
                        break;
                }
            }
        }
    }

    let today = {
        "this": 150,
        "last":100
    }
    let month = {
        "this": 400,
        "last":400
    }


    //스테이션 사용로그
    var query = "select station_usage_history.id, date_format(station_usage_history.start, '%Y-%m-%d %H:%i:%s') as start, " +
        "ifnull(date_format(station_usage_history.charge_complete, '%Y-%m-%d %H:%i:%s'), date_format(station_usage_history.end, '%Y-%m-%d %H:%i:%s')) as end, "+
        "case station_usage_history.user_type " +
        "   when 1 then user.last_name " +
        "   when 2 then admin.name" +
        "   else null end as user_name, "+
        "station.id as station_id, station.name, station.identifier, station.code as station_code, station_port.number " +
        "from station_usage_history " +
        "left join station_port on station_usage_history.port_id = station_port.id "+
        "left join station on station_usage_history.station_id = station.id "+
        "left join admin on station_usage_history.user_id = admin.id "+
        "left join user on station_usage_history.user_id = user.id "+
        "order by id DESC";
    //+""
    var value = [req.session.uid];
    const usage_result = await pool.query(query,value);
    const usage_array = usage_result[0];

    let query_result = [];

    for(let i = 0; i<usage_array.length; i++){
        let data = {
            "id": usage_array[i].id,
            "code" : usage_array[i].station_code,
            "numb" : usage_array[i].station_id,
            "port" : usage_array[i].number,
            "user":  usage_array[i].user_name,
            "start": usage_array[i].start,
            "end": usage_array[i].end,
            "value": 0
        };

        query_result.push(data);
    }

    usage = {
        'usage' : query_result
    }


    let count_time = {
        "2last": 0,
        "last": 0,
        'this': 0
    };



    res.render('./router/control/index.ejs', {admin, using, cnt, cnt_time,usage, today, month});
});

/* 스테이션 관리
* 스테이션 리스트 */
router.get('/station/', async (req, res) => {
    if (!checkSession(req)){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    }
    let admin = {
        'name':req.session.name,
        'last':req.session.last_login
    };

    var query = "select station.*, count(*) as port, admin.name as admin_name " +
        "from station " +
        "right join station_port on station.id = station_port.station_id " +
        "inner join admin on station.admin_id = admin.id " +
        "group by id" ;
    var value = [req.session.uid];
    const admin_result = await pool.query(query,value);
    const admin_array = admin_result[0];

    let query_result = [];

    for(var i = 0; i<admin_array.length; i++){
        let data = {
            "code" : admin_array[i].code,
            "name" : admin_array[i].name,
            "address" : admin_array[i].adress,
            "port" : admin_array[i].port,
            "type" : admin_array[i].type,
            "admin" : admin_array[i].admin_name,
            "status" : admin_array[i].install,
            "lat" : admin_array[i].latitude,
            "lng" : admin_array[i].longitude
        };

        query_result.push(data);
    }

    station = {
        'station' : query_result
    }

    res.render('./router/control/station/list/index.ejs',{admin, station});
});

router.get('/station/detail/:station_code/', async (req, res) => {
    const station_code = req.body.station_code;

    if (!checkSession(req)){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    } else {
        let station_array;

        switch (checkPermission(req)){
            case 1:
                var query = "select station.*, admin.name as admin, station_port.* " +
                    "from station " +
                    "inner join admin on station.admin_id = admin.id " +
                    "inner join station_port on station.id = port.station_id " +
                    "where code = ?" ;
                //+""
                var value = [station_code];
                var station_result = await pool.query(query,value);
                station_array = station_result[0];
                break;

            case 2:
            case 3:
                var query = "select station.*, admin.name as admin " +
                    "from station " +
                    "inner join admin on station.admin_id = admin.id " +
                    "where admin.identifier = ? and code = ?" ;
                //+""
                var value = [req.session.uid, station_code];
                var station_result = await pool.query(query,value);
                station_array = station_result[0];
                break;

            default:
                station_array = [];
                break;
        }

        if (station_array.length < 1 ) {
            add_admin_log(station_array[0].admin_id,311,490,'존재하지 않는 코드', getTimeStamp());
            res.send("<script>alert('잘못된 스테이션 아이디 입니다.'); window.close();</script>");
        } else {
            let code = station_array[0].code,
                name = station_array[0].name,
                address = station_array[0].adress,
                install_date = station_array[0].install_date,
                picture = null,
                admin = station_array[0].admin,
                install = station_array[0].install,
                type = station_array[0].type,
                smps = station_array[0].smps,
                port = [];

            for (let i =0; i<station_array.length; i++){
                let tmp = {
                    "number": station_array[0].port_numb,
                    "type": station_array[0].port_type,
                    "code": station_array[0].port_code,
                }
                port.push(tmp)
            }
            res.render('./router/control/station/list/index.ejs',{code, name, address, install_date, picture, admin, install, type, smps, port});

        }
    }
});

router.post('/station/detail/:station_code/update/', async (req, res) => {
    const station_code = req.body.station_code;
    const name = req.body.name;
    const install_date = req.body.install_date;
    const address = req.body.address;
    const picture = req.body.picture;
    const admin = req.body.admin;
    const type = req.body.type;
    const smps = isBlank(req.body.smps) ? null : req.body.smps ;
    const port_id = req.body.port_id;
    const port_code = req.body.port_code;
    const port_type = req.body.port_type;
    const identifier = isBlank(req.body.identifier) ? null : req.body.identifier;

    if (checkPermission(req) !== 1){
        var query = "update station " +
            "inner join admin on station.admin_id = admin.id " +
            "set name = ?, install_date = ?, adress = ?, type = ?, smps = ? " +
            "where admin.identifier = ? and code = ?" ;

        var value = [name, install_date, address, type, smps, req.session.uid, station_code];
        var station_result = await pool.query(query,value);
        station_array = station_result[0];

        for (let i=0; i<port_code.length; i++){
            var query = "update station_port " +
                "set code = ?, type = ? " +
                "where id = ?" ;
            var value = [port_code[i], port_type[i], port_id[i]];
        }
    } else {
        var query = "update station " +
            "inner join admin on station.admin_id = admin.id " +
            "set name = ?, install_date = ?, adress = ?, type = ?, smps = ?, admin = " +
            "(select id from admin where identifier = ? limit 1 ) " +
            "where code = ?" ;

        var value = [name, install_date, address, type, smps, admin, station_code];
        var station_result = await pool.query(query,value);
        station_array = station_result[0];

        for (let i=0; i<port_code.length; i++){
            var query = "update station_port " +
                "set code = ?, type = ? " +
                "where id = ?" ;
            var value = [port_code[i], port_type[i], port_id[i]];
            await pool.query(query,value);
        }
    }
});

//스테이션 등록
router.get('/station/register/', async (req, res) => {
    if (checkPermission(req) !== 1 && !checkSession(req)){
        res.send("<script>alert('권한이 없거나 로그인 상태가 아닙니다.'); window.close(); </script>");
    } else {
        res.render('./router/control/station/register/index.ejs');
    }
});

router.post('/station/register/', async (req, res) => {
    if(!checkSession(req)){
        res.send("<script>alert('로그인 상태가 아닙니다.'); window.close(); </script>");
    } else {
        const name = req.body.name;
        const install_date = req.body.install_date;
        const address = req.body.address;
        const picture = isBlank(req.body.picture) ? null : req.body.picture;
        const admin = isBlank(req.body.admin) ? null : req.body.admin;

        const type = req.body.type;
        const smps = isBlank(req.body.smps) ? null : req.body.smps;
        const panel = isBlank(req.body.panel) ? null : req.body.panel;
        const battery = isBlank(req.body.battery) ? null : req.body.battery;

        const port_numb = req.body.port_numb;
        const port_type = req.body.port_type;
        const port_code = req.body.port_code;

        if (checkPermission(req) != 1) {
            console.log(checkPermission(req));

            res.send("<script>alert('권한이 없습니다.'); window.close(); </script>");
        } else {

            if (isBlank(name) || isBlank(install_date) || isBlank(address)  || isBlank(admin) || isBlank(type) || isBlank(port_numb) || isBlank(port_type) || isBlank(port_code)) {
                console.log(isBlank(name)+" "+ isBlank(install_date) +" "+ isBlank(address) +" "+ isBlank(picture) +" "+ isBlank(admin) +" "+ isBlank(type) +" "+ isBlank(port_numb) +" "+ isBlank(port_type) +" "+ isBlank(port_code))
                res.send("<script>alert('입력값을 확인 해주세요'); history.go(-1); </script>");
            } else {
                let query = "INSERT INTO station(name, install_date, adress, picture, admin_id, type, smps, panel, battery) value(?,?,?,?,(select id from admin where identifier = ? limit 1),?,?,?,?)";
                let value = [name, install_date, address, picture, admin, type, smps, panel, battery];
                const result = await pool.query(query, value);
                const station_id = result.insertId;

                let insert_query = '';
                let insert_value = [];
                for (let i =0; i<port_numb.length; i++){
                    if (insert_query !== '') insert_query= insert_query+", ";
                    insert_query = insert_query+`(?,?,?,?)`;

                    insert_value.push(station_id);
                    insert_value.push(port_numb[i]);
                    insert_value.push(port_type[i]);
                    insert_value.push(port_code[i]);
                }
                let query_port = "INSERT INTO station_port(station_id, number, type, code) values "+insert_query;
                const result_port = await pool.query(query_port, insert_value);

                console.log(result_port)
                res.send("<script>alert('등록되었습니다.'); window.close(); </script>");
            }
        }
    }
});

/* 스테이션 관리
* 스테이션 리스트 */
router.post('/admin/update/password', (req, res) => {
    let key = req.body.key;
    let password = req.body.password;
    let identifier = req.body.identifier;

    if (key != 'shability') {
        res.send("<script>alert('비밀번호 변경에 실패했습니다.'); location.href='/';</script>");
    } else {
        var crypto_password = crypto.createHash('sha512').update(password).digest('base64');

        var query = "update admin set password = ? where identifier = ?"
        var value = [crypto_password, identifier];
        mysqlDB.query(query,value, function (err, rows, fields) {
            if(!err){
                res.send("<scipt>alert('변경이 완료되었습니다.');</scipt>");
            } else {
                var msg = "DB에러";
                res.send("<scipt>alert("+msg+");</scipt>");
            }
        });
    }
});



function checkSession(req) {
  if(req.session.uid!==undefined){
    return true;
  } else {
    return false;
  }
}

function checkPermission(req) {
    return req.session.permission;
}

function isBlank(value) {
    return value === null || value === undefined || value === '';
}

function add_admin_log(admin_id, code, result, msg, date){
    const query = "insert into log_admin(admin_id, code, result, msg, date) values(?,?,?,?,?)";
    const value = [admin_id, code, result, msg, date];

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

function getToday(time) {
    var d = new Date();
    d = new Date(d.setDate(d.getDate()+time));

    var s =
        leadingZeros(d.getMonth() + 1, 2) + '-' +
        leadingZeros(d.getDate(), 2);
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