var originRequest = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var debugwrite = require('./debug');
var buffer = require('buffer');
var URL = require('url');
var debug = require('debug')('csdn:blog');


/**
 * @description 请求指定URL
 * @param {String} url
 * @param {Function} callback
 */
function request(url,callback){
	originRequest({url:url,encoding:null,headers: {
    'User-Agent': 'request'
  }},function(err,res,body){
		if(err){
			return callback(err);
		}
		//根据网页编码格式转码
		try{
			var $ = cheerio.load(body);
			var re = /<meta.+?charset=[^\w]?([-\w]+)/i;
			var charset = $('head').eq(0).html().trim().match(re);
			if(Array.isArray(charset) && charset[1] != 'utf-8'){
				body = iconv.decode(body,charset[1]);
			}
		}catch(e){
			err = e;
		}
		if(err){
			return callback(err);
		}
		return callback(null,body);
	});
}

/**
 * @description 读取外网站blog
 * @param {Object} url
 * @param {Object} callback
 */
exports.readNetBlog = function(url,callback){
	var p = URL.parse(url).host;
	p = p.replace(/-/,'').split('.');
	p = p[p.length-2];
	if(p){
		return exports[p+'blog'](url,callback);
	}
	return callback('404 NO FIND');
}

/**
 * @description 读取csdn个人blog地址  eg:http://blog.csdn.net/user/article/details/id
 * @param {Object} url
 * @param {Object} callback
 */
exports.csdnblog = function(url,callback){
	request(url,function(err,body){
		if(err){
			return callback(err);
		}
		var $ = cheerio.load(body);
		try{
			var author = $('#blog_userface .user_name').eq(0).text();
			var $articlemian = $('#article_details');
			var title = $articlemian.find('.link_title').text().replace(/\r\n/i,'').trim();
			var time = $articlemian.find('.link_postdate').eq(0).text();
			var content = $('#article_content').html().replace(/<pre.+?>/i,'<pre class="prettyprint lang-js">');
		}catch(e){
			err = e;
		}
		if(err){
			return callback(err);
		}
		return callback(null,{
			author:author,
			title:title,
			time:time,
			url:url,
			content:content
		});
	});
};