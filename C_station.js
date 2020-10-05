function C_station(id, name, socket_id){
	this.id = id;
	this.name = name;
	this.socket_id = this.socket_id;

	this.pv_charge_a = null;
	this.pv_charge_v = null;

	this.pv_load_a = null;
	this.pv_load_v = null;

	this.pv_battery_charge = null;
	this.pv_battery_temp = null;

	this.pv_device_temp = null;
}

var proto = C_station.prototype;

proto.setInfo = function (id, name, socket_id){
	this.id = id;
	this.name = name;
	this.socket_id = socket_id;
}

proto.setValue = function (code, value){
	switch(code){
		case 'charge_a':
			this.pv_charge_a = value;
			break;
		case 'charge_v':
			this.pv_charge_v = value;
			break;
		case 'load_a':
			this.pv_load_a = value;
			break;
		case 'load_v':
			this.pv_load_v = value;
			break;
		case 'battery_charge':
			this.pv_battery_charge = value;
			break;
		case 'battery_temp':
			this.pv_battery_charge = value;
			break;
		case 'device_temp':
			this.pv_device_temp = value;
			break;
		}
}

proto.getInfo = function(){
	var json = new Object;

	json.id = this.id;
	json.name = this.name;
	json.socket_id = this.socket_id;

	json.charge_a = this.pv_charge_a;
	json.charge_v = this.pv_charge_v;

	json.load_a = this.pv_load_a;
	json.load_v = this.pv_load_v;

	json.battery_charge = this.pv_battery_charge;
	json.battery_temp = this.pv_battery_temp;

	json.device_temp = this.pv_device_temp;

	var result = JSON.stringify(json);

	return result;
}