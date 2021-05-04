var express = require('express');
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.

//DB세팅
var mysqlDB = require('../../stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

router.get('/', (req, res) => {
    res.render('index_station.ejs');
  });

module.exports = router;