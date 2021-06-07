var express = require('express');

var router = express.Router(); // 이번 예제에서는 express를 사용합니다.
//DB세팅
var mysqlDB = require('../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');


router.get('/', (req, res) => {
  if(checkSession(req)){
    res.render('index_station.ejs');
  } else {
    res.redirect('/controll/main/');
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


/* 관제 시스템 부분 */
router.post('/controll/main/', (req, res) => {
  
  res.render('index_station.ejs');
});

router.post('/controll/status/', (req, res) => {
  
  res.render('index_station.ejs');
});

router.post('/controll/charge/', (req, res) => {
  
  res.render('index_station.ejs');
});

/* 스테이션 관리 */
router.post('/station/list/', (req, res) => {
  
  res.render('index_station.ejs');
});

function checkSession(req) {
  if(req.session.shability){
    return true;
  } else {
    return false;
  }
}

module.exports = router;