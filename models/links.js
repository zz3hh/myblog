/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.07.26 14:20
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @target 网站链接信息model
 */

var db = require('./db').db;

function Links(link){
	this.id = link.id; // 链接id
	this.name = link.name; // 链接名称
	this.url = link.url; // 链接地址
	this.isInner = link.isInner; // 是否属于内链
	this.isExchange = link.isExchange; // 是否已经交换链接
	this.description = link.description; // 链接描述
}

/**
 * @descriptionription 保存或修改链接信息
 * @param {Object} callback
 */
Links.prototype.save = function(callback){
	var links = {
		id:this.id,
		name:this.name,
		url:this.url,
		isInner:this.isInner,
		isExchange:this.isExchange,
		description:this.description
	};
	db.query('select * from `links_list` where `id` = ? limit 1',[links.id],function(err,data){
		if(err){
			return callback(err);
		}
		if(Array.isArray(data) && data.length) {
			db.query('update `links_list` set `name` = ?,`url` = ?,`isInner` = ?,`isExchange` = ?,`description` = ? where `id` = ?',[links.name,links.url,links.isInner,links.isExchange,links.description,links.id],function(err,info){
				if(err){
					return callback(err);
				}
				callback(null,info);
			});
		}else{
			db.query('insert into `links_list`(`name`,`url`,`isInner`,`isExchange`,`description`) values (?,?,?,?,?)',[links.name,links.url,links.isInner,links.isExchange,links.description],function(err,info){
				if(err){
					return callback(err);
				}
				callback(null,info);
			});
		}
	});
};

/**
 * @descriptionription 得到网站链接分类
 * @param {Object} isInner 是否内链
 * @param {Object} callback
 */
Links.getLinksByIsInner = function(isInner,callback){
	db.query('select * from `links_list` where `isInner` = ?',[isInner],function(err,list){
		if(err){
			return callback(err);
		}
		callback(null,list);
	});
};

Links.getAllLinks = function(callback){
	db.query('select * from `links_list`',function(err,list){
		if(err){
			return callback(err);
		}
		callback(null,list);
	});
};

Links.getLinkById = function(linkId,callback){
	db.query('select * from `links_list` where `id` = ? limit 1',[linkId],function(err,list){
		if(err){
			return callback(err);
		}
		callback(null,list[0]);
	});
};

/**
 * @description 得到数据中共有多少条数据
 * @param {Object} callback
 */
Links.getCount = function(callback){
	db.query('select count(id) as total from `links_list`',function(err,info){
		if(err){
			return callback(err);
		}
		return callback(null,info[0].total);
	});
}

/**
 * @description 得到分页数据
 * @param {Object} from
 * @param {Object} to
 * @param {Object} callback
 */
Links.getLinksPage = function(from,to,callback){
	db.query('select * from `links_list` order by id desc limit ?,?',[from,to],function(err,list){
		if(err){
			return callback(err);
		}
		callback(null,list);
	});
}

/**
 * @descriptionription 删除网站链接
 * @param {Object} linkId
 */
Links.deleteById = function(linkId,callback){
	db.query('delete from `links_list` where `id` = ?',[linkId],function(err){
		if(err){
			return callback(err);
		}
		callback(null);
	});
};
module.exports = Links;