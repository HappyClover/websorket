var express = require('express');
var url_scheme = require('url-scheme');
var router = express.Router(); // 이번 예제에서는 express를 사용합니다.


const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { count } = require('console');
//mysqlDB.connect();

//메인 화면
router.get('/', (req, res) => {
    res.send("앱 호출. 접근 키 발급 관련은 주식회사 셰빌리티(1600-2834) 또는 cto@shability.io로 문의주세요");
});

//qr화면 호출
router.get('/qr', (req, res) => {
    var route = "qr";
    var code = null;

    res.render("/router/app/index.ejs",{route, code});
});

//스테이션 관련 처리
router.get('/station/:code', (req, res) => {
    var route = "station";
    var code = req.params.code;

    res.render("/router/app/index.ejs" ,{route, code});
});


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

module.exports = router;