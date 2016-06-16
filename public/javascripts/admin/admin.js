$(function() {
	$('#js_post-article').off('click').on('click', function(e) {
		var name = $('#js_article-name').val();
		var category = $('#js_article-category').val();
		var headintro = $('#js_article-headintro').val(); // 文章简介
		var headimg = $('#js_article-headimg').val(); // 文章展示图片
		var content = UE.getEditor('editor').getContent();

		$.post('/admin/addarticle', {
			name: name,
			headintro:headintro,
			headimg:headimg,
			category: category,
			content: content
		}, function(data) {
			if (data.state == "200") {
				window.location.href = '/article/' + data.data.id;
			} else {
				alert('新增文章失败,请稍后再试');
			}
		});
	});

	$('#js_update-article').off('click').on('click', function(e) {
		var id = $('#js_article-id').val();
		var name = $('#js_article-name').val();
		var category = $('#js_article-category').val();
		var content = UE.getEditor('editor').getContent();
		var headintro = $('#js_article-headintro').val(); // 文章简介
		var headimg = $('#js_article-headimg').val(); // 文章展示图片
		
		$.post('/admin/editarticle', {
			id: id,
			name: name,
			headintro:headintro,
			headimg:headimg,
			category: category,
			content: content
		}, function(data) {
			if (data.state == "200") {
				window.location.href = '/article/' + data.data.id;
			} else {
				alert('文章修改失败,请稍后再试');
			}
		});
	});

	$('#js_add-links').off('click').on('click', function(e) {
		var name = $('#js_link-name').val();
		var url = $('#js_link-url').val();
		var isInner = $('#js_link-isInner').is(':checked') ? 1 : 0;
		var isExchange = $('#js_link-isExchange').is(':checked') ? 1 : 0;
		var description = $('#js_link-description').val();

		$.post('/admin/addlinks', {
			name: name,
			url: url,
			isInner: isInner,
			isExchange: isExchange,
			description: description
		}, function(data) {
			if (data.state == "200") {
				alert('新增链接成功');
			} else {
				alert('新增链接失败,请稍后再试');
			}
		});
	});

	$('#js_post-links').off('click').on('click', function(e) {
		var id = $('#js_link-id').val();
		var name = $('#js_link-name').val();
		var url = $('#js_link-url').val();
		var isInner = $('#js_link-isInner').is(':checked') ? 1 : 0;
		var isExchange = $('#js_link-isExchange').is(':checked') ? 1 : 0;
		var description = $('#js_link-description').val();

		$.post('/admin/editlinks', {
			id: id,
			name: name,
			url: url,
			isInner: isInner,
			isExchange: isExchange,
			description: description
		}, function(data) {
			if (data.state == "200") {
				alert('链接修改成功');
			} else {
				alert('链接修改失败,请稍后再试');
			}
		});
	});
	$('.delete-links').off('click').on('click', function(e) {
		var id = $(this).parents('li').attr('linkid');
		console.log(id);
		$.post('/admin/dellinks', {
			id: id
		}, function(data) {
			if (data.state == "200") {
				alert('链接删除成功');
			} else {
				alert('链接删除失败,请稍后再试');
			}
		});
	});
	$('#fetchCommodity').off('click').on('click',function(e){
		var url = $('#js_share-inputurl').val();
		if(url){
			$.get('/admin/getshare',{url:url},function(data){
				if(data.state=="200"){
					$("#js_share-author").val(data.data.obj.author); // 文章作者
					$('#js_share-title').val(data.data.obj.title); // 文章标题
					UE.getEditor('editor').setContent(data.data.obj.content); // 文章文本
					$('#js_share-url').val(data.data.obj.url); // 文章来源URL
				}else{
					alert('获取博客信息失败，请稍后重试');
				}
			});
		}
	});
	
	$('#js_post-share').off('click').on('click',function(e){
		var author = $("#js_share-author").val(); // 文章作者
		var title = $('#js_share-title').val(); // 文章标题
		var content = UE.getEditor('editor').getContent(); // 文章文本
		var headintro = $('#js_share-headintro').val(); // 文章简介
		var headimg = $('#js_share-headimg').val(); // 文章展示图片
		var url = $('#js_share-url').val(); // 文章来源URL
		var category = $('#js_share-category').val(); // 文章分类
		
		$.post('/admin/addshare', {
			author: author,
			title:title,
			url:url,
			headintro:headintro,
			headimg:headimg,
			category: category,
			content: content
		}, function(data) {
			if (data.state == "200") {
				window.location.href = '/share/' + data.data.id;
			} else {
				alert('新增分享失败,请稍后再试');
			}
		});
	});
	
	$('#js_update-share').off('click').on('click', function(e) {
		var id = $('#js_share-id').val();
		var author = $("#js_share-author").val(); // 文章作者
		var title = $('#js_share-title').val();
		var headintro = $('#js_share-headintro').val(); // 文章简介
		var headimg = $('#js_share-headimg').val(); // 文章展示图片
		var url = $('#js_share-url').val(); // 文章来源URL
		var category = $('#js_share-category').val();
		var content = UE.getEditor('editor').getContent();

		$.post('/admin/editshare', {
			id: id,
			author:author,
			title: title,
			headintro:headintro,
			headimg:headimg,
			url:url,
			category: category,
			content: content
		}, function(data) {
			console.log(data);
			if (data.state == "200") {
				window.location.href = '/share/' + data.data.id;
			} else {
				alert('文章修改失败,请稍后再试');
			}
		});
	});
	
	$('#js_login-btn').off('click').on('click',function(e){
		var username = $('#js_username').val();
		var userpwd = $('#js_password').val();
		if(!username){
			alert('请输入管理员账号');
			return false;
		}
		if(!userpwd){
			alert('请输入管理员密码');
			return false;
		}
		$.post('/admin/login', {
			username: username,
			userpwd:userpwd
		}, function(data) {
			if (data.state == "success") {
				location.href ='/admin/article';
			} else {
				alert('sorry!登录后台失败：失败原因'+data.message);
			}
		});
	});
	
	$('#js_update-pwd').off('click').on('click',function(e){
		var username = $('#js_username').val();
		var userpwd = $('#js_password').val();
		var repassword = $('#js_repassword').val();
		if(!username){
			alert('请输入管理员账号');
			return false;
		}
		if(!userpwd){
			alert('请输入管理员密码');
			return false;
		}
		if(!repassword){
			alert('请输入管理员新密码');
			return false;
		}
		if(userpwd==repassword){
			alert('请不要设置成为原密码');
			return false;
		}
		$.post('/admin/updatepwd', {
			username: username,
			userpwd:userpwd,
			repassword:repassword
		}, function(data) {
			if (data.state == "success") {
				alert('恭喜修改密码成功');
				location.href ='/admin/article';
			} else {
				alert('sorry!登录后台失败：失败原因'+data.message);
			}
		});
	});
	
	var $shareid = $('#js_share-id');
	if($shareid.length){
		$.get('/edit/shareinfo/'+$shareid.val(),function(data){
			if(data.code==0){
				var article = data.data;
				$('#js_share-headintro').val(article.headintro);
				 setTimeout(function(){
					UE.getEditor('editor').setContent(article.content);
				},800);
			}
		});
	}
	var $articleid = $('#js_article-id');
	if($articleid.length){
		$.get('/edit/articleinfo/'+$articleid.val(),function(data){
			if(data.code==0){
				var article = data.data;
				$('#js_article-headintro').val(article.headintro);
			}
		});
	}
})