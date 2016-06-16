/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.07.26 14:20
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @target 网站的脚本，最后会压缩合并
 */

;(function($){
    $(function(){
        prettyPrint();
        setTimeout(function(){
        	var url = 'http://'+location.host+'/logout?url='+location.href;
        	url = 'http://baiyatao.duoshuo.com/logout/?sso=1&redirect_uri='+encodeURIComponent(url);
        	if($('#js_logout').length){
        		$('#js_logout').attr('href',url);
        	}else{
        		$('#ds-login').show();
        	}
	        $('a[rel="nofollow"]:contains("登出")').attr('href',url);
        },3000);
        var $minHeight = $('.min-height');
        var changeMin = $minHeight ?function(){
        	var height = $(window).height();
        	$minHeight.css({
        		'min-height':height-232
        	});
        }:function(){
        	
        };
        changeMin();
        $(window).resize(changeMin);
        
		
        function AutoScroll(){
            $("#isay").find("ul").animate({
                marginTop:"-26px"
            },500,function(){
                $(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
            });
        }
        var $hotblog = $('#js_hot-blog');
        if($hotblog.find('li').length == 0){
        	$.get('/ajax/hotblog',function(data){
				if(data.status == '1'){
					var list = data.data,i= list.length,$lis = '';
					for(i;i--;){
						$lis+='<li><a target="_blank" href="'+list[i].url+'" title = "'+list[i].title+'">'+list[i].title+'</a></li>';
					}
					$hotblog.html($lis);
					setInterval(AutoScroll,4000);
				}else{
					$hotblog.html('暂无数据');
				}
			});
        }else{
        	if($hotblog.length && $hotblog.find('li').length){
	        	setInterval(AutoScroll,4000);
        	}
        }
        $("#isay .close").click(function(event) {
            $("#isay").fadeOut();
        });
        
        setInterval(function(){
        	$('#chat_advertise').animate({
                marginTop:"-30px"
            },500,function(){
                $(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
            });
        },3000);
        var animateTime = 300;
        $('div.website-area .btn-default').click(function (e) {
			var $this = $(this), $area = $this.parent().parent(), type = $this.data('type'),
				$infoBox = $area.find('> .info_box'), $codeBox = $area.find('> .code_box');
			switch (type) {
				case 'info' :
					$area.addClass('website-area-info');
					setTimeout(function () {
						$infoBox.css('display','block');
						$codeBox.css('display','none');
					},animateTime/2);
					break;
				case 'code' :
					$area.removeClass('website-area-info');
					setTimeout(function () {
						$codeBox.css('display','block');
						$infoBox.css('display','none'); 
					},animateTime/2);
					break;	
				default:
					
					break;
			}		
		});
		
		var counts = 0;
		var getDuoshuo = setInterval(function(){
			if(DUOSHUO.visitor.data && DUOSHUO.visitor.data.user_id && $('#ds-login').length){
				$.post('/duoshuo',{user_id:DUOSHUO.visitor.data.user_id},function(data){
					if(data.status=='1'){
						location.href = location.href;
					}
				});
				clearInterval(getDuoshuo);
			}
			if(counts>3){
				clearInterval(getDuoshuo);
			}else{
				counts++;
			}
		},1000);
		
		function insertRandomBlog(data){
			var $randomBox = $('#js_random-article');
			var list = data,i= list.length,$lis = '';
			for(i;i--;){
				$lis+='<li><a target="_blank" href="'+list[i].type+'/'+list[i].id+'">'+list[i].title+'</a></li>';
			}
			$('#circle').hide();
			$('#circle1').hide();
			$randomBox.html($lis).show();
		}
		
		function getRandomBlog(){
			$('#js_random-article').hide();
			$('#circle').show();
			$('#circle1').show();
			setTimeout(function(){
				$.get('/random/blog',function(data){
					if(data.status == '1'){
						insertRandomBlog(data.data);
					}else{
						alert('获取数据失败')
					}
					$('#js-need-reload').removeClass('active');
				});
			},1000);
		}
		var $needRandom = $('#js-need-reload');
		if($needRandom.length){
			getRandomBlog();
			$needRandom.off('click').on('click',function(e){
				if(!$needRandom.hasClass('active')){
					$needRandom.addClass('active');
					getRandomBlog();
				}
			});
		}
		
		var $blogType = $('#article-typelist');
		
		if($blogType.length && $blogType.find('a').length == 0){
			var typeArray = ['all','article','share'];
			var typeUrlArray = ['category','acategory','scategory'];
			var type = parseInt($blogType.attr('data-type'));
			$.get('/ajax/'+typeUrlArray[type],function(data){
				if(data.status == '1'){
					var urlType = typeArray[type];
					var list = data.data,i= list.length,$lis = '';
					for(i;i--;){
						$lis+='<a target="_blank" href="/category/'+urlType+'/'+list[i].category+'" title="查看分类：'+list[i].category+'">'+list[i].category+'<span>('+list[i].counts+')</span></a>';
					}
					$blogType.html($lis);
				}else{
					$blogType.html('获取数据失败');
				}
			});
		}
    });
})(jQuery);