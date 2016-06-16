/**
 * 模块依赖
 */
var mysql = require('mysql'),
    config = require('./config');
var crypto = require('crypto');
/**
 * 初始化客户端
 */
var database = config.dbSettings.database
//delete config.dbSettings.database;
var db = mysql.createConnection({
	host : '127.0.0.1',
	port : 3306,
	user : config.dbSettings.user,
	password : config.dbSettings.password
});

/**
 * 创建数据库
 */
db.query('create database if not exists '+database);
db.query('use '+database);

/**
 * 创建表
 */

db.query('drop table if exists user');
db.query('create table user ('+
		'name VARCHAR(50),'+
		'password VARCHAR(250))DEFAULT CHARSET=utf8');
		
db.query('drop table if exists pv');
db.query('create table pv ('+
		'count INT(11))DEFAULT CHARSET=utf8');
		
db.query('drop table if exists article_list');
db.query('create table article_list ('+
		'id INT(11) NOT NULL auto_increment,'+
		'author VARCHAR(50),'+
		'time datetime default now(),'+
		'title VARCHAR(250),'+
		'headintro VARCHAR(255),'+
		'headimg VARCHAR(255),'+
		'readtime INT(11),'+
		'content text,'+
		'category text,'+
		'primary key (id))DEFAULT CHARSET=utf8');
		
		
db.query('drop table if exists share_list');
db.query('create table share_list ('+
		'id INT(11) NOT NULL auto_increment,'+
		'author VARCHAR(50),'+
		'time datetime default now(),'+
		'title VARCHAR(250),'+
		'headintro VARCHAR(255),'+
		'headimg VARCHAR(255),'+
		'readtime INT(11),'+
		'content text,'+
		'url VARCHAR(250),'+
		'category text,'+
		'primary key (id))DEFAULT CHARSET=utf8');
		
db.query('drop table if exists links_list');
db.query('create table links_list ('+
		'id INT(11) NOT NULL auto_increment,'+
		'name VARCHAR(255),'+
		'url VARCHAR(255),'+
		'isInner int(1) default 0,'+
		'isExchange int(1) default 0,'+
		'description Text,'+
		'primary key (id))DEFAULT CHARSET=utf8');
//alter table article_list add column headimg varchar(250) not null	
var md5 = crypto.createHash('md5');
var pwd =  md5.update(config.admin.password).digest('base64');
db.query('insert into `user`(`name`,`password`) values (?,?)',[config.admin.username,pwd],function(err,info){
	if(err){
		return console.error(err);
	}
	db.end(function(){
		process.exit();
	});
});

