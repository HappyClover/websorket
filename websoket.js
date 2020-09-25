const wsModlue = require( "ws" ); 
module.exports = function( _server ) { 
	// 웹소켓 서버를 생성합니다. 
	const wss = new wsModlue.Server( {server:_server} ); 
	// 클리이언트가 접속했을 때 처리하는 이벤트 메소드를 연결합니다. 
	wss.on( 'connection', function( ws, req ){ 
		// 사용자의 ip를 파악합니다. 
		let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; 
		console.log( ip + "아이피의 클라이언트로 부터 접속 요청이 있었습니다." ); 

		// 메시지를 받은 경우 호출되는 이벤트 메소드 입니다. 
		ws.on('message', function( message ){ 
			// 받은 메시지를 출력합니다. 
			console.log( ip + "로 부터 받은 메시지 : " + message ); 
			// 클라이언트에 받은 메시지를 그대로 보내, 통신이 잘되고 있는지 확인합니다. 
			ws.send( "echo:" + message ); 
		}); 
		// 오류가 발생한 경우 호출되는 이벤트 메소드 입니다. 
		ws.on('error', function(error){ console.log( ip + "클라이언트와 연결중 오류 발생:" + error ); }) 

		// 접속이 종료되면, 호출되는 이벤트 메소드 입니다. 
		ws.on('close', function(){ console.log( ip + "클라이언트와 접속이 끊어 졌습니다." ); }) 
	}); 
}

