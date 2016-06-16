var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var links = require('./links');
var debug = require('debug')('buliangren:update');

debug('读取闲心网站的前端江湖录');

// 读取闲心网站的前端江湖录
request({url:'http://sentsin.com/daohang/',encoding:null},function(err,res,body){
	if(err){
		return console.error(err);
	}
	
	body = iconv.decode(body,'gb2312');
	//根据网页内容创建DOM操作对象
	var $ = cheerio.load(body);
	
	//读取集数列表
	$('.dh_minglu li').each(function(index,data){
		var $a = $(this).find('a');
		var Link = new links({
			name:$a.html().split('<cite>')[0],
			description:$a.find('cite').text(),
			url:$a.attr('href').trim(),
			isInner:0,
			isExchange:0
		});
		Link.save(function(err,info){
		});
	});
});
