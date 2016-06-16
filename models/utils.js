/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.08.02 18:40
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @target 网站中用到的公共方法
 */

exports.getNowDate = function(valueOf){
	var days = valueOf ? new Date(valueOf):new Date();
	var dateMonth = (days.getMonth() + 1)<10 ? "0"+(days.getMonth() + 1):(days.getMonth() + 1);
	var dateDay = days.getDate()<10 ? "0"+days.getDate():days.getDate();
	var hours = days.getHours() < 10 ? "0" + days.getHours() : days.getHours();
	var minutes = days.getMinutes() < 10 ? "0" + days.getMinutes() : days.getMinutes();
	return days.getFullYear() + "-" + dateMonth + "-" + dateDay + " " + hours + ":" + minutes;
}
var pageinfo = {
		number: 1,
		perpage: 10,
		from: 0,
		to: 10,
		total: 90,
		count: 9,
		narrow:5
	};
exports.pageshow = function(paging){
	var html = [];
    if(paging.number > 0 && paging.number <= paging.count){
        var startPage = 1,
            prevPage = paging.number - 1,
            nextPage = paging.number + 1,
            cp = Math.ceil(paging.number/paging.narrow),
            tp = Math.ceil(paging.count/paging.narrow);
        if(paging.number > paging.narrow){
            html.push('<li><a href="?page=1">首页</a></li>');
            html.push('<li><a href="?page=' + (paging.number - 1) + '">Prev</a></li>');
            html.push('<li><a href="?page=' + (cp - 1)*paging.narrow + '">...</a></li>');
        }
        if(cp > 1){
            startPage = (cp-1)*paging.narrow + 1;
        }
        console.log(startPage);
        console.log(cp*paging.narrow);
        for(var i = startPage; i < cp*paging.narrow + 1; i++){
            if (i > paging.count) break;
            if (i == paging.number) {
                html.push('<li><a href="javascript:" class="current">' + i + '</a></li>');
            } else {
                html.push('<li><a href="?page=' + i + '">' + i + '</a></li>');
            }
        }
        if(cp < tp){
            html.push('<li><a href="?page=' + (cp*paging.narrow + 1) + '">...</a></li>');
            html.push('<li><a href="?page=' + nextPage + '">Next</a></li>');
            html.push('<li><a href="?page=' + paging.count + '">Last</a></li>');
        }
        html = html.join('');
        console.log(html);
    }
}
exports.getRandomArray = function(maxRange,total,callback){
	var array = [];
	if(maxRange){
		function generateRandom(total){ 
		     var rand = parseInt(Math.random()*maxRange); 
		     for(var i = 0 ; i < array.length; i++){ 
		          if(array[i] == rand){ 
		               return false; 
		          }      
		     }
		     if(rand){
			     array.push(rand); 
		     }
		}
		for(var i = 0 ; ; i++){ 
		    // 只生成10个随机数 
		    if(array.length<total){ 
		        generateRandom(total); 
		    }else{ 
		      break; 
		    } 
		}
		return callback(array);
	}
	return callback(array);
}
