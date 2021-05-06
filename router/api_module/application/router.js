var express = require('express')
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
//mysqlDB.connect();


//자동 로그인 처리
router.get('/', (req, res) => {
    res.send("윙스테이션 api입니다. 접근 키 발급 관련은 주식회사 셰빌리티(1600-2834) 또는 cto@shability.io로 문의주세요");

});

router.post('/', (req, res) => {
    res.send("api 키 테스트 결과");
    
});


module.exports = router;