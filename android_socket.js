var express = require('express')
var app = express(); // 이번 예제에서는 express를 사용합니다.
var socketio = require('socket.io');

var station_current;

//스테이션 클래스 배치
var station_class = require('./C_station.js');
var user_class = require('./C_user.js');
var admin_class = require('./C_admin.js');

var myinfo;

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

            StationIsOn.push(nickname) //

            var station_query = 'select station.*, station_port.* from station inner join station_port on station.id = station_port.station_id where station.name = ?';
            mysqlDB.query(station_query,nickname, function (err, rows, fields) {
              if (!err) {
                station_current = rows;
                id = station_current.id;
                opp = new station_class(id, nickname, socket.id);
                
                console.log(rows);
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

    socket.on('say',function(data){
        console.log(`${nickname} : ${data}`)
    
        socket.emit('myMsg',data)
        socket.broadcast.emit('newMsg',data) // socket.broadcast.emit은 현재 소켓이외의 서버에 연결된 모든 소켓에 보내는 것.
    })

    socket.on('insert',function(data){
      console.log(`${nickname} : ${data}`)
      var j_data = JSON.parse(data);

      var pv_charge_v = j_data.pv.charge_v;
      var pv_charge_a = j_data.pv.charge_a;
      var pcb_input_v = j_data.pcb[0].input_v;
      var pcb_output_a = j_data.pcb[0].output_a;

      var station_query = 'insert into port_log()';
      mysqlDB.query(station_query,nickname, function (err, rows, fields) {
        if (!err) {
          station_current = rows;
          console.log(rows);
        } else {
          console.log('query error : ' + err);
        }
      });

      console.log(`${nickname} pv_charge_a : ${pv_charge_a}`)
      console.log(`${nickname} pv_charge_v : ${pv_charge_v}`)
      console.log(`${nickname} pcb_input_v : ${pcb_input_v}`)
      console.log(`${nickname} pcb_output_a : ${pcb_output_a}`)
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
