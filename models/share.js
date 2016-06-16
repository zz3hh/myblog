/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.07.26 16:00
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @target 分享的博客文章信息model
 */

var db = require('./db').db;
var utils = require('./utils');

function Share(article){
	this.id = article.id; // 文章id
	this.author = article.author; // 文章作者
	this.time = article.time; // 文章创建时间
	this.title = article.title; // 文章标题
	this.headintro = article.headintro; // 文章首页的简介
	this.headimg = article.headimg; //文章首页的图片展示
	this.readtime = article.readtime; // 文章阅读次数
	this.content = article.content; // 文章文本
	this.url = article.url; // 文章来源URL
	this.category = article.category; // 文章分类
};

/**
 * @description 保存文章信息
 * @param {Object} callback
 */
Share.prototype.save = function(callback){
	var article = {
		id : this.id,
		author : this.author,
		time : this.time,
		title : this.title,
		headintro : this.headintro,
		headimg : this.headimg,
		readtime : this.readtime,
		content : this.content,
		url:this.url,
		category : this.category
	};
	db.query('select * from `share_list` where `id` = ? limit 1',[article.id],function(err,data){
		if(err){
			return callback(err);
		}
		if(Array.isArray(data) && data.length) {
			db.query('update `share_list` set `title` = ?,`author` = ?,`headintro` = ?,`headimg` = ?,`content` = ?,`category` = ? where `id` = ?',
				[article.title,article.author,article.headintro,article.headimg,article.content,article.category,article.id],
				function(err,list){
					if(err){
						return callback(err);
					}
					callback(null,list);
				});
		}else{
			db.query('insert into `share_list`(`author`,`title`,`headintro`,`headimg`,`content`,`category`,`url`,`readtime`) values (?,?,?,?,?,?,?,?)',
				[article.author,article.title,article.headintro,article.headimg,article.content,article.category,article.url,0],
				function(err,list){
					if(err){
						return callback(err);
					}
					callback(null,list);
			});
		}
	});
};

/**
 * @description 得到所有分享文章
 * @param {Object} callback
 */
Share.getAllArticle = function(callback){
	db.query('select * from `share_list`',function(err,list){
		if(err){
			return callback(err);
		}
		callback(null,list);
	});
};

/**
 * @description 文章关键词搜索
 * @param {Object} key
 * @param {Object} callback
 */
Share.getAllArticleByKey = function(key,callback){
	db.query('select DISTINCT `id` from `share_list` where title like ? or author like ? or category like ?',[key,key,key],function(err,list){
		if(err){
			return callback(err);
		}
		return callback(null,list);
	});
}

/**
 * @description 获取随机文章
 * @param {Object} callback
 */
Share.getArticleRandomOne = function(callback){
	db.query('SELECT t1.id,t1.title FROM `share_list` AS t1 JOIN '+
		'(SELECT ROUND(RAND() * ((SELECT MAX(id) FROM `share_list`)-(SELECT MIN(id) FROM `share_list`))+(SELECT MIN(id) FROM `share_list`)) AS id) AS t2 '+
		'WHERE t1.id >= t2.id ORDER BY t1.id LIMIT 1',
		function(err,list){
		if(err){
			return callback(err);
		}
		return callback(null,list[0]);
	});
}

/**
 * @description 获取随机的几条数据
 * @param {Object} total
 * @param {Object} callback
 */
Share.getArticleRandomList = function(total,callback){
	Share.getCount(function(err,count){
		utils.getRandomArray(count,total,function(array){
			var ids = array.join(',')
			db.query('SELECT id,title FROM `share_list` where id in ('+ids+')',function(err,list){
				if(err){
					return callback(err);
				}
				return callback(null,list);
			});
		});
	});
}
/**
 * @description 得到前多少篇文章，最新的文章作为首页展示
 * @param {Object} count
 * @param {Object} callback
 */
Share.getTopArticle = function(count,callback){
	db.query('SELECT * FROM `share_list` order by id desc limit 0,?',[count],function(err,list){
		if(err){
			return callback(err);
		}
		return callback(null,list);
	});
}

/**
 * @description 得到分页数据
 * @param {Object} from
 * @param {Object} to
 * @param {Object} callback
 */
Share.getArticlePage = function(from,to,callback){
	db.query('select * from `share_list` order by id desc limit ?,?',[from,to],function(err,list){
		if(err){
			return callback(err);
		}
		callback(null,list);
	});
}

/**
 * @description 得到数据中共有多少条数据
 * @param {Object} callback
 */
Share.getCount = function(callback){
	db.query('select count(id) as total from `share_list`',function(err,info){
		if(err){
			return callback(err);
		}
		return callback(null,info[0].total);
	});
}

/**
 * @description 的到文章的标签信息
 * @param {Object} callback
 */
Share.getCategorys = function(callback){
	db.query("SELECT count(category) as counts ,category FROM `share_list` where category !='' group by category",function(err,list){
		if(err){
			return callback(err);
		}
		return callback(null,list);
	});
}

/**
 * @description 得到文章标签信息下多少条数据
 * @param {Object} category
 * @param {Object} callback
 */
Share.getCategoryCount = function(category,callback){
	db.query('select count(id) as total from `share_list` where `category` = ?',[category],function(err,info){
		if(err){
			return callback(err);
		}
		callback(null,info[0].total);
	});
}

/**
 * @description 得到文章相同标签下分页的信息
 * @param {Object} category 标签
 * @param {Object} from
 * @param {Object} to
 * @param {Object} callback
 */
Share.getCategoryPage = function(category,from,to,callback){
	db.query('select * from `share_list` where `category` = ? order by id desc limit ?,?',[category,from,to],function(err,list){
		if(err){
			return callback(err);
		}
		callback(null,list);
	});
}
/**
 * @description 得到文章信息
 * @param {Object} articleId
 * @param {Object} callbak
 */
Share.getArticleById = function(articleId,callback){
	db.query('select * from `share_list` where `id` = ? limit 1',[articleId],function(err,info){
		if(err){
			return callback(err);
		}
		callback(null,info);
	});
};

/**
 * @description 更新文章分类
 * @param {Object} articleId
 * @param {Object} category
 * @param {Object} callback
 */
Share.updateArticleCategory = function(articleId,category,callback){
	db.query('update `share_list` set `category` = ? where `id` = ?',[articleId,category],function(err,info){
		if(err){
			return callback(err);
		}
		callback(null,info);
	});
};

/**
 * @description 得到文章信息
 * @param {Object} category
 * @param {Object} callback
 */
Share.getArticleByCategory = function(category,callback){
	db.query('select * from `share_list` where `category` = ?',[category],function(err,info){
		if(err){
			return callback(err);
		}
		callback(null,info);
	});
};

/**
 * @description 删除文章信息
 * @param {Object} articleId
 * @param {Object} callback
 */
Share.deleteArticleById = function(articleId,callback){
	db.query('delete from `share_list` where `id` = ?',[articleId],function(err){
		if(err){
			return callback(err);
		}
		callback(null);
	});
};

/**
 * @description 更新文章阅读次数
 * @param {Object} articleId
 * @param {Object} callback
 */
Share.UpdateReadtime = function(articleId,callback){
	db.query('select * from `share_list` where `id` = ? limit 1',[articleId],function(err,info){
		if(err){
			return callback(err);
		}
		var count = info[0].readtime;
		count = count + 1;
		db.query('update `share_list` set `readtime` = ? where `id` = ?',[count,articleId],function(err){
			if(err){
				return callback(err);
			}
			callback(null);
		});
	});
};

module.exports = Share;