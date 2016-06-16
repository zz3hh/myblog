/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.07.26 15:30
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @target 网站pv统计model
 */

var db = require('./db').db;

var pv = {
	insert:function(callback){
		db.query('select * from pv',function(err,info){
			if(err){
				return callback('pv select Error');
			}
			if(Array.isArray(info) && info.length) {
				var count = info[0].count+1;
				db.query('update `pv` set `count` = ?',[count],function(err,info){
					if(err){
						return callback('pv update Error');
					}
					return callback(null,count);
				});
			}else{
				db.query('insert into `pv` (`count`) values(?)',[1],function(err,info){
					if(err){
						return callback('pv insert Error');
					}
					return callback(null,count);
				});
			}	
		});
	},
	get:function(callback){
		db.query('select * from pv',function(err,info){
			if(err){
				return console.log('pv select Error');
			}
			return callback(null,info[0].count);
		});
	}
};
module.exports = pv;