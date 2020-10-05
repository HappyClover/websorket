function C_user(id, name, socket_id){
	this.id = id;
	this.name = name;
	this.socket_id = this.socket_id;
}

var proto = C_user.prototype;

proto.setInfo = function (id, name, socket_id){
	this.id = id;
	this.name = name;
	this.socket_id = socket_id;
}

proto.getInfo = function(){
	var json = new Object;

	json.id = this.id;
	json.name = this.name;
	json.socket_id = this.socket_id;

	return result;
}

module.exports = C_user;
