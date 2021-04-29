function C_company(id, identifier, name, socket_id){
	this.id = id;
	this.identifier = identifier;
	this.name = name;
	this.socket_id = socket_id;
}

var proto = C_company.prototype;

proto.setInfo = function (id, name, socket_id){
	this.id = id;
	this.identifier = identifier;
	this.name = name;
	this.socket_id = socket_id;
}

proto.getInfo = function(){
	var json = new Object;

	json.id = this.id;
	json.identifier = this.identifier;
	json.name = this.name;
	json.socket_id = this.socket_id;

	return json;
}

module.exports = C_company;
