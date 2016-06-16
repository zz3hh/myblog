/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.07.22 18:25
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @target 主网站的管理员路由分配
 */

var article = require('../models/article');
var share = require('../models/share');
var links = require('../models/links');
var query = require('../models/query');
var admin = require('../models/admin');
var pv = require('../models/pv');
var config = require('../config');
var seoConfig = require('../seo');
var duoshuo = require('../read/duoshuo');
var URL = require('url');

var cacheData = {
	topList:{
		data:{
			
		}
	},
	categoryList:{
		data:{
			
		}
	},
	acategoryList:{
		data:{
			
		}
	},
	scategoryList:{
		data:{
			
		}
	}
};

exports.index = function(req,res,next){
	pv.insert(function(){});
	query.queryTopArticle(5,function(err,list){
		if(err){
			res.render('500',{
				message:'数据出现错误',
				status:503,
				title: config.siteData.name,
				siteData: config.siteData,
				links:'index',
				searchkey:"",
				seo:seoConfig.Error,
				toplist:cacheData.topList.data.data || [],
				userInfo:req.session.user
			});
		}else{
			res.render('index',{
				title: config.siteData.name,
				siteData: config.siteData,
				links:'index',
				searchkey:"",
				articles : list,
				seo:seoConfig.home,
				toplist:cacheData.topList.data.data || [],
				categorylist:cacheData.categoryList.data.data || [],
				userInfo:req.session.user
			});
		}
	});
}

exports.login = function(req,res){
	var goURL = req.query.url;
	duoshuo.login(config.duoshuo,req.query.code,function(resjson){
		if(resjson.state=="failed"){
			return res.send('404');
		}
		var info = resjson.info;
		duoshuo.getUserInfo(info.user_id,function(result){
			if(result.state =='failed'){
				return res.send('404');
			}
			var loginInfo = result.info;
			if(loginInfo.code==0){
				req.session.user = loginInfo.response;
				return res.redirect(URL.parse(goURL).pathname || '/');
			}
			return res.send(loginInfo.errorMessage);
		});
	});
}

exports.userInfo = function(req,res){
	var user_id = req.body.user_id;
	if(user_id){
		duoshuo.getUserInfo(user_id,function(result){
			if(result.state=='failed'){
				return res.send({"status":"0",'data':[],"info":'网站内部错误'});
			}
			var loginInfo = result.info;
			if(loginInfo.code==0){
				req.session.user = loginInfo.response;
				return res.send({"status":"1",'data':loginInfo.response,"info":'自动登录成功'});
			}
			return res.send({"status":"0",'data':[],"info":loginInfo.errorMessage});
		});
	}else{
		res.send({"status":"0",'data':[],"info":'确实必要的参数'});
	}
}
exports.logout = function(req,res){
	var goURL = req.query.url || '';
	req.session.user = null;
	return res.redirect(URL.parse(goURL).pathname || '/');
}

exports.queryArticle = function(req,res){
	var key = req.query.key;
	if(key){
		var page = req.page;
		query.getQueryKeyPage(key,page.from,page.perpage,function(err,list){
			if(err){
				res.render('500',{
					message:'服务器内部出现错误信息',
					status:500,
					title: config.siteData.name,
					siteData: config.siteData,
					links:'index',
					searchkey:key,
					seo:seoConfig.Error,
					toplist:cacheData.topList.data.data || [],
					categorylist:cacheData.categoryList.data.data || [],
					userInfo:req.session.user
				});
			}
			page.number = page.number+1;
			res.render('query',{
				title: config.siteData.name,
				siteData: config.siteData,
				links:'index',
				articles : list,
				searchkey:key,
				paging:page,
				seo:seoConfig.home,
				toplist:cacheData.topList.data.data || [],
				categorylist:cacheData.categoryList.data.data || [],
				userInfo:req.session.user
			});
		});
	}else{
		return res.redirect('/');
	}
}

exports.showArticle = function(req,res){
	var articleId = req.params.id;
	if(parseInt(articleId)>0){
		article.getArticleById(articleId,function(err,info){
			if(err){
				res.render('500',{
					message:'数据出现错误',
					status:503,
					title: config.siteData.name,
					siteData: config.siteData,
					links:'self',
					searchkey:"",
					seo:seoConfig.Error,
					toplist:cacheData.topList.data.data || [],
					userInfo:req.session.user
				});
			}else{
				if(info.length){
					article.UpdateReadtime(articleId,function(){});
					console.log(info[0].headintro);
					res.render('article_show',{
						title: info[0].title,
						siteData: config.siteData,
						links:'self',
						article : info[0],
						searchkey:"",
						seo:{
							keywords:info[0].title,
							description:info[0].headintro
						},
						categorylist:cacheData.acategoryList.data.data || [],
						toplist:cacheData.topList.data.data || [],
						userInfo:req.session.user
					});
				}else{
					res.render('article404',{
			  			title: config.siteData.name,
						siteData: config.siteData,
						links:'self',
						article:[],
						searchkey:"",
						seo:seoConfig.NoArticle,
						categorylist:cacheData.acategoryList.data.data || [],
						toplist:cacheData.topList.data.data || [],
						userInfo:req.session.user
			  		});
				}
			}
		});
	}else{
		res.redirect('/self');
	}
}

exports.admin = function(req,res){
	var page = req.page;
	article.getArticlePage(page.from,page.perpage,function(err,list){
		if(err){
			res.render('500',{
				message:'数据出现错误',
				status:503,
				title: config.siteData.name,
				siteData: config.siteData,
				links:'self',
				searchkey:"",
				seo:seoConfig.Error,
				toplist:cacheData.topList.data.data || [],
				userInfo:req.session.user
			});
		}else{
			page.number = page.number+1;
			res.render('self',{
				title: config.siteData.name+'文章分享',
				siteData: config.siteData,
				links:'self',
				articles : list,
				paging:page,
				searchkey:"",
				seo:seoConfig.self,
				toplist:cacheData.topList.data.data || [],
				categorylist:cacheData.acategoryList.data.data || [],
				userInfo:req.session.user
			});	
		}
	});
}

exports.share = function(req,res){
	var page = req.page;
	share.getArticlePage(page.from,page.perpage,function(err,list){
		if(err){
			res.render('500',{
				message:'数据出现错误',
				status:503,
				title: config.siteData.name,
				siteData: config.siteData,
				toplist:cacheData.topList.data.data || [],
				links:'share',
				searchkey:"",
				seo:seoConfig.Error,
				userInfo:req.session.user
			});
		}else{
			page.number = page.number+1;
			res.render('share',{
				title: config.siteData.name+'文章分享',
				siteData: config.siteData,
				toplist:cacheData.topList.data.data || [],
				links:'share',
				searchkey:"",
				articles : list,
				seo:seoConfig.share,
				paging:page,
				categorylist:cacheData.scategoryList.data.data || [],
				userInfo:req.session.user
			});
		}			
	});
}

exports.showShare = function(req,res){
	var articleId = req.params.id;
	if(parseInt(articleId)>0){
		share.getArticleById(articleId,function(err,info){
			if(err){
				res.render('500',{
					message:'数据出现错误',
					status:503,
					title: config.siteData.name,
					siteData: config.siteData,
					toplist:cacheData.topList.data.data || [],
					links:'share',
					searchkey:"",
					seo:seoConfig.Error,
					userInfo:req.session.user
				});
			}else{
				if(info.length){
					share.UpdateReadtime(info[0].id,function(){});
					res.render('share_show',{
						title: info[0].title,
						siteData: config.siteData,
						toplist:cacheData.topList.data.data || [],
						categorylist:cacheData.scategoryList.data.data || [],
						links:'share',
						searchkey:"",
						seo:{
							keywords:info[0].title,
							headintro:info[0].headintro
						},
						article : info[0],
						userInfo:req.session.user
					});
				}else{
					res.render('article404',{
			  			title: config.siteData.name,
						siteData: config.siteData,
						categorylist:cacheData.scategoryList.data.data || [],
						toplist:cacheData.topList.data.data || [],
						links:'share',
						searchkey:"",
						article:[],
						seo:seoConfig.NoArticle,
						userInfo:req.session.user
			  		});
				}
			}
		});
	}else{
		res.redirect('/share');
	}
}

exports.getCategoryAll = function(req,res){
	var category = req.params.type;
	var page = req.page;
	if(category){
		query.getAllCategoryPage(category,page.from,page.perpage,function(err,list){
			if(err){
				res.render('500',{
					message:'数据出现错误',
					status:503,
					title: config.siteData.name,
					siteData: config.siteData,
					searchkey:"",
					toplist:cacheData.topList.data.data || [],
					links:'index',
					seo:seoConfig.Error,
					userInfo:req.session.user
				});
			}else{
				if(list.length){
					page.number = page.number+1;
					res.render('category',{
						title: config.siteData.name+'_所有文章_'+category+'分类下的文章',
						siteData: config.siteData,
						searchkey:"",
						toplist:cacheData.topList.data.data || [],
						categorylist:cacheData.categoryList.data.data || [],
						links:'index',
						articles : list,
						seo:{
							keywords:seoConfig.base+',文章分类,'+category,
							description:config.siteData.name+'_所有文章_'+category+'分类下的文章'
						},
						paging:page,
						userInfo:req.session.user
					});
				}else{
					res.render('category404',{
			  			title: config.siteData.name+'_所有文章_'+category+'分类下的文章',
						siteData: config.siteData,
						searchkey:"",
						categorylist:cacheData.categoryList.data.data || [],
						toplist:cacheData.topList.data.data || [],
						links:'index',
						articles:[],
						seo:seoConfig.NoCategory,
						userInfo:req.session.user
			  		});
				}
			}
		});
	}else{
		res.redirect('/');
	}
}

exports.getCategoryArticle = function(req,res){
	var category = req.params.type;
	var page = req.page;
	if(category){
		article.getCategoryPage(category,page.from,page.perpage,function(err,list){
			if(err){
				res.render('500',{
					message:'数据出现错误',
					status:503,
					title: config.siteData.name,
					siteData: config.siteData,
					searchkey:"",
					toplist:cacheData.topList.data.data || [],
					links:'self',
					seo:seoConfig.Error,
					userInfo:req.session.user
				});
			}else{
				if(list.length){
					page.number = page.number+1;
					res.render('category-article',{
						title: config.siteData.name+'_个人文章_'+category+'分类下的文章',
						siteData: config.siteData,
						searchkey:"",
						toplist:cacheData.topList.data.data || [],
						categorylist:cacheData.acategoryList.data.data || [],
						links:'self',
						paging:page,
						articles : list,
						seo:{
							keywords:seoConfig.base+',文章分类,'+category,
							description:config.siteData.name+'_所有文章_'+category+'分类下的文章'
						},
						userInfo:req.session.user
					});
				}else{
					res.render('category404',{
			  			title: config.siteData.name+'_个人文章_'+category+'分类下的文章',
						siteData: config.siteData,
						searchkey:"",
						categorylist:cacheData.acategoryList.data.data || [],
						toplist:cacheData.topList.data.data || [],
						links:'self',
						articles:[],
						seo:seoConfig.NoCategory,
						userInfo:req.session.user
			  		});
				}
			}
		});
	}else{
		res.redirect('/self');
	}
}

exports.getCategoryShare = function(req,res){
	var category = req.params.type;
	var page = req.page;
	if(category){
		share.getCategoryPage(category,page.from,page.perpage,function(err,list){
			if(err){
				res.render('500',{
					message:'数据出现错误',
					status:503,
					title: config.siteData.name,
					siteData: config.siteData,
					searchkey:"",
					toplist:cacheData.topList.data.data || [],
					links:'share',
					seo:seoConfig.Error,
					userInfo:req.session.user
				});
			}else{
				if(list.length){
					page.number = page.number+1;
					res.render('category-share',{
						title: config.siteData.name+'_文章分享_'+category+'分类下的文章',
						siteData: config.siteData,
						searchkey:"",
						toplist:cacheData.topList.data.data || [],
						categorylist:cacheData.scategoryList.data.data || [],
						links:'share',
						paging:page,
						seo:{
							keywords:seoConfig.base+',文章分类,'+category,
							description:config.siteData.name+'_所有分享文章_'+category+'分类下的文章'
						},
						articles:list,
						userInfo:req.session.user
					});
				}else{
					res.render('category404',{
			  			title: config.siteData.name+'_文章分享_'+category+'分类下的文章',
						siteData: config.siteData,
						searchkey:"",
						categorylist:cacheData.scategoryList.data.data || [],
						toplist:cacheData.topList.data.data || [],
						links:'share',
						articles:[],
						seo:seoConfig.NoCategory,
						userInfo:req.session.user
			  		});
				}
			}
		});
	}else{
		res.redirect('/share');
	}
}

exports.chat = function(req,res){
	var userInfo = req.session.user;
	var user = {};
	if(userInfo){
		user.id = userInfo.user_id;
		user.name = userInfo.name;
		user.url = userInfo.url;
		user.avatar_url = userInfo.avatar_url
	}
	res.render('chat', {
        title: config.siteData.name+'聊天室',
        siteData: config.siteData,
        toplist:cacheData.topList.data.data || [],
		links:'chat',
		searchkey:"",
		userInfo:userInfo,
		user:user,
		seo:seoConfig.chat
    });
}

exports.say = function(req,res){
	res.render('say',{
		title: config.siteData.name+'的留言',
        siteData: config.siteData,
        toplist:cacheData.topList.data.data || [],
		links:'say',
		searchkey:"",
		seo:seoConfig.say,
		userInfo:req.session.user
	});	
}


exports.links = function(req,res){
	links.getAllLinks(function(err,list){
		if(err){
			res.render('500',{
				message:'数据出现错误',
				status:503,
				title: config.siteData.name,
				siteData: config.siteData,
				toplist:cacheData.topList.data.data || [],
				links:'links',
				searchkey:"",
				seo:seoConfig.Error,
				userInfo:req.session.user
			});
		}else{
			res.render('links',{
				title: config.siteData.name+'_的友链',
				siteData: config.siteData,
				categorylist:cacheData.categoryList.data.data || [],
				toplist:cacheData.topList.data.data || [],
				links:'links',
				searchkey:"",
				linkdata : list ,
				seo:seoConfig.links,
				userInfo:req.session.user
			});	
		}
	});
}


exports.about = function(req,res){
	res.render('about',{
		title: config.siteData.name+'-关于',
        siteData: config.siteData,
        toplist:cacheData.topList.data.data || [],
		links:'about',
		searchkey:"",
		seo:seoConfig.about,
		userInfo:req.session.user
	});
}

exports.lab = function(req,res){
	res.render('lab',{
		title: config.siteData.name+'-往昔岁月',
        siteData: config.siteData,
        toplist:cacheData.topList.data.data || [],
		links:'lab',
		searchkey:"",
		seo:seoConfig.lab,
		userInfo:req.session.user
	});
}

exports.linksList = function(req,res,next){
	var page = req.page;
	links.getLinksPage(page.from,page.perpage,function(err,list){
		if(err){
			return res.send({"status":"0",'data':[],"info":'网站内部错误'});
		}else{
			if(list.length){
				if(page.number < (page.count-1)){
					return res.send({"status":"1",'data':list,"info":'获取数据成功',ishave:true,page:(page.number+2),pageinfo:page});
				}
				return res.send({"status":"1",'data':list,"info":'获取数据成功',ishave:false,page:page.count});
			}else{
				return res.send({"status":"1",'data':[],"info":'获取数据为空'});
			}
		}
	});
}

exports.getListTopThreads = function(req,res){
	var topList = cacheData.topList;
	if(new Date().valueOf() - (topList.time || 0) > 1000*60*60){
		duoshuo.listTopThreads(config.duoshuo,function(result){
			if(result.state=='failed'){
				topList.time = (new Date().valueOf() + 1000*60*55);
				topList.data = {"status":"0",'data':[],"info":result.message};
				return res.send(topList.data);
			}else{
				topList.time = new Date().valueOf();
				topList.data = {"status":"1",'data':result.articlelist,"info":'获取数据成功'};
				return res.send(topList.data);
			}
		});
	}else{
		return res.send(topList.data);
	}
}

exports.getRandomArticle = function(req,res){
	query.queryRandomArticle(5,function(err,list){
		if(err){
			return res.send({"status":"0",'data':[],"info":'获取数据失败'});
		}else{
			return res.send({"status":"1",'data':list,"info":'获取数据成功'});
		}
	});
}

exports.getCategoryList = function(req,res) {
	var categoryList = cacheData.categoryList;
	if(new Date().valueOf() - (categoryList.time || 0) > 1000*60*3){
		query.queryCategorys(function(err,list) {
			if(err){
				categoryList.time = (new Date().valueOf() + 1000*60*2);
				categoryList.data = {"status":"0",'data':[],"info":'获取数据失败'};
				return res.send(categoryList.data);
			}else{
				categoryList.time = new Date().valueOf();
				categoryList.data = {"status":"1",'data':list,"info":'获取数据成功'};
				return res.send(categoryList.data);
			}
		});
	}else{
		return res.send(categoryList.data);
	}
}

exports.getArticleCategoryList = function(req,res){
	var acategoryList = cacheData.acategoryList;
	if(new Date().valueOf() - (acategoryList.time || 0) > 1000*60*3){
		query.queryArticleCategorys(function(err,list) {
			if(err){
				acategoryList.time = (new Date().valueOf() + 1000*60*2);
				acategoryList.data = {"status":"0",'data':[],"info":'获取数据失败'};
				return res.send(acategoryList.data);
			}else{
				acategoryList.time = new Date().valueOf();
				acategoryList.data = {"status":"1",'data':list,"info":'获取数据成功'};
				return res.send(acategoryList.data);
			}
		});
	}else{
		return res.send(acategoryList.data);
	}
}

exports.getShareCategoryList = function(req,res){
	var scategoryList = cacheData.scategoryList;
	if(new Date().valueOf() - (scategoryList.time || 0) > 1000*60*3){
		query.queryShareCategorys(function(err,list) {
			if(err){
				scategoryList.time = (new Date().valueOf() + 1000*60*2);
				scategoryList.data = {"status":"0",'data':[],"info":'获取数据失败'};
				return res.send(scategoryList.data);
			}else{
				scategoryList.time = new Date().valueOf();
				scategoryList.data = {"status":"1",'data':list,"info":'获取数据成功'};
				return res.send(scategoryList.data);
			}
		});
	}else{
		return res.send(scategoryList.data);
	}
}
