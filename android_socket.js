var subdomain = require('vhost');
var express = require('express')
var app = express(); // 이번 예제에서는 express를 사용합니다.
var socketio = require('socket.io');
var fs = require('fs');
var https = require('https');
var http = require('http');
// var option = {
//   pfx: fs.readFileSync('/Users/rlathdgus1/ssl/_wildcard_.wingstation.co.kr_202105030C96.pfx'),
//   passphrase: '9bk5rs',
//   minVersion: "TLSv1.2"
// }
var option = {
  pfx: fs.readFileSync('/home/ubuntu/ssl/_wildcard_.wingstation.co.kr_202105030C96.pfx'),
  passphrase: '9bk5rs',
  minVersion: "TLSv1.2"
}

const Crypto = require('crypto-js');
const Mathjs = require('mathjs');
const cryKey = "WINGSTATION";

var station_current;

//스테이션 클래스 배치
var station_class = require('./class/C_station.js');
var user_class = require('./class/C_user.js');
var admin_class = require('./class/C_admin.js');
var company_class = require('./class/C_company.js');
var port_class = require('./class/C_port.js');

//기본 세팅
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//라우터 세팅
//어플리케이션 api 라우터
var router_app_login = require('./router/api_module/application/login');
var router_app_join = require('./router/api_module/application/join');
var router_app_station = require('./router/api_module/application/station');
var router_api = require('./router/api_module/api/router');

//협력업체 api 라우터
var router_app_sharing = require('./router/webapp/router');

//관제페이지 라우터
var router_admin_main = require('./router/controll/detail.js');


//DB세팅
var mysqlDB = require('./stationDB.js');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { rejects } = require('assert');
mysqlDB.connect();

//static 선언
app.use('/request/static', express.static('./router/webapp/static/'));

//어플리케이션 api
// app.use(subdomain('station',router_app_station));
app.use('/join', router_app_join);
app.use('/login', router_app_login);
app.use(subdomain('api.wingstation.co.kr', router_api));

//협력업체 제공 웹앱
app.use(subdomain('webapp.wingstation.co.kr', router_app_sharing));

//관제페이지
app.use(subdomain('admin.wingstation.co.kr',router_admin_main));
app.use(express.static('static'));

app.get('/admin', (req, res) => {
  res.render('index_station.ejs');
});

app.get('/', (req, res) => {
  res.send('wellcome to wingstation');
});

var server;

try {
  server = https.createServer(option, app).listen(443,()=>{
    console.log('Listening at port number 443') //포트는 원하시는 번호로..
})
} catch (error) {
    server = http.createServer(app).listen(80,()=>{
      console.log('Listening at port number 80') //포트는 원하시는 번호로..
  })
}

//return socket.io server.
var io = socketio.listen(server) // 이 과정을 통해 우리의 express 서버를 socket io 서버로 업그레이드를 시켜줍니다.

//룸 종류 선언 (스테이션 접속 룸, 관리자 룸, 사용자 룸)
let room = ['station','admin','user']

//이 배열은 누가 chatroom에 있는지를ß 보여줍니다.
var StationIsOn= [];
var AdminIsOn= [];
var UserIsOn= [];
var companyIsOn= [];

//관제 페이지
app.set('view engine', 'ejs');
app.set('views', './');
app.get('/img/Logo', (req, res) => {
  fs.readFile('./img/Logo.png', function(error, data){
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.end(data);
  })
});

app.get('/img/port_xiaomi', (req, res) => {
  fs.readFile('./img/xiaomi.png', function(error, data){
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.end(data);
  })
});

app.get('/img/port_defalut', (req, res) => {
  fs.readFile('./img/default.png', function(error, data){
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.end(data);
  })
});

app.get('/js/smoothie.js', (req, res) => {
  fs.readFile('./js/smoothie.js', function(error, data){
    res.writeHead(200,{'Content-Type': 'text/javascript'});
    res.end(data);
  })
});



//이 서버에서는 어떤 클라이언트가 connection event를 발생시키는 것인지 듣고 있습니다.
// callback 으로 넘겨지는 socket에는 현재 클라이언트와 연결되어있는 socket 관련 정보들이 다 들어있습니다.
io.on('connection',function (socket){
    var nickname = ``;
    var socket_type = ``; 
    var station_rows;
    var socketID = '';
    var WhoAmI;

    var port_list = new Array();


    console.log(`Connection : SocketId = ${socket.id}`)
    //console.log('join : socketid = ${socket.id}');

    //일단 socket.on('login') 이라는 것은 클라이언트가 login 이라는 이벤트를 발생시키면
    //어떤 콜백 함수를 작동시킬 것인지 설정하는 것입니다.
    socket.on('login',function(data){
      try{
        if(typeof(data) != 'object'){
          var login_data = JSON.parse(data);
        }

        nickname = login_data.name;
        socket_type = login_data.type;

        socket.join(`${socket_type}`)

        switch(socket_type){
          case 'station' :
            var id, name, result;

            //스테이션 정보 확인
            var station_info = new Promise((resolve,rejects)=>{
              var station_query = 'select station.*, station_port.id as port_id, station_port.number as port_numb, station_port.type as port_type from station left join station_port on station.id = station_port.station_id where station.identifier = ?';
              mysqlDB.query(station_query,nickname, function (err, rows, fields) {
                if (!err) { 
                  if(rows.length>0){  
                    station_rows = rows;
                    id = rows[0].id;

                    for(i=0; i<rows.length; i++){
                      // //기존 서버 데이터 확인 후 배열 세팅
                      // var station_query = 'select * from connect_station where id = ?';
                      // mysqlDB.query(station_query,station_rows[i].port_id, function (err, connect_port_rows, fields) {
                      //   if (!err) { 
                      //     if(connect_port_rows.length>0){
                      //       var temp_numb = connect_port_rows.numb;
                      //       var temp_usage_id = connect_port_rows.usage_id;
                      //       var temp_status = connect_port_rows.status;
                      //       var temp_user_id = connect_port_rows.user_id;
                      //       var temp_user_type = connect_port_rows.user_type;

                      //       var temp_port = new port_class(rows[i].port_id, rows[i].port_numb, id)


                      //     } else { //조회결과가 없을때
                      //       console.log("접속 기록이 없음")
                            
                      //     }
                      //   } else {
                      //     console.log('query error : ' + err);
                      //     result = false;
                      //   }
                      // });

                      port = new port_class(rows[i].port_id, rows[i].port_numb, id)
                      port_list[Number(port.getPortNumb())-1] = port;
                      result = true;
                      io.to(room['admin']).emit('a_join_status', 1);
                      socket.join(room['station']);
  
                    }
                    WhoAmI = new station_class(id, nickname, socket.id, port_list);
                    StationIsOn[nickname] = WhoAmI //
  
                    shoot_result(socket, "login", true);
  
                  } else { //조회결과가 없을때
                    shoot_result(socket, "login", false);
                    result = false;
                  }
                } else {
                  console.log('query error : ' + err);
                  result = false;
                }
              });
            });
            break;

          case 'admin' :
            AdminIsOn.push(nickname) //
            socket.join(room['admin']);
            result = true;
            break;

          case 'user' :
            nickname = login_data.name;
            socket_type = login_data.type;

            console.log(nickname);

            var temp = (nickname);
            var user_query = 'select * from user where token = ?';
            mysqlDB.query(user_query,temp, function (err, rows, fields) {
              if (!err) { 
                console.log(rows);

                if(rows.length>0){
                  console.log(`${nickname} has entered ${socket_type} chatroom! ---------------------`)
                  id = rows[0].id;

                  WhoAmI = new user_class(id, nickname, socket.id);
                  UserIsOn[nickname] = WhoAmI //

                  shoot_result(socket, "login", true);

                } else { //조회결과가 없을때
                  console.log("토큰 불일치")
                  shoot_result(socket, "login", false);
                  result = false;
                }
              } else {
                console.log('query error : ' + err);
                result = false;
              }
            });
            break;

            //api를 이용하는 업체
            case 'company' :
              nickname = login_data.api;
              socket_type = login_data.type;
              console.log(nickname);

              var temp = (nickname);

              console.log("API키 : "+temp);

              var user_query = 'select * from admin where api = ?';
              mysqlDB.query(user_query,temp, function (err, rows, fields) {
                if (!err) { 
                  console.log(rows);
  
                  if(rows.length>0){
                    console.log(`${nickname} has entered ${socket_type} chatroom! ---------------------`)
                    id = rows[0].id;
                    identifier = rows[0].identifier;
                    name = rows[0].name;

                    WhoAmI = new company_class(id, identifier, name, socket.id);
                    companyIsOn[id] = WhoAmI //
      
                    shoot_result(socket, "login", true);
                    
                  } else { //조회결과가 없을때
                    console.log("토큰 불일치")
                    shoot_result(socket, "login", false);
                    result = false;
                  }
                } else {
                  console.log('query error : ' + err);
                  result = false;
                }
              });
              break;

            default:
              shoot_result(socket, "login", false,'알수없는 접속자 타입');
              break;
          }


      } catch (exception){
        console.log("캐치 에러")
        shoot_result(io, "login", false);
        console.log(exception);
      }

    })

    //채팅 처리
    socket.on('say',function(data){
        console.log(`${nickname} : ${data}`)

        console.log(StationIsOn);
    
        socket.emit('myMsg',data)

        var d = {
          code: 'message',
          data: true
        }
        console.log(d);
        io.to(StationIsOn['wingstation_knu_2']).emit('result',d);
      
    });

    socket.on('station_list',function(){
      io.of('/').in('station').clients((error, clients) => {
        if (error) throw error;
        // console.log('station_list = '+clients); // => [Anw2LatarvGVVXEIAAAD] 

        if(clients.length>0){
          io.to(room['admin']).emit('a_station_status', true);
        }
    });

  })

    //데이터 인풋 처리
    socket.on('insert',function(data){
      console.log(`${nickname} : ${data}`);
      if(typeof(data) != 'object'){
        var j_data = JSON.parse(data);
      }

      // var staiton_index = StationIsOn.findIndex((station_element, station_value) => {
      //   return station_element.socket_id === socket.id});


      // console.log(StationIsOn[staiton_index]);

      // var station_id = StationIsOn[staiton_index].id
      io.to(room['admin']).emit('a_change_info', data);

      try{
        if(j_data.hasOwnProperty('pv')){
          var key = Object.getOwnPropertyNames(j_data.pv)
          var station_query = 'insert into station_pv(station_id, code, value, date) value(?,?,?,?)';

          var stringDate = getTimeStamp();
          for(i=0; i<key.length; i++){
            switch(key[i]){
              case 'charge_a':
                code = 11;
                sql_query(station_query,[WhoAmI.getStationId(), code, j_data.pv.charge_a, stringDate]);
                console.log('pv_charge_a :' + j_data.pv.charge_a);
                break;

              case 'charge_v':
                code = 12;
                sql_query(station_query,[WhoAmI.getStationId(), code, j_data.pv.charge_v, stringDate]);
                console.log('pv_charge_v : '+ j_data.pv.charge_v);

                break;

              case 'load_a':
                code = 21;
                sql_query(station_query,[WhoAmI.getStationId(), code,j_data.pv.load_a, stringDate]);
                console.log('pv_load_a : '+ j_data.pv.load_a);
                break;

              case 'load_v':
                code = 22;
                sql_query(station_query,[WhoAmI.getStationId(), code,j_data.pv.load_v, stringDate]);
                console.log('pv_load_v : '+ j_data.pv.load_v);
                break;

              case 'battery_temp':
                code = 31;
                sql_query(station_query,[WhoAmI.getStationId(), code,j_data.pv.battery_temp, stringDate]);
                console.log('pv_battery_temp : '+ j_data.pv.battery_temp);

                break;

              case 'device_temp':
                code = 41;
                sql_query(station_query,[WhoAmI.getStationId(), code,j_data.pv.device_temp, stringDate]);
                console.log('pv_device_temp : '+ j_data.pv.device_temp);
                break;
            }
          }
        }

        if(j_data.hasOwnProperty('pcb')){
          var station_query = 'insert into port_log(port_id, code, value, date) value(?,?,?,?)';

          for(i=0; i<j_data.pcb.length; i++){
            var key = Object.getOwnPropertyNames(j_data.pcb[i]);
            console.log(key);
            
                        
            var port_numb = j_data.pcb[i].numb;
            var port_id = null;

            for(j=0; j<station_rows.length; j++){
              if(station_rows[j].port_numb == port_numb){
                port_id = station_rows[i].port_id ;                
                break;
              } 
            }

            for(k=0; k<key.length; k++){

              switch(key[k]){
                case 'input_v':
                  code = 11;
                  console.log("i 값 : "+i);

                  console.log('pcb_'+j_data.pcb[i].numb+'_input_v :' + j_data.pcb[i].input_v);
                  sql_query(station_query,[port_id, code, j_data.pcb[i].input_v, stringDate]);
                  break;

                case 'input_a':
                  code = 12;
                  sql_query(station_query,[port_id, code, j_data.pcb[i].input_a, stringDate]);
                  console.log('pcb_'+j_data.pcb[i].numb+'_input_a :' + j_data.pcb[i].input_a);
                  break;

                case 'output_v':
                  code = 21;
                  sql_query(station_query,[port_id, code, j_data.pcb[i].output_v, stringDate]);
                  console.log('pcb_'+j_data.pcb[i].numb+'_output_v :'+ j_data.pcb[i].output_v);
                  break;

                case 'output_a':
                  code = 22;
                  sql_query(station_query,[port_id, code, j_data.pcb[i].output_a, stringDate]);
                  console.log('pcb_'+j_data.pcb[i].numb+'_output_a : '+ j_data.pcb[i].output_a);
                  break;

                case 'status':
                  code = 31;
                  sql_query(station_query,[port_id, code, j_data.pcb[i].status, stringDate]);
                  console.log('pcb_'+j_data.pcb[i].numb+'_status :' + j_data.pcb[i].status);
                  break;
              }
            }
          }
        }

        shoot_result(socket,'insert',true);

      } catch(e){
        shoot_result(socket,'insert',false);
        console.log(`${e}`);

      }
  })

    socket.on('disconnect',function(){

      console.log(`${nickname} is disconnect this chatroom ------------------------  `)

      switch(socket_type){
          case 'station' :
            //Delete user in the whoIsOn Arryay
            StationIsOn.splice(nickname,1);
            var data = {
                disconnected : nickname
            }
            socket.emit('logout',data)
            console.log(`${StationIsOn}`)
            io.to(room['admin']).emit('a_station_status', false);

            break;
            
          case 'admin':
            //Delete user in the whoIsOn Arryay
            AdminIsOn.splice(AdminIsOn.indexOf(nickname),1);
            // var data = {
            //     whoIsOn: whoIsOn,
            //     disconnected : nickname
            // }
            socket.emit('logout',data)
            console.log(`${AdminIsOn}`)

            break;

          case 'user':
            //Delete user in the whoIsOn Arryay
            UserIsOn.splice(UserIsOn.indexOf(nickname),1);
            var data = true;
            shoot_result(socket,'result',data);
            console.log(`${UserIsOn}`)
            break;
            
          default:
            console.log(`${socket_type} is unknown type`);
        }
    })

    socket.on('logout',function(){
      console.log(`${nickname} is logout this chatroom ------------------------  `)

        switch(socket_type){
          case 'station' :
            //Delete user in the whoIsOn Arryay
            StationIsOn.splice(StationIsOn.indexOf(nickname),1);
            var data = {
                disconnected : nickname
            }
            socket.emit('logout',data)
            console.log(`${StationIsOn}`)
            io.to(room['admin']).emit('a_station_status', false);

            break;
            
          case 'admin':
            //Delete user in the whoIsOn Arryay
            AdminIsOn.splice(AdminIsOn.indexOf(nickname),1);
            var data = true;
            shoot_result(socket,'result',data);
            console.log(`${AdminIsOn}`);

            break;

          case 'user':
            //Delete user in the whoIsOn Arryay
            UserIsOn.splice(UserIsOn.indexOf(nickname),1);
            var data = {
                whoIsOn: whoIsOn,
                disconnected : nickname
            }
            socket.emit('logout',data)
            console.log(`${UserIsOn}`)
            break;
            
          default:
            console.log(`${socket_type} is unknown type`);
        }

    })

    //NFC데이터 검색 후 포트 배정
    socket.on('nfc',function(data){
      console.log(`user_nfc_tag : ${data}`)
      nfcquery = "select id from user where nfc_key = ?";

      var nfc_user;

      mysqlDB.query(nfcquery,data, function (err, rows, fields) {
        if (!err) {
          if(rows.length < 1){
            nfc_user = rows[0].id
          } else {
            shoot_result(socket, 'nfc', false);
          }
        } else {
          console.log('query error : ' + err);
          return false;
        }
      });

      idlePort = getIdlePort(port_list);

      console.log(idlePort);
      if(typeof(idlePort)=='boolean' && !idlePort){
        shoot_result(socket, "port_ready", false);
      } else {
        var station_query = 'select * from user where nfc_key = ?';
        mysqlDB.query(station_query,data, function (err, rows, fields) {
          if (!err) {
            user_id = rows[0].id;
            
            port_list[idlePort].setStatus("charge_ready", user_id, mysqlDB);

            input_data = {
              result : true,
              port: idlePort+1
            }

            port_list[idlePort].setValue('status',1);
  
            socket.emit('charge_ready',input_data);;
            io.to(room['admin']).emit('a_charge_ready', input_data);

          } else {
            console.log('query error : ' + err);
          }
        });
      }
    });

    //충전 관련 처리
    socket.on('charge',function(data){
      var get_data = JSON.parse(data);
      var response_data;

      code = get_data.code;

      
      switch(code){
        case 'start' : //충전 시작 통보를 받았을때
          var query = "";
          var value = "";

          data=JSON.parse(data);

          console.log(Number(data.port)-1);

          if (port_list[Number(data.port)-1].getStatus() !== 1 || data.port == null){
            response_data = {
              code: "start",
              data: false,
              detail: "충전 대기 상태 포트가 아님"
            }
            socket.emit('result',response_data);
            break;
          }


          //sql_query(query,value);
          port_list[Number(data.port)-1].setStatus('charge_start',null ,null, mysqlDB);
          

          response_data = {
            "data" : true,
            "code" : "start",
            "port": Number(data.port)
          }

          port_list[Number(data.port)-1].setStatus('charge_start',null, null, mysqlDB);
          var temp = port_list[Number(data.port)-1].getUser();
          var user_info;

          if(temp.type == 'user'){
            user_info = UserIsOn[temp.id].socket_id;
          } else if (temp.type == 'company'){
            user_info = companyIsOn[temp.id].getInfo();
          }

          console.log(user_info);

          socket.to(user_info.socket_id).emit('charge_start');
          socket.emit('result',response_data);

          io.to(room['admin']).emit('a_charge', response_data);
          console.log(`${data.port} for ${code} result ${response_data.data}`);


          break;


        case 'cancel' : //충전 취소 통보를 받았을때
          data=JSON.parse(data);
          
          if (port_list[Number(data.port)-1].getStatus() !== 1 || data.port == null){
            response_data = {
              code: "charge_cancel",
              data: false,
              detail: "충전 대기 상태 포트가 아님"
            }

            socket.emit('result',response_data);
          
            break;
          }

          
          
          response_data = {
            "data" : true,
            "code" : "charge_cancel",
            "port": data.port
          }
          

          var temp = port_list[Number(data.port)-1].getUser();
          var user_info;

          console.log("취소 값 "+temp);

          for (var key in temp) {
            console.log("Attributes : " + key + ", value : " + temp[key]);
            }

          if(temp.type == 'user'){
            user_info = UserIsOn[temp.id].socket_id;
          } else if (temp.type == 'company'){
            user_info = companyIsOn[temp.id].getInfo();
          }

          console.log(user_info);

          var result_data = {

          };

          socket.to(user_info.socket_id).emit('charge_cancel');

          socket.emit('result',response_data);
          io.to(room['admin']).emit('a_charge', response_data);

          console.log("차지 이벤트 디비 변수" + mysqlDB);

          port_list[Number(data.port)-1].setStatus('charge_cancel',null,null, mysqlDB);

          console.log(`${data.port} for ${code} result ${response_data.data}`);
          break;


        case 'complete' : //충전완료 통보
          data=JSON.parse(data);

          if (port_list[Number(data.port)-1].getStatus() !== 2 || data.port == null){
            response_data = {
              code: "charge_complete",
              data: false,
              detail: "충전중인 포트가 아님"
            }
            socket.emit('result',response_data);

            console.log(`${data.port} for ${code} result ${response_data.data}`);

            break;
          }

          //sql_query(query,value);
          port_list[Number(data.port)-1].setStatus('charge_complete',null, null, mysqlDB);

          response_data = {
            "data" : true,
            "code" : "charge_complete",
            "port": Number(data.port)
          }

          port_list[Number(data.port)-1].setStatus('charge_complete',null, null, mysqlDB);
          socket.emit('result',response_data);
          io.to(room['admin']).emit('a_charge', response_data);

          console.log(`${data.port} for ${code} result ${response_data.data}`);
          break;


        case 'short_circuit' : //단락 통보
          data=JSON.parse(data);

          if (port_list[Number(data.port)-1].getStatus() !== 2 || data.port == null){
            response_data = {
              code: "short_circuit",
              data: false,
              detail: "충전중 상태 포트가 아님"
            }
            socket.emit('result',response_data);
            break;
          }

          //sql_query(query,value);
          response_data = {
            "data" : true,
            "code" : "short_circuit",
            "port": Number(data.port)
          }
          port_list[Number(data.port)-1].setStatus('short_circuit',null, null, mysqlDB);
          socket.emit('result',response_data);
          io.to(room['admin']).emit('a_charge', response_data);

          console.log(`${data.port} for ${code} result ${response_data.data}`);

          break;
      }


    });

        //로그 이벤트
        socket.on('log',function(data){
          console.log(`user_nfc_tag : ${data}`)
          nfcquery = "select id from user where nfc_key = ?";
    
          var nfc_user;
    
          mysqlDB.query(nfcquery,data, function (err, rows, fields) {
            if (!err) {
              nfc_user = rows[0].id
            } else {
              console.log('query error : ' + err);
              return false;
            }
          });
    
          idlePort = getIdlePort(port_list);
    
          console.log(idlePort);
          if(typeof(idlePort)=='boolean' && !idlePort){
            shoot_result(socket, "nfc", "no_port");
          } else {
            var station_query = 'select * from user where nfc_key = ?';
            mysqlDB.query(station_query,data, function (err, rows, fields) {
              if (!err) {
                user_id = rows[0].id;
                
                port_list[idlePort].setStatus("charge_ready", user_id, mysqlDB);
    
                input_data = {
                  result : true,
                  port: idlePort+1
                }
    
                port_list[idlePort].setValue('status',1);
      
                socket.emit('charge_ready',input_data);;
                io.to(room['admin']).emit('a_charge_ready', input_data);
    
              } else {
                console.log('query error : ' + err);
              }
            });
          }
        });



    //사용자 소켓 통신 부분
    socket.on('port_ready',function(data){
      if(checkType(WhoAmI) == 'user' || checkType(WhoAmI) == 'company'){
      console.log(data);
      if(data instanceof Object){}
      else{ data = JSON.parse(data); }
        
      var station_identifier;
      console.log(`station_code : ${data.station_id}`);
      console.log(`port_numb : ${data.port_numb}`);

      //스테이션 코드로 아이디 값으로 아이디 추출
      nfcquery = "select identifier from station where code = ?";

      mysqlDB.query(nfcquery, data.station_id, function (err, rows, fields) {
        if (!err) {
          if(rows.length < 1){
            shoot_result(socket, 'port_ready', false, '일치하는 스테이션 아이디가 없음');
          } else {

            //스테이션이 접속된 상태인지 점검
            station_identifier = rows[0].identifier;
            if(StationIsOn[station_identifier] == undefined || StationIsOn[station_identifier] == null){
              shoot_result(socket, "port_ready", false, '사용가능한 스테이션이 아님');

            } else {//스테이션이 접속 된 상태면

              //포트 리스트 가져오기
              port_list = StationIsOn[station_identifier].getPortList();

              //포트 상태 확인
              if(port_list[Number(data.port_numb)-1].status != 0){ //포트가 준비 상태가 아니라면
                console.log(port_list[Number(data.port_numb)-1].status);
                shoot_result(socket, "port_ready", false, '대기 상태의 포트가 아님');
              } else {
                if(checkType(WhoAmI) == 'user'){
                  var station_query = 'select id from user where token = ?';
                  mysqlDB.query(station_query,nickname, function (err, rows, fields) {
                    if (!err) {
                      user_id = rows[0].id;
            
                      console.log(WhoAmI);
  
                      port_list[Number(data.port_numb)-1].setStatus("charge_ready", WhoAmI.id, checkType(WhoAmI), mysqlDB);
    
                      input_data = {
                        port: Number(data.port_numb),
                        admin: 0,
                        setting: {
                          volt: 36,
                          ampere: 2.5
                        }
                      }
    
                      port_list[Number(data.port_numb)-1].setValue('status',1);
  
                      shoot_result(socket, "port_ready", true);
                      //console.log(StationIsOn[station_identifier].socket_id);
    
                      io.to(room['admin']).emit('a_charge_ready', input_data);
    
                    } else {
                      console.log('query error : ' + err);
                    }
                  });
                } else if (checkType(WhoAmI) == 'company') {
                  
                  port_list[Number(data.port_numb)-1].setStatus("charge_ready", WhoAmI.id, checkType(WhoAmI), mysqlDB);
    
                  input_data = {
                    port: Number(data.port_numb),
                    admin: 0,
                    setting: {
                      volt: 42,
                      ampere: 2.5
                    }
                  }
  
                  port_list[Number(data.port_numb)-1].setValue('status',1);
        
                  shoot_result(socket, "port_ready", true);
                  console.log(StationIsOn[station_identifier]);
  
                  socket.to(StationIsOn[station_identifier].socket_id).emit('port_ready',input_data);
                  io.to(room['admin']).emit('a_charge_ready', input_data);
  
                }
              }
              
              
              // idlePort = getIdlePort(port_list);
  
              // if(typeof(idlePort)=='boolean' && !idlePort){
              //   shoot_result(socket, "port_ready", false, '비어있는 포트가 없음');
              // } else {
  
              //   if(checkType(WhoAmI) == 'user'){
              //     var station_query = 'select id from user where token = ?';
              //     mysqlDB.query(station_query,nickname, function (err, rows, fields) {
              //       if (!err) {
              //         user_id = rows[0].id;
            
              //         console.log(WhoAmI);
  
              //         port_list[idlePort].setStatus("charge_ready", WhoAmI.id, checkType(WhoAmI));
    
              //         input_data = {
              //           port: idlePort+1,
              //           admin: 0,
              //           setting: {
              //             volt: 36,
              //             ampere: 2.5
              //           }
              //         }
    
              //         port_list[idlePort].setValue('status',1);
  
              //         shoot_result(socket, "port_ready", true);
              //         //console.log(StationIsOn[station_identifier].socket_id);
    
              //         io.to(room['admin']).emit('a_charge_ready', input_data);
    
              //       } else {
              //         console.log('query error : ' + err);
              //       }
              //     });
              //   } else if (checkType(WhoAmI) == 'company') {
                  
              //     port_list[idlePort].setStatus("charge_ready", WhoAmI.id, checkType(WhoAmI));
    
              //     input_data = {
              //       port: idlePort+1,
              //       admin: 0,
              //       setting: {
              //         volt: 42,
              //         ampere: 2.5
              //       }
              //     }
  
              //     port_list[idlePort].setValue('status',1);
        
              //     shoot_result(socket, "port_ready", true);
              //     console.log(StationIsOn[station_identifier]);
  
              //     socket.to(StationIsOn[station_identifier].socket_id).emit('port_ready',input_data);
              //     io.to(room['admin']).emit('a_charge_ready', input_data);
  
              //   }
              // }
            }
          }

        } else {
          console.log('query error : ' + err);
          return false;
        }
      });
    } else {
      shoot_result(socket,'port_ready',false,'접근 가능한 이벤트가 아님');
      return false;
    }
          });
          
})

function shoot_result(soket, code, data, msg){
if(msg == undefined || msg == null){
  var d = {
    code: code,
    data: data
  }
} else {
  var d = {
    code: code,
    data: data,
    detail: msg
  }
}

  console.log(d);
  io.to(soket.id).emit('result',d);

}


function sql_query(query, value){
  mysqlDB.query(query,value, function (err, rows, fields) {
    if (!err) {
      return true;
    } else {
      console.log('query error : ' + err);
      return false;
    }
  });
}

function AddPortLog(port_id, status, value){
  var query = "insert into port_log(port_id, code, value, date) values(?,?,?,?)";
  var param = (port_id, status)
  mysqlDB.query(query,value, function (err, rows, fields) {
    if (!err) {
      return true;
    } else {
      console.log('query error : ' + err);
      return false;
    }
  });
}

function getIdlePort(port_list){
  for(i=0; i<port_list.length; i++){
    console.log("check port : "+ i);
    if (port_list[i].getStatus() == 0) return i;
  }
  return false;
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

function checkType(WhoAmI){
  console.log(WhoAmI);
  if(WhoAmI instanceof admin_class){
    return "admin";
  }
  else if(WhoAmI instanceof user_class){
    return "user";
  }
  else if(WhoAmI instanceof station_class){
    return "station";
  }
  else if(WhoAmI instanceof station_class){
    return "station";
  }
  else if(WhoAmI instanceof company_class){
    return "company";
  }
  else {
    return undefined;
  }
}

function checkAPI(key){
  if(key == "test") return true;
  else return false;
}

function printResult(result){
  res.json(result);
}

function decrypt(data,key){
  return Crypto.AES.decrypt(data,key).toString(Crypto.enc.Utf8);
}

function encrypt(data,key){
  return Crypto.AES.encrypt(data,key).toString();
}

