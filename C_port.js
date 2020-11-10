// var mysqlDB = require('./mariadb.js');
// mysqlDB.connect();

function C_port(id, numb){
	this.id = id;
	this.numb = numb;

	this.input_a = null;
	this.input_v = null;

	this.output_a = null;
	this.output_v = null;

    this.status = 0;
    this.user_id = null;

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

C_port.prototype.setStatus = function (code, user_id){
	
	//var stringDate = getTimeStamp();

	switch(code){
		case 'charge_ready':
            this.status = 1;
			this.user_id = user_id;
			code = 101;
			break;
		case 'charge_start':
			this.status = 2;
			code = 102;
            break;
		case 'charge_cancel':
            this.status = 0;
			this.user_id = null;
			code = 103;
            break;     
		case 'charge_complete':
            this.status = 0;
			this.user_id = null;
			code = 104;
			break;
		case 'short_circuit':
			this.status = 0;
			this.user_id = null;
			code = 105;
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

C_port.prototype.getPortId = function(){
	return this.id;
}

C_port.prototype.getPortNumb = function(){
	return this.numb;
}

C_port.prototype.getStatus = function(){
	return this.status;
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

	var result = JSON.stringify(json);

	return result;
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

module.exports = C_port;
