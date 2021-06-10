var express = require('express');

var router = express.Router(); // 이번 예제에서는 express를 사용합니다.
//DB세팅
var mysqlDB = require('../../stationDB.js');
var pool = require('../../stationPool.js');

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');


router.get('/', (req, res) => {
  if(checkSession(req)){
      res.redirect('/controll/main/');
  } else {
      res.render('index_station.ejs');
  }
});

router.post('/login/', (req, res) => {
    const input_id = req.body.id;
    const input_pw = req.body.pw;

    var value = (id);
    var query = "select * from admin where identifier = ?";
    mysqlDB.query(query,value, function (err, rows, fields) {
      console.log(rows);

      if(!err){
        if(rows.length < 1){
            var msg = "아이디 및 비밀번호가 틀렸습니다.";
            res.send("<scipt>parent.login_fail("+msg+");</scipt>");
        } else {
            const pw = rows[0].password;

            if (pw == input_pw){
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
            req.session.uid = 'clover';
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
router.get('/controll/main/', async (req, res) => {
    checklogin(checkSession(req), res);

    //관리자 정보
    //이름, 마지막 접속 일자
    let admin = {
        'name':"김송현",
        'last':'2021-05-31'
    };

    var query = "select * from admin where identifier = ?"
    var value = [req.session.uid];
    const admin_result = await pool.query(query,value);
    const admin_array = admin_result[0];

    admin = {
        'name':"김송현",
        'last':'2021-05-31'
    };

    //스테이션 정보
    //전체 설치대수, 전체 포트 수, 현재 사용중인 포트
    let station={
        'all':4,
        'port':16,
        'isUse': 8
    };

    //에러정보
    //오늘, 최근1주일, 미해결건
    let error={
        'today':5,
        'week':10,
        'unresolve': 1
    };

    //시간대별 이용
    //일반 배열
    let usage={
        'usage': [
            {
                'value': 12
            },
            {
                'value': 8
            },
            {
                'value': 15
            },
            {
                'value': 19
            },
            {
                'value': 22
            },
            {
                'value': 10
            },
            {
                'value': 15
            },
            {
                'value': 30
            }
        ]
    };

    res.render('index_station.ejs', {admin, station, error, usage});
});

//관제시스템 -> 스테이션 현황
router.get('/controll/status/', async (req, res) => {
    checklogin(checkSession(req), res);

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
router.get('/controll/charge/', async (req, res) => {
    checklogin(checkSession(req), res);

    let admin = {
        'name':"김송현",
        'last':'2021-05-31'
    };

    let month = {
        'last': 13,
        'this': 15
    }

    let today = {
        'last': 1,
        'this': 3,
    }

    let usage = {
        "usage" :[
            {
                "id": 4,
                "code": "셰2003A0001",
                "numb": 1,
                "port": 1,
                "user": "주식회사 셰빌리티",
                "start": "2021-06-01 12:30",
                "end": "2021-06-01 14:30",
                "value": 0
            },
            {
                "id": 3,
                "code": "셰2003A0001",
                "numb": 1,
                "port": 1,
                "user": "주식회사 셰빌리티",
                "start": "2021-06-01 12:30",
                "end": "2021-06-01 14:30",
                "value": 0
            },
            {
                "id": 2,
                "code": "셰2003A0001",
                "numb": 1,
                "port": 1,
                "user": "주식회사 셰빌리티",
                "start": "2021-06-01 12:30",
                "end": "2021-06-01 14:30",
                "value": 0
            },
            {
                "id": 1,
                "code": "셰2003A0001",
                "numb": 1,
                "port": 1,
                "user": "주식회사 셰빌리티",
                "start": "2021-06-01 12:30",
                "end": "2021-06-01 14:30",
                "value": 0
            }
        ]
    }

    res.render('./router/controll/charge_list.ejs', {admin, month, today, usage});
});

/* 스테이션 관리
* 스테이션 리스트 */
router.get('/station/list/', async (req, res) => {
    checklogin(checkSession(req), res);

    let admin = {
        'name':"김송현",
        'last':'2021-05-31'
    };
    let station = {
        station:[
            {
                'code': '셰2106C0001',
                'name': '윙스테이션 테스트 1호기',
                'address': '테스트 주소',
                'type': 1,
                'admin':'셰빌리티'
            },
            {
                'code': '셰2103C0001',
                'name': '윙스테이션 경북대 1호기',
                'address': '대구 북구 대현로3길 5-21',
                'type': 1,
                'admin':'셰빌리티'
            },
            {
                'code': '셰2103C0002',
                'name': '윙스테이션 알파시티 1호기',
                'address': '대구 수성구 알파시티 DIP 앞',
                'type': 1,
                'admin':'셰빌리티'
            },
            {
                'code': '셰2103C0003',
                'name': '윙스테이션 알파시티 2호기',
                'address': '대구 수성구 알파시티 DIP 앞',
                'type': 1,
                'admin':'셰빌리티'
            },
        ]
    };
    res.render('index_station.ejs',{admin, station});
});

function checkSession(req) {
  if(req.session.uid!==undefined){
    return true;
  } else {
    return false;
  }
}

function checklogin(isSesstion, res) {
    if(!isSesstion){
        res.redirect('/');
    }
}
module.exports = router;