var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var debugwrite = require('./debug');
var buffer = require('buffer');
var URL = require('url');
var debug = require('debug')('csdn:blog');


/**
 * @description 将code以POST的方式提交到多说API，交换token
 * @param {Object} client_id
 * @param {Object} code
 * @param {Object} callback
 */
exports.login = function(client_id,code,callback){
	var url = 'http://api.duoshuo.com/oauth2/access_token';
	var resJson = {
            state: 'failed'
        };
	request.post({url:url,form:{code:code,client_id:client_id}},function(err,res,body){
		if(err){
			resJson.message = '向多说网站请求数据时出现未知错误';
			return callback(resJson);
		}
		var info = JSON.parse(body);
		if(info.code == 0){
			resJson.state = 'success';
			resJson.info = info;
		}else{
			resJson.message = info.errorMessage;
		}
		callback(resJson);
	});
}

/**
 * @description 获取多说用户信息
 * @param {Object} user_id
 * @param {Object} callback
 */
exports.getUserInfo = function(user_id,callback){
	var url = 'http://api.duoshuo.com/users/profile.json?user_id='+parseInt(user_id);
	var resJson = {
            state: 'failed'
        };
	request({url:url},function(err,res,body){
		if(err){
			resJson.message = '向多说网站请求数据时出现未知错误';
			return callback(resJson);
		}
		var info = JSON.parse(body);
		if(info.code == 0){
			resJson.state = 'success';
			resJson.info = info;
		}else{
			resJson.message = info.errorMessage;
		}
		callback(resJson);
	});
}


/**
 * @description 获取文章评论、转发数 eg:http://api.duoshuo.com/threads/counts.json?short_name=official&threads=4ff1cbc43ae636b72a00001d
 * @param {Object} short_name 必须 站点注册的多说二级域名 注意：你注册了http://abc.duoshuo.com/时，short_name为abc
 * @param {Object} threads 必须 你需要获取的文章的thread-key，可传递多个thread_key，即文章在原站点中的id，与评论框中data-thread-key一致。用逗号分割
 * @param {Object} callback
 */
exports.getArticleCountsInfo = function(short_name,threads,callback){
	var url ='http://api.duoshuo.com/threads/counts.json?short_name='+short_name+'&threads='+threads;
	var resJson = {
            state: 'failed'
        };
	request({url:url},function(err,res,body){
		if(err){
			resJson.message = '向多说网站请求数据时出现未知错误';
			return callback(resJson);
		}
		var info = JSON.parse(body);
		if(info.code == 0){
			resJson.state = 'success';
			resJson.infolist = info.response;
		}else{
			resJson.message = info.errorMessage;
		}
		callback(resJson);
	});
}
/**
 * @description 获取热评文章  eg:http://api.duoshuo.com/sites/listTopThreads.json?short_name=apitest
 * @param {Object} short_name 站点申请的多说二级域名 必选
 * @param {Object} range 获取的范围。daily：每日热评文章； weekly：每周热评文章； monthly：每月热评文章；all：总热评文章。
 * @param {Object} num_items 获取的条数。默认为5条
 * @param {Object} callback
 */
exports.listTopThreads = function(short_name,callback){
	var url = 'http://api.duoshuo.com/sites/listTopThreads.json?short_name='+short_name+'&range=all&num_items=8';
	var resJson = {
            state: 'failed'
        };
	request({url:url},function(err,res,body){
		if(err){
			resJson.message = '向多说网站请求数据时出现未知错误';
			return callback(resJson);
		}
		var info = JSON.parse(body);
		if(info.code == 0){
			resJson.state = 'success';
			resJson.articlelist = info.response;
		}else{
			resJson.message = info.errorMessage;
		}
		callback(resJson);
	});
}
