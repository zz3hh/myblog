var Chat = function(socket){
	this.socket = socket;
}

Chat.prototype.sendMessage = function(user,room,text){
	var message = {
		room:room,
		text:text
	};
	this.socket.emit('message',user,message);
}

Chat.prototype.changeRoom = function(user,room){
	this.socket.emit('join',user,{
		newRoom:room
	});
}

Chat.prototype.processCommand = function(user,command){
	var words = command.split(' ');
	var command = words[0].substring(1,words[0].length).toLowerCase();
	var message = false;
	switch(command){
		case 'join':
		    words.shift();
		    var room = words.join('');
		    this.changeRoom(user,room);
		    break;
		default:
			message = '错误命令';
			break;
	}
	return message;
}
