/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.07.31 10:00
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @target 网站聊天功能的实现
 */
var socketio = require('socket.io');
var debugwrite = require('../read/debug');
var selfUtils = require('../models/utils');
var io;
// 用户信息暂存
var nickNames = {};
// 当前房间
var currentRoom = {};
var adminUser = {
		id : 'admin',
		name : 'admin',
		url : 'http://www.baiyatao.com',
		avatar_url : 'http://ds.cdncache.org/avatar-50/536/178031.jpg'
	};
var haveRoom = ['前端白小白','Nodejs','谈天论地'];

exports.listen = function(server){
	io = socketio.listen(server);
	
	io.set('log level',1);
	io.sockets.on('connection',function(socket){
		// 获取当前网站的聊天房间及人员数量
		socket.on('rooms',function(){
			var rooms = getRoomInfo();
			socket.emit('rooms',rooms);
		});
		
		// 改变房间
		handleRoomJoining(socket);
		
		// 发送消息
		handleMessageBroadcasting(socket);
		
		// 断开连接
		handleClientDisconnection(socket);
	});
}

/**
 * @description 获取房间信息
 */
function getRoomInfo(){
	var rooms = io.sockets.adapter.rooms;
	var roomsResult = [];
	
	for(var room in haveRoom){
		var userInRoom = rooms[haveRoom[room]];
		var timeCount = 0;
		for(var index in userInRoom){
			timeCount ++;
		}
		var roomInfo = {};
		var counts = timeCount;
		roomInfo.name = haveRoom[room];
		roomInfo.counts = counts;
		roomsResult.push(roomInfo);
	}
	return roomsResult;
}

function joinRoom(socket,user,room){
	// 是否存在房间，只有管理员才能新增房间
	if(!~haveRoom.indexOf(room)){
		if(user.id =='12981083'){
			haveRoom.push(room);
		}else{
			socket.emit('joinResult',{
				success:false,
				user:user,
				message:'亲请加入现有的房间号码？谢谢您的测试！'
			});
			return false;
		}
	}
	// 让用户进入房间
	socket.join(room);
	nickNames[socket.id] = user;
	var oldRoom = currentRoom[socket.id];
	// 记录用户的当前房间
	currentRoom[socket.id] = room;
	// 让用户知道他们进入的房间
	socket.emit('joinResult',{
			success:true,
			user:user,
			room:room
		});
	
	// 让原来房间的人知道有人离开了房间
	socket.broadcast.to(oldRoom).emit('message',{
		success:true,
		user:adminUser,
		type:'info',
		time:selfUtils.getNowDate(),
		text:'来自系统消息：'+user.name+' 离开了 房间'
	});

	// 让房间里的其他用户知道有新用户进入房间
	socket.broadcast.to(room).emit('message',{
		success:true,
		user:adminUser,
		type:'info',
		time:selfUtils.getNowDate(),
		text:'来自系统消息：'+user.name+' 加入 '+room+' 房间'
	});
	// 如果不止一个用户在这个房间里，汇总下都是谁
	var userInRoom = io.sockets.adapter.rooms[room];
	var userInRoomSummary = '来自系统消息：现在 '+room+' 房间里面的人有: ';
	// 确定有哪些用户在这个房间里
	var timeCount = 0;
	for(var index in userInRoom){
		timeCount ++;
	}
	userInRoomSummary +=timeCount+' 共同话题的人员';
	// 讲房间里其它用户的汇总发送给这个用户
	socket.emit('message',{
		success:true,
		user:adminUser,
		type:'info',
		time:selfUtils.getNowDate(),
		text:userInRoomSummary
	});
}

function handleMessageBroadcasting(socket){
	socket.on('message',function(user,message){
		if(user.id && user.name){
			if(user.id =='you duo shuo id'){
				var words = message.text.split(' ');
				var command = words[0];
				if(command=='join'){
					words.shift();
				    var room = words.join('');
				    joinRoom(socket,user,room);
					socket.broadcast.to(message.room).emit('message',{
						success:true,
						user:adminUser,
						type:'info',
						time:selfUtils.getNowDate(),
						text:"管理员新增了一个房间"+room
					});
				}else{
					
				}
				
			}
			socket.broadcast.to(message.room).emit('message',{
				success:true,
				user:user,
				type:'info',
				time:selfUtils.getNowDate(),
				text:message.text
			});
			socket.emit('message',{
				success:true,
				user:user,
				type:'self',
				time:selfUtils.getNowDate(),
				text:message.text
			});
		}else{
			socket.emit('message',{
				success:false,
				user:user,
				message:'亲！请您先登录好吗？'
			});
		}
	});
}
function handleRoomJoining(socket){
	socket.on('join',function(user,room){
		if(user.id && user.name){
			socket.leave(currentRoom[socket.id]);
			joinRoom(socket,user,room.newRoom);
		}else{
			socket.emit('joinResult',{
				success:false,
				message:'亲！请您先登录好吗？'
			});
		}
	});
}

function handleClientDisconnection(socket){
	socket.on('disconnect',function(){
		delete nickNames[socket.id];
		delete currentRoom[socket.id];
	});
}
