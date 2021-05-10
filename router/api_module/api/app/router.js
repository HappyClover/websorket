var express = require('express')
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
//mysqlDB.connect();


//라우터 
var router_api_join = require('./router/api_module/api/app/join');
var router_api_login = require('./router/api_module/api/station/login');
var router_api_mypage = require('./router/api_module/api/station/mypage');
var router_api_station = require('./router/api_module/api/station/station');


//회원가입 
router.use('/join', router_api_join);

//로그인
router.use('/login', router_api_login);

//스테이션
router.use('/station', router_api_station);

module.exports = router;