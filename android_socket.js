var express = require('express')
var app = express(); // 이번 예제에서는 express를 사용합니다.
var socketio = require('socket.io');

var fs = require('fs');

var station_current;

//스테이션 클래스 배치
var station_class = require('./C_station.js');
var user_class = require('./C_user.js');
var admin_class = require('./C_admin.js');
var port_class = require('./C_port.js');

var WhoAmI;

//DB세팅
var mysqlDB = require('./mariadb.js');
mysqlDB.connect();

var server = app.listen(3001,()=>{
    console.log('Listening at port number 3001') //포트는 원하시는 번호로..
})

//return socket.io server.
var io = socketio.listen(server) // 이 과정을 통해 우리의 express 서버를 socket io 서버로 업그레이드를 시켜줍니다.

//룸 종류 선언 (스테이션 접속 룸, 관리자 룸, 사용자 룸)
let room = ['station','admin','user']

//이 배열은 누가 chatroom에 있는지를ß 보여줍니다.
var StationIsOn= [];
var AdminIsOn= [];
var UserIsOn= [];

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

app.get('/', (req, res) => {
  res.render('index_station.ejs');
});


//이 서버에서는 어떤 클라이언트가 connection event를 발생시키는 것인지 듣고 있습니다.
// callback 으로 넘겨지는 socket에는 현재 클라이언트와 연결되어있는 socket 관련 정보들이 다 들어있습니다.
io.on('connection',function (socket){
    var nickname = ``;
    var socket_type = ``; 
    var station_rows;
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

        console.log(`${JSON.stringify(data)}`);

        nickname = login_data.name;
        socket_type = login_data.type;

        socket.join(`${socket_type}`)

        switch(socket_type){
          case 'station' :
            var id, name, result;

            var station_query = 'select station.*, station_port.id as port_id, station_port.number as port_numb, station_port.type as port_type from station inner join station_port on station.id = station_port.station_id where station.name = ?';
            mysqlDB.query(station_query,nickname, function (err, rows, fields) {
              if (!err) {
                if(rows.length>0){
                  console.log(`${nickname} has entered ${socket_type} chatroom! ---------------------`)

                  station_rows = rows;
                  id = rows[0].id;
                  WhoAmI = new station_class(id, nickname, socket.id);
                  StationIsOn.push(nickname) //

                  for(i=0; i<rows.length; i++){
                    port = new port_class(rows[i].port_id, rows[i].port_numb)

                    console.log(port.getPortNumb());
                    port_list[Number(port.getPortNumb())-1] = port;
                    result = true;
                    io.to(room['admin']).emit('a_join_status', 1);
                    socket.join(room['station']);

                  }
                } else { //조회결과가 없을때
                  shoot_result(io, "login", false);
                  result = false;
                }
              } else {
                console.log('query error : ' + err);
                result = false;
              }


              
            });
            break;

          case 'admin' :
            AdminIsOn.push(nickname) //
            socket.join(room['admin']);
            result = true;
            break;

          case 'user' :
            UserIsOn.push(nickname) //
            result = true;
            break;
        }
  
        if(result == true){
        // 아래와 같이 하면 그냥 String 으로 넘어가므로 쉽게 파싱을 할 수 있습니다.
        // 그냥 넘기면 JSONArray로 넘어가서 복잡해집니다.
        var whoIsOnJson = `${StationIsOn}`
        console.log(whoIsOnJson)
          
        var whoIsOnJson = `${AdminIsOn}`
        console.log(whoIsOnJson)

        //io.emit 과 socket.emit과 다른 점은 io는 서버에 연결된 모든 소켓에 보내는 것이고
        // socket.emit은 현재 그 소켓에만 보내는 것입니다.       
        
        //io.emit('newUser',whoIsOnJson)

        shoot_result(io, "login", true);
        }
      } catch (exception){
        shoot_result(io, "login", false);
        console.log(exception);
      }
    })

    //채팅 처리
    socket.on('say',function(data){
        console.log(`${nickname} : ${data}`)
    
        socket.emit('myMsg',data)
        socket.broadcast.emit('newMsg',data) // socket.broadcast.emit은 현재 소켓이외의 서버에 연결된 모든 소켓에 보내는 것.

    })

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
            var port_numb = j_data.pcb[i].numb;
            var port_id = null;

            for(i=0; i<station_rows.length; i++){
              if(station_rows[i].port_numb == port_numb){
                port_id = station_rows[i].port_id ;
                break;
              } 
            }
            for(j=0; j<key.length; j++){
              switch(key[j]){
                case 'input_v':
                  code = 11;
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

        shoot_result(io,'insert',true);

      } catch(e){
        shoot_result(io,'insert',false);
        console.log(`${e}`);

      }
  })

    socket.on('disconnect',function(){

      console.log(`${nickname} is disconnect this chatroom ------------------------  `)

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
            var data = {
                whoIsOn: whoIsOn,
                disconnected : nickname
            }
            socket.emit('logout',data)
            console.log(`${AdminIsOn}`)

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
          nfc_user = rows[0].id
        } else {
          console.log('query error : ' + err);
          return false;
        }
      });

      idlePort = getIdlePort(port_list);

      console.log(idlePort);
      if(typeof(idlePort)=='boolean' && !idlePort){
        shoot_result(io, "nfc", "no_port");
      } else {
        var station_query = 'select * from user where nfc_key = ?';
        mysqlDB.query(station_query,data, function (err, rows, fields) {
          if (!err) {
            user_id = rows[0].id;
            
            port_list[idlePort].setStatus("charge_ready", user_id);

            input_data = {
              result : true,
              port: (idlePort+3)%4
            }

            port_list[idlePort].setValue('status',1);
  
            socket.emit('charge_ready',input_data);;
            io.to(room['admin']).emit('a_charge_ready', input_data);

          } else {
            console.log('query error : ' + err);
          }
        });
      }
    })

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

          if (port_list[Number(data.port)-1].getStatus() !== 1 || data.port == null){
            response_data = {
              code: "charge_start",
              data: false,
              detail: "충전 대기 상태 포트가 아님"
            }
            socket.emit('result',response_data);
            break;
          }

          //sql_query(query,value);
          port_list[Number(data.port)-1].setStatus('charge_start',null);
          

          response_data = {
            "data" : true,
            "code" : "charge_start",
            "port": idlePort+1
          }

          port_list[idlePort].setStatus('charge_start',null);
          socket.emit('result',response_data);
          io.to(room['admin']).emit('a_charge', response_data);

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

          //sql_query(query,value);
          port_list[Number(data.port)-1].setStatus('charge_cancel',null);

          response_data = {
            "data" : true,
            "code" : "charge_cancel",
            "port": idlePort+1
          }
          port_list[idlePort].setStatus('charge_cancel',null);
          socket.emit('result',response_data);
          io.to(room['admin']).emit('a_charge', response_data);
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
            break;
          }

          //sql_query(query,value);
          port_list[Number(data.port)-1].setStatus('charge_complete',null);

          response_data = {
            "data" : true,
            "code" : "charge_complete",
            "port": idlePort+1
          }
          port_list[idlePort].setStatus('charge_complete',null);
          socket.emit('result',response_data);
          io.to(room['admin']).emit('a_charge', response_data);
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
            "port": idlePort+1
          }
          port_list[Number(data.port)-1].setStatus('short_circuit',null);
          socket.emit('result',response_data);
          io.to(room['admin']).emit('a_charge', response_data);

          break;
      }
      console.log(`${data.port} for ${code} result ${response_data.data}`);


    })
})

function shoot_result(io, code, data){
  var d = {
    code: code,
    data: data
  }
  console.log(d);
  io.emit('result',d);
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

