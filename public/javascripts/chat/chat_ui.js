function divEscapendContentElement(message){
	return $('<div></div>').html(message);
}
function divSystemContentElement(message){
	return $('<div></div>').html('<i>'+message+'</i>');
}


var socket = io.connect('http://baiyatao.com:5000',{port:5000});

$(function(){
	var chatApp = new Chat(socket);
	var userinfo = JSON.parse(user);
	var $noticeInfo = $('#js_chat-notice');
	var $roomlist = $('#room-list');
	var $sendmessage = $('#send-message');
	var $sendbutton = $('send-button');
	var $messages = $('#messages');
	var roomTemplate = '<ul class="room-listbox">'+
							'{{# var rooms = d.rooms; for(var i=0; i<rooms.length; i++) {}}'+
							   '<li id="{{rooms[i].name}}" class="{{=rooms[i].name == d.room ? "active":""}}">'+
									'<span>{{rooms[i].name}}</span>'+'({{rooms[i].counts}})'+
							   '</li>'+
							'{{# } }}'+
						'</ul>';
	var messageTemplate = '{{# var message = d.message;}}'+
						  '{{# var tempuser = message.user;}}'+
							'<li class="{{= message.type=="self" ? "chat_me":""}}">'+
							'{{# if(message.type=="self"){ }}'+
								'<div class="chat_user">'+
									'<span class="chat_time">{{=message.time}}</span>'+
									'<a class="chat_avatar" target="_blank" href="{{=tempuser.url}}">'+
										'<span class="chat_name">{{=tempuser.name}}</span>'+
										'<img class="" src="{{=tempuser.avatar_url}}">'+
									'</a>'+
								'</div>'+
								'<div class="chat_say">{{=message.text}}</div>'+
							'{{# }else { }}'+
								'<div class="chat_user">'+
									'<a class="chat_avatar" target="_blank" href="{{=tempuser.url}}">'+
										'<img class="" src="{{=tempuser.avatar_url}}">'+
										'<span class="chat_name">{{=tempuser.name}}</span>'+
									'</a>'+
									'<span class="chat_time">{{=message.time}}</span>'+
								'</div>'+
								'<div class="chat_say">{{=message.text}}</div>'+
							'{{# } }}'
						'</li>';
	
	socket.emit('rooms');
	if(userinfo.id){
		var playRoom = '前端白小白';
		chatApp.processCommand(userinfo,'/join '+playRoom);
	}
	socket.on('joinResult',function(result){
		if(result.success == true){
			$noticeInfo.attr('class','chat-notice chat-info').html('欢迎您进入<h3>'+result.room+'</h3>聊天室');
			playRoom = result.room;
			$messages.find('.chat_view').empty();
			socket.emit('rooms');
		}else{
			$noticeInfo.attr('class','chat-notice chat-warning').html('<h3>警告信息：</h3>'+result.message);
		}
	});
	
	socket.on('message',function(message){
		console.log(message);
		if(message.success == true){
			var $html = laytpl(messageTemplate).render({message:message});
			$messages.find('.chat_view').append($html);
			$messages.scrollTop($messages.find('ul').height()-350);
		}else{
			$noticeInfo.attr('class','chat-notice chat-warning').html('<h3>警告信息：</h3>'+message.message);
		}
	});
	
	socket.on('rooms',function(rooms){
		$roomlist.empty().html(laytpl(roomTemplate).render({rooms:rooms,room:playRoom}));
	});
	
	$roomlist.find('li').die('click').live('click',function(e){
		if(userinfo.id){
			var $this = $(this);
			if($this.hasClass('active')){
				return false;
			}
			chatApp.processCommand(userinfo,'/join '+$this.attr('id'));
			$('#send-message').focus();
		}else{
			$noticeInfo.attr('class','chat-notice chat-warning').html('<h3>警告信息：</h3>亲！请您先登录好吗？');
		}
	});
	
	setInterval(function(){
		socket.emit('rooms');
	},5000);
	
	$('#send-message').focus();
	
	$('#send-button').die('click').live('click',function(e){
		var message = $sendmessage.val();
		if(message){
			chatApp.sendMessage(userinfo,playRoom,message);
			$sendmessage.val('');
		}
		return false;
	});
})