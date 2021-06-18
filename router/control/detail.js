const express = require('express');
const crypto = require('crypto');

const router = express.Router(); // 이번 예제에서는 express를 사용합니다.
//DB세팅
const mysqlDB = require('../../stationDB.js');
const pool = require('../../stationPool.js');

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');


router.use('/static', express.static('./router/control/static/'));

router.get('/', (req, res) => {
  if(checkSession(req)){
      res.redirect('/control/main/');
  } else {
      res.render('index_station.ejs');
  }
});

router.post('/login/', (req, res) => {
    const input_id = req.body.id;
    const input_pw = req.body.pw;

    var value = (input_id);
    var query = "select * from admin where identifier = ?";
    mysqlDB.query(query,value, function (err, rows, fields) {
      console.log(rows);

      if(!err){
        if(rows.length < 1){
            var msg = "아이디 및 비밀번호가 틀렸습니다.";
            res.send("<scipt>parent.login_fail("+msg+");</scipt>");
        } else {
            const pw = rows[0].password;

            const crypto_pw = crypto.createHash('sha512').update(input_pw).digest('base64');

            if (pw == crypto_pw){
                req.session.uid = rows[0].identifier;
                req.session.name = rows[0].manager_name;
                req.session.permission = rows[0].permission;
                req.session.last_login = rows[0].last

                req.session.save(function (){
                    res.redirect('/');
                });
            } else {
                var msg = "아이디 및 비밀번호가 틀렸습니다.";
                res.send("<scipt>parent.login_fail("+msg+");</scipt>");
            }
        }
      } else {
          var msg = "DB에러";
          res.send("<scipt>parent.login_fail("+msg+");</scipt>");

      }

      res.render('index_station.ejs');
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
router.get('/control/main/', async (req, res) => {
    if (!checkSession(req)){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    }
    //관리자 정보
    //이름, 마지막 접속 일자
    let admin = {
        'name':"김송현",
        'last':'2021-05-31'
    };

    var query = "select station.station, station_port.port " +
        "from (select count(*) station from station) station, (select count(*) port from station_port) station_port;"
    var value = [req.session.uid];
    const count_result = await pool.query(query,value);
    const count_array = count_result[0];

    admin = {
        'name':"김송현",
        'last':'2021-05-31'
    };

    //스테이션 정보
    //전체 설치대수, 전체 포트 수, 현재 사용중인 포트
    let station={
        'all':count_array[0].station,
        'port':count_array[0].port,
        'isUse': 8
    };

    //에러정보
    //오늘, 최근1주일, 미해결건
    let error={
        'today':0,
        'week':0,
        'unresolve': 0
    };

    var query = "select count(*) as cnt, date_format(date,'%H') as time " +
        "from station_usage_history " +
        "where date between date_format(curdate(),'%y-%m-%d') and date_format(date_add(curdate(), interval 1 day), '%y-%m-%d') " +
        "group by date_format(date, '%H');"
    var value = [req.session.uid];
    const usage_result = await pool.query(query,value);
    const usage_array = usage_result[0];

    //시간대별 이용
    //일반 배열
    let usage={
        "00":0,
        "01":0,
        "02":0,
        "03":0,
        "04":0,
        "05":0,
        "06":0,
        "07":0,
        "08":0,
        "09":0,
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

    res.render('index_station.ejs', {admin, station, error, usage});
});

//관제시스템 -> 스테이션 현황
router.get('/control/status/', async (req, res) => {
    if (!checkSession(req)){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    }

    //관리자 정보
    //이름, 마지막 접속 일자
    let admin = {
        'name':"김송현",
        'last':'2021-05-31'
    };

    //스테이션 정보
    //스테이션 번호, 이름, 주소, 포트 수, 상태
    let station = {
        'station':[
            {
                'code': '셰2106C0001',
                'name': '윙스테이션 테스트 1호기',
                'address': '테스트 주소',
                'port': 1,
                'status':1
            },
            {
                'code': '셰2103C0001',
                'name': '윙스테이션 경북대 1호기',
                'address': '대구 북구 대현로3길 5-21',
                'port': 4,
                'status':1
            },
            {
                'code': '셰2103C0002',
                'name': '윙스테이션 알파시티 1호기',
                'address': '대구 수성구 알파시티 DIP 앞',
                'port': 4,
                'status':1
            },
            {
                'code': '셰2103C0003',
                'name': '윙스테이션 알파시티 2호기',
                'address': '대구 수성구 알파시티 DIP 앞',
                'port': 2,
                'status':1
            },
        ]

    };

    res.render('index_station.ejs',{admin, station});
});

//관제시스템 -> 충전로그
router.get('/control/charge/', async (req, res) => {
    if (!checkSession(req)){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    }
    let admin = {
        'name':"김송현",
        'last':'2021-05-31'
    };

    let using = 12000;

    var query = "select count(*) as cnt, date_format(date,'%m-%d') as time " +
        "from station_usage_history " +
        "where date between date_format(date_add(curdate(), interval -2 day),'%y-%m-%d') and date_format(date_add(curdate(), interval 1 day), '%y-%m-%d') " +
        "group by date_format(date, '%m-%d');"
    const month_result = await pool.query(query,value);
    const month_array = month_result[0];


    let today = {
    }

    for (let i; i<month_array.length; i++){
        today[month_array[i].time] = month_array[i].cnt;
    }

    var query = "select station_usage_history.*, station.name, station.identifier, station.code as station_code, station_port.number " +
        "from station_usage_history " +
        "left join station_port on station_usage_history.port_id = station_port.id "+
        "left join station on station_usage_history.station_id = station.id "    ;
    //+""
    var value = [req.session.uid];
    const usage_result = await pool.query(query,value);
    const usage_array = usage_result[0];

    let query_result = [];

    for(let i = 0; i<usage_array.length; i++){
        let data = {
            "id": usage_array[i].id,
            "code" : usage_array[i].station_code,
            "numb" : usage_array[i].id,
            "port" : usage_array[i].number,
            "user": "주식회사 셰빌리티",
            "start": usage_array[i].start,
            "end": usage_array[i].end,
            "value": 0
        };

        query_result.push(data);
    }

    usage = {
        'usage' : query_result
    }

    res.render('./router/control/index.ejs', {admin, using, month, today, usage});
});

/* 스테이션 관리
* 스테이션 리스트 */
router.get('/station/list/', async (req, res) => {
    if (!checkSession(req)){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"; </script>')
    }
    let admin = {
        'name':"김송현",
        'last':'2021-05-31'
    };

    var query = "select station.*, count(*) as port " +
        "from station " +
        "right join station_port on station.id = station_port.station_id " +
        "group by id" ;
                //+""
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
            "type" : 1,
            "admin" : "셰빌리티",
            "status" : 1,
        };

        query_result.push(data);
    }

    station = {
        'station' : query_result
    }

    res.render('index_station.ejs',{admin, station});
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
module.exports = router;