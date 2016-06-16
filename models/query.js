var article = require('./article');
var share = require('./share');
var async = require('async');
var debugwrite = require('../read/debug');
var queryArticleKeyCacheObj = {};
var cacheTime = 1000*60*30;
/**
 * @description 网站文章关键词搜索
 * @param {String} key
 * @param {Function} callback
 */
exports.queryArticleKey = function(key,callback){
	var articleList = [];
	var articleIds,shareIds;
	async.series([
		function(done){
			article.getAllArticleByKey(key,function(err,list){
				articleIds = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(articleIds,function(idinfo,next){
				article.getArticleById(idinfo.id,function(err,list){
					var articleInfo = list[0];
					articleInfo.type = 'article';
					articleList.push(articleInfo);
					next(err);
				});
			},done);
		},
		function(done){
			share.getAllArticleByKey(key,function(err,list){
				shareIds = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(shareIds,function(idinfo,next){
				share.getArticleById(idinfo.id,function(err,list){
					var articleInfo = list[0];
					articleInfo.type = 'share';
					articleList.push(articleInfo);
					next(err);
				});
			},done);
		}
	],function(err){
		if(err){
			return callback(err);
		}
		articleList.sort(function(a,b){ 
			return b.time-a.time 
		});
		return callback(null,articleList);
	});
}

/**
 * @description 网站分类下的文章
 * @param {String} category
 * @param {Function} callback
 */
exports.queryArticleByCategory = function(category,callback){
	var articleList = [];
	var articles,shares;
	async.series([
		function(done){
			article.getArticleByCategory(category,function(err,list){
				articles = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(articles,function(article,next){
				var articleInfo = article;
				articleInfo.type = 'article';
				articleList.push(articleInfo);
				next();
			},done);
		},
		function(done){
			share.getArticleByCategory(category,function(err,list){
				shares = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(shares,function(article,next){
				var articleInfo = article;
				articleInfo.type = 'share';
				articleList.push(articleInfo);
				next();
			},done);
		}
	],function(err){
		if(err){
			return callback(err);
		}
		articleList.sort(function(a,b){ return b.time-a.time });
		return callback(null,articleList);
	});
}

/**
 * @description 得到标签下信息条数
 * @param {String} category
 * @param {Function} callback
 */
exports.getAllCategoryCount = function(category,callback){
	exports.queryArticleByCategory(category,function(err,list){
		if(err){
			return callback(err);
		}else{
			return callback(null,list.length);
		}
	});
}

/**
 * @description 得到标签下的分页信息
 * @param {String} category
 * @param {Number} from
 * @param {Number} to
 * @param {Function} callback
 */
exports.getAllCategoryPage = function(category,from,to,callback){
	exports.queryArticleByCategory(category,function(err,list){
		if(err){
			return callback(err);
		}
		var data = [],min = list.length;
		to = from + to;
		for(from; (from < min && from < to);from++){
			data.push(list[from]);
		}
		callback(null,data);
	});
}

/**
 * @description 得到缓存数据，保存下来，防止下次再查询数据库，但是为了避免内存泄露，还是要定时清理数据
 * @param {String} key
 * @param {Function} callback
 */
exports.queryArticleKeyCache = function(key,callback){
	var result = queryArticleKeyCacheObj[key];
    if(!result){
    	exports.queryArticleKey(key,function(err,list){
    		if(err){
    			result = {
    				time:new Date().valueOf(),
    				total:0,
    				data:[]
				};
        		queryArticleKeyCacheObj[key]= result;
        		setTimeout(exports.removeArticleKeyCache,5000);
        		return callback(result);
    		}else{
    			result = {
    				time:new Date().valueOf(),
    				total:list.length,
    				data:list
				};
        		queryArticleKeyCacheObj[key]=result;
        		setTimeout(exports.removeArticleKeyCache,5000);
        		return callback(result);
    		}
    	});
    }else{
    	queryArticleKeyCacheObj[key].time = new Date().valueOf();
    	setTimeout(exports.removeArticleKeyCache,5000);
    	return callback(result);
    }
};

/**
 * @description 定时清除缓存
 */
exports.removeArticleKeyCache = function(){
	var nowValueOf = new Date().valueOf();
	for(cache in queryArticleKeyCacheObj){
		if(nowValueOf - queryArticleKeyCacheObj[cache].time > cacheTime){
			delete queryArticleKeyCacheObj[cache];
		}
	}
}

/**
 * @description 得到搜索下信息条数
 * @param {String} key
 * @param {Function} callback
 */
exports.getQueryKeyCount = function(key,callback){
	exports.queryArticleKey(key,function(err,list){
		if(err){
			return callback(err);
		}else{
			callback(null,list.length);
		}
	});
}

/**
 * @description 得到搜索下的分页信息
 * @param {String} key
 * @param {Number} from
 * @param {Number} to
 * @param {Function} callback
 */
exports.getQueryKeyPage = function(key,from,to,callback){
	exports.queryArticleKey(key,function(err,list){
		if(err){
			return callback(err);
		}
		var data = [],min = list.length;
		to = from + to;
		for(from; (from < min && from < to);from++){
			data.push(list[from]);
		}
		callback(null,data);
	});
}
/**
 * @description 得到网站首页展示的前多少条数据
 * @param {Number} top
 * @param {Function} callback
 */
exports.queryTopArticle = function(top,callback){
	var articleList = [];
	var articles,shares;
	async.series([
		function(done){
			article.getTopArticle(top,function(err,list){
				articles = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(articles,function(info,next){
				var articleInfo = info;
				articleInfo.type = 'article';
				articleList.push(articleInfo);
				next(null);
			},done);
		},
		function(done){
			share.getTopArticle(top,function(err,list){
				shares = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(shares,function(info,next){
				var articleInfo = info;
				articleInfo.type = 'share';
				articleList.push(articleInfo);
				next(null);
			},done);
		}
	],function(err){
		if(err){
			return callback(err);
		}
		articleList  = articleList.sort(function(a,b){ return b.time - a.time })
		return callback(null,articleList);
	});
}

/**
 * @description 得到全部分类信息
 * @param {Function} callback
 */
exports.queryCategorys = function(callback){
	var categorys = [];
	var articleCategorys,shareCategorys;
	async.series([
		function(done){
			article.getCategorys(function(err,list){
				articleCategorys = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(articleCategorys,function(info,next){
				var articleInfo = info;
				categorys[articleInfo.category] = articleInfo;
				next(null);
			},done);
		},
		function(done){
			share.getCategorys(function(err,list){
				shareCategorys = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(shareCategorys,function(info,next){
				var articleInfo = info;
				if(categorys[articleInfo.category]){
					categorys[articleInfo.category].counts += articleInfo.counts;
				}else{
					categorys[articleInfo.category] = articleInfo;
				}
				next(null);
			},done);
		}
	],function(err){
		if(err){
			return callback(err);
		}
		var data  = [];
		for(index in categorys){
			data.push(categorys[index]);
		}
		return callback(null,data);
	});
}

/**
 * @description 得到个人文章的标签情况
 * @param {Function} callback
 */
exports.queryArticleCategorys = function(callback){
	var categorys = [];
	var articleCategorys;
	async.series([
		function(done){
			article.getCategorys(function(err,list){
				articleCategorys = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(articleCategorys,function(info,next){
				var articleInfo = info;
				categorys.push(articleInfo);
				next(null);
			},done);
		}
	],function(err){
		if(err){
			return callback(err);
		}
		return callback(null,categorys);
	});
}

/**
 * @description 得到分享文章的标签情况
 * @param {Function} callback
 */
exports.queryShareCategorys = function(callback){
	var categorys = [];
	var shareCategorys;
	async.series([
		function(done){
			share.getCategorys(function(err,list){
				shareCategorys = list;
				done(err);
			});
		},
		function(done){
			async.eachSeries(shareCategorys,function(info,next){
				var articleInfo = info;
				categorys.push(articleInfo);
				next(null);
			},done);
		}
	],function(err){
		if(err){
			return callback(err);
		}
		return callback(null,categorys);
	});
}

/**
 * @description 得到自己的随机文章
 * @param {Number} total
 * @param {Function} callback
 */
exports.getArticleRandomTask = function(total,callback){
	var tasks = [],complateTasks = 0,result = [];;
	for(var i = 0; i < total; i++){
		var task = (function(){
			return function(){
				article.getArticleRandomOne(function(err,list){
					if(list){
						list.type ='article';
						if(!result['article'+list.id]){
							result['article'+list.id] = list;
						}
						checkIsComplete();
					}
				});
			}
		})();
		tasks.push(task);
	}
	for(task in tasks){
		tasks[task]();
	}
	function checkIsComplete(){
		complateTasks ++;
		if(complateTasks == tasks.length){
			callback(result);
		}
	}
}

/**
 * @description 得到分享的随机文章
 * @param {Number} total
 * @param {Function} callback
 */
exports.getShareRandomTask = function(total,callback){
	var tasks = [],complateTasks = 0,result = [];;
	for(var i = 0; i < total; i++){
		var task = (function(){
			return function(){
				share.getArticleRandomOne(function(err,list){
					if(list){
						list.type ='share';
						if(!result['share'+list.id]){
							result['share'+list.id] = list;
						}
						checkIsComplete();
					}
				});
			}
		})();
		tasks.push(task);
	}
	for(task in tasks){
		tasks[task]();
	}
	function checkIsComplete(){
		complateTasks ++;
		if(complateTasks == tasks.length){
			callback(result);
		}
	}
}
/**
 * @description 获取随机推荐的文章
 * @param {Number} total
 * @param {Function} callback
 */
exports.queryRandomArticle = function(total,callback){
	var articleTotal = 0,shareTotal = 0;
	var result = [];
	while(articleTotal ==0 || shareTotal == 0){
		articleTotal = Math.ceil(Math.random() * total);
		shareTotal = total - articleTotal;
	}
	async.series([
		function(done){
			article.getArticleRandomList(articleTotal,function(err,list){
				if(err){
					return done(err);
				}else{
					for(info in list){
						list[info].type = "article";
						result.push(list[info]);
					}
					done();
				}
			});
		},
		function(done){
			share.getArticleRandomList(shareTotal,function(err,list){
				if(err){
					return done(err);
				}else{
					for(info in list){
						list[info].type = "share";
						result.push(list[info]);
					}
					done();
				}
			});
		}
	],function(err){
		if(err){
			return callback(err);
		}
		return callback(null,result);
	});
	
}

exports.categorypage = function(fn,perpage){
	perpage = perpage || 10;
	return function(req,res,next){
		var category = req.params.type;
		var page = Math.max(parseInt(req.param('page') || '1',10),1)-1;
		fn(category,function(err,total){
			if(err){
				return next(err);
			}
			req.page = res.locals.page = {
				number:page,
				narrow:5,
				perpage:perpage,
				from:page * perpage,
				to:page * perpage+perpage,
				total:total,
				count:Math.ceil(total/perpage)
			};
			next();
		})
	}
};

exports.searchpage = function(fn,perpage){
	perpage = perpage || 10;
	return function(req,res,next){
		var searchkey = req.param('key') || '';
		var page = Math.max(parseInt(req.param('page') || '1',10),1)-1;
		fn(searchkey,function(err,total){
			if(err){
				return next(err);
			}
			req.page = res.locals.page = {
				number:page,
				narrow:5,
				perpage:perpage,
				from:page * perpage,
				to:page * perpage+perpage,
				total:total,
				count:Math.ceil(total/perpage)
			};
			next();
		})
	}
};

//exports.queryShareCategorys(function(err,list){
//	if(err){
//		return console.error(err);
//	}
//	console.log(list);
//})


//exports.queryTopArticle(5,function(err,list){
//	if(err){
//		return console.error(err);
//	}
//	list  = list.sort(function(){ return 0.5 - Math.random() });
//	for(info in list){
//		console.log(list[info].title);
//	}
//});
//article.getArticleRandomList(4,function(err,list){
//	if(err){
//		return console.error(err);
//	}
//	console.log(list);
//});
