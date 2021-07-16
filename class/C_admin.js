function C_admin(id, uid, name, socket_id){
	this.id = id;
	this.uid = uid;
	this.name = name;
	this.socket_id = socket_id;


}

var proto = C_admin.prototype;

proto.setInfo = function (id, uid, socket_id, page){
	this.id = id;
	this.uid = uid;
	this.page = page;
	this.socket_id = socket_id;
}

proto.getInfo = function(){
	var json = new Object;

	json.id = this.id;
	json.uid = this.uid;
	json.socket_id = this.socket_id;
	json.page = this.page;

	var result = JSON.stringify(json);
	return result;
}

module.exports = C_admin;