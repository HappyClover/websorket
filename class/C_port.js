// var mysqlDB = require('./mariadb.js');
// mysqlDB.connect();

const { query } = require("../stationDB");

function C_port(id, numb, station_id){
	this.id = id;
	this.station = station_id;
	this.numb = numb;

	this.usage_id = null;

	this.input_a = null;
	this.input_v = null;

	this.output_a = null;
	this.output_v = null;

    this.status = 0;
    this.user_id = null;
	this.user_type = null;

}

C_port.prototype.setInfo = function(id, numb){
	this.id = id;
	this.numb = numb;
}

C_port.prototype.setValue = function (code, value){
	switch(code){
		case 'input_a':
			this.input_a = value;
			break;
		case 'input_v':
			this.input_v = value;
			break;
		case 'output_a':
			this.output_a = value;
			break;
		case 'output_v':
			this.output_v = value;
			break;
	}
}

C_port.prototype.setStatus = function (code, user_id, user_type, mysqlDB){
			let today = new Date();   

			let year = today.getFullYear(); // 년도
			let month = today.getMonth() + 1;  // 월
			let date = today.getDate();  // 날짜
			let day = today.getDay();  // 요일

			let hours = today.getHours(); // 시
			let minutes = today.getMinutes();  // 분
			let seconds = today.getSeconds();  // 초

			var stringDate = (year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds);

			console.log("db 값 : " + mysqlDB);

	switch(code){
		case 'charge_ready':
			this.status = 1;
			this.user_id = user_id;
			this.user_type = user_type;
			code = 101;
			var user_type_numb = transType(this.user_type);
			
			var parameter = [user_type_numb, user_id, this.station, this.id, code, stringDate, this.status];
			var query = "insert into station_usage_history(user_type, user_id, station_id, port_id, code, date, status) values(?,?,?,?,?,?,?)"

			var usage_id;

			var queryPromise = new Promise((resolve, reject) =>{
				mysqlDB.query(query, parameter, function (err, rows, fields) {
					if (!err) {
						usage_id = rows.insertId;
						resolve(usage_id);
					} else {
						console.log(err);
					}
				});
			});

			queryPromise.then((usage_id)=>{
				this.usage_id = usage_id;
			});


			console.log("인서트 아이디 : " + this.usage_id);

			break;
		case 'charge_start':
			this.status = 2;
			code = 102;

			var queryPromise = new Promise((resolve, reject) =>{
				var query = "update station_usage_history set start = ?, status = ? where id = ?";
				var parameter = [stringDate, this.status, this.usage_id]
	
				mysqlDB.query(query, parameter, function (err, rows, fields) {
					if (!err) {
						resolve("update ok");
					} else {
						console.log(err);
					}
				});
			});

			queryPromise.then((msg)=>{
				console.log(msg);
			});

			break;
		case 'charge_cancel':
            this.status = 0;
			this.user_id = null;
			this.user_type = null;
			code = 103;

			var queryPromise = new Promise((resolve, reject) =>{
				var query = "update station_usage_history set end = ?, status = ? where id = ?";
				var parameter = [stringDate, this.status, this.usage_id]
				mysqlDB.query(query, parameter, function (err, rows, fields) {
					if (!err) {
						console.log(parameter);
						resolve("update ok");

					} else {
						console.log(err);
					}
				});
			});

			queryPromise.then((msg)=>{
				console.log(msg);
			});

            break;     
		case 'charge_complete':
            this.status = 3;
			code = 104;

			var queryPromise = new Promise((resolve, reject) =>{
				var query = "update station_usage_history set charge_complete = ?, status = ? where id = ?";
				var parameter = [stringDate, this.status, this.usage_id]
				mysqlDB.query(query, parameter, function (err, rows, fields) {
					if (!err) {
						resolve("update ok");

					} else {
						console.log(err);
					}
				});		
			});

			queryPromise.then((msg)=>{
				console.log(msg);
			});

	
			break;
		case 'short_circuit':
			this.status = 0;
			this.user_id = null;
			this.user_type = null;
			code = 105;

			var queryPromise = new Promise((resolve, reject) =>{
				var query = "update station_usage_history set end = ?, status = ? where id = ?";
				var parameter = [stringDate, this.status, this.usage_id]
				mysqlDB.query(query, parameter, function (err, rows, fields) {
					if (!err) {
						resolve("update ok");
					} else {
						console.log(err);
					}
				});	
			});

			queryPromise.then((msg)=>{
				console.log(msg);
			});


			break;
		case 'deivice_pause':
            this.status = 100;
			this.user_id = null;
			code = 200;
			break;
	}

	// var station_query = 'insert into port_log(port_id, code, value, date) value(?,?,?,?)';
	// sql_query(station_query,[this.id, code, 0, stringDate]);
}

C_port.prototype.recovery = function (code, user_id, user_type, usage_id, mysqlDB){
	this.status = 2;
	this.user_id = user_id;
	this.user_type = user_type;
	this.usage_id = usage_id;
	
// var station_query = 'insert into port_log(port_id, code, value, date) value(?,?,?,?)';
// sql_query(station_query,[this.id, code, 0, stringDate]);
}

C_port.prototype.getPortId = function(){
	return this.id;
}

C_port.prototype.getPortNumb = function(){
	return this.numb;
}

C_port.prototype.getStatus = function(){
	return this.status;
}

C_port.prototype.getUser = function(){
	var json = new Object;

	json.id = this.user_id;
	json.type = this.user_type;

	// var result = JSON.stringify(json);

	return json;
}

C_port.prototype.getInfo = function(){
	var json = new Object;

	json.id = this.id;
	json.numb = this.numb;

	json.input_a = this.input_a;
	json.intput_v = this.input_v;

	json.output_a = this.output_a;
	json.output_v = this.output_v;

    json.status = this.status;

	return json;
}

function sql_query(query, value, mysqlDB){
	mysqlDB.query(query,value, function (err, rows, fields) {
	  if (!err) {
		return true;
	  } else {
		console.log('query error : ' + err);
		return false;
	  }
	});
  }

  function transType(user_type){
	  switch(user_type){
		case 'user':
			return 1;
		
		case 'company':
			return 2;

		default:
			return undefined;
	  }
  }

module.exports = C_port;
