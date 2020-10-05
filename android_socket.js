var express = require('express')
var app = express(); // 이번 예제에서는 express를 사용합니다.
var socketio = require('socket.io');

var station_current;

//스테이션 클래스 배치
var station_class = require('./C_station.js');
var user_class = require('./C_user.js');
var admin_class = require('./C_admin.js');

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

//이 배열은 누가 chatroom에 있는지를 보여줍니다.
var StationIsOn= [];
var AdminIsOn= [];
var UserIsOn= [];

//이 서버에서는 어떤 클라이언트가 connection event를 발생시키는 것인지 듣고 있습니다.
// callback 으로 넘겨지는 socket에는 현재 클라이언트와 연결되어있는 socket 관련 정보들이 다 들어있습니다.
io.on('connection',function (socket){
    var nickname = ``
    var socket_type = `` 
    console.log(`Connection : SocketId = ${socket.id}`)
    //console.log('join : socketid = ${socket.id}');

    //일단 socket.on('login') 이라는 것은 클라이언트가 login 이라는 이벤트를 발생시키면
    //어떤 콜백 함수를 작동시킬 것인지 설정하는 것입니다.
    socket.on('login',function(data){

      try{
        var login_data = JSON.parse(data)

        nickname = login_data.name;
        socket_type = login_data.type;

        socket.join(`${socket_type}`)
        console.log(`${nickname} has entered ${socket_type} chatroom! ---------------------`)

        switch(socket_type){
          case 'station' :
            var id, name;

            var station_query = 'select station.*, station_port.id as port_id, station_port.number as port_numb, station_port.type as port_type from station inner join station_port on station.id = station_port.station_id where station.name = ?';
            mysqlDB.query(station_query,nickname, function (err, rows, fields) {
              if (!err) {
                console.log(rows);

                id = rows[0].id;

                console.log(id);

                WhoAmI = new station_class(id, nickname, socket.id);
                StationIsOn.push(WhoAmI) //
              } else {
                console.log('query error : ' + err);
              }
            });
            break;

          case 'admin' :
            AdminIsOn.push(nickname) //
            break;

          case 'user' :
              UserIsOn.push(nickname) //
              break;
        }
  
        // 아래와 같이 하면 그냥 String 으로 넘어가므로 쉽게 파싱을 할 수 있습니다.
        // 그냥 넘기면 JSONArray로 넘어가서 복잡해집니다.
        var whoIsOnJson = `${StationIsOn}`
        console.log(whoIsOnJson)
          
        var whoIsOnJson = `${AdminIsOn}`
        console.log(whoIsOnJson)

        //io.emit 과 socket.emit과 다른 점은 io는 서버에 연결된 모든 소켓에 보내는 것이고
        // socket.emit은 현재 그 소켓에만 보내는 것입니다.       
        
        //io.emit('newUser',whoIsOnJson)
      } catch (exception){
        console.log(exception);
      }
    })

    //채팅 처리
    socket.on('say',function(data){
        console.log(`${nickname} : ${data}`)
    
        socket.emit('myMsg',data)
        socket.broadcast.emit('newMsg',data) // socket.broadcast.emit은 현재 소켓이외의 서버에 연결된 모든 소켓에 보내는 것.
    })

    //데이터 인풋 처리
    socket.on('insert',function(data){
      console.log(`${nickname} : ${data}`);

      
      var j_data = JSON.parse(data);

      var pv_charge_v = j_data.pv.charge_v;
      var pv_charge_a = j_data.pv.charge_a;
      var pcb_input_v = j_data.pcb[0].input_v;
      var pcb_output_a = j_data.pcb[0].output_a;

      {
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
          var station_query = 'insert into port_log(port_id, code, value) value(?,?,?,?)';

          for(i=0; i<j_data.pcb.length; i++){
            var key = Object.getOwnPropertyNames(j_data.pcb[i]);

            for(j=0; j<key.length; j++){
              switch(key[j]){
                case 'input_v':
                  code = 11;
                  sql_query(station_query,[WhoAmI.getStationId(), code, j_data.pv.charge_a, stringDate]);
                  console.log('pv_'+j_data.pcb[i].numb+'_input_v :' + j_data.pcb[i].input_v);
                  break;

                case 'input_a':
                  code = 12;
                  sql_query(station_query,[WhoAmI.getStationId(), code, j_data.pv.charge_a, stringDate]);
                  console.log('pv_'+j_data.pcb[i].numb+'_input_a :' + j_data.pcb[i].input_a);
                  break;

                case 'output_a':
                  code = 21;
                  sql_query(station_query,[WhoAmI.getStationId(), code, j_data.pv.charge_a, stringDate]);
                  console.log('pv_'+j_data.pcb[i].numb+'_output_a :'+ j_data.pcb[i].output_a);
                  break;

                case 'output_v':
                  code = 22;
                  sql_query(station_query,[WhoAmI.getStationId(), code, j_data.pv.charge_a, stringDate]);
                  console.log('pv_'+j_data.pcb[i].numb+'_output_v : '+ j_data.pcb[i].output_v);
                  break;

                case 'status':
                  code = 31;
                  sql_query(station_query,[WhoAmI.getStationId(), code, j_data.pv.charge_a, stringDate]);
                  console.log('pv_'+j_data.pcb[i].numb+'_status :' + j_data.pcb[i].status);
                  break;
              }
            }
          }
        }
        // var station_query = 'insert into port_log(port_id, code, value) value(?,?,?,?)';
        // mysqlDB.query(station_query,[port_id, code, value], function (err, rows, fields) {
        //   if (!err) {
        //     station_current = rows;
        //     console.log(rows);
        //   } else {
        //     console.log('query error : ' + err);
        //   }
        // });
      }
  })

    socket.on('disconnect',function(){
        console.log(`${nickname} has left this chatroom ------------------------  `)
    })

    socket.on('logout',function(){

        //Delete user in the whoIsOn Arryay
        whoIsOn.splice(whoIsOn.indexOf(nickname),1);
        var data = {
            whoIsOn: whoIsOn,
            disconnected : nickname
        }
        socket.emit('logout',data)
    })

})


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

