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
var admin = require('../models/admin');
var blog = require('../read/blog');
var config = require('../config');

exports.checkLogin = function(req,res,next){
	if(!req.session.admin){
		return res.redirect('/admin/login');
	}
	next();
}

exports.getLogin = function(req,res){
	res.render('admin/login',{
		title: config.siteData.shortname + '_管理员登陆页面',
        siteData: config.siteData,
		links:'index'
	});	
}
exports.postLogin = function(req,res){
	var user = {
		username:req.body.username,
		password:req.body.userpwd
	};
	
	admin.login(user,function(resJson){
		if(resJson.state == 'success'){
            //写入session
            req.session.admin = req.body.username;
            return res.json(resJson);
        }
        return res.json(resJson);
	});
}

exports.getUpdatePassword = function(req,res){
	res.render('admin/updatepwd',{
		title: config.siteData.shortname + '_管理员修改登录密码',
        siteData: config.siteData,
		links:'index'
	});	
}

exports.postUpPassword = function(req,res){
	var user = {
		username:req.body.username,
		password:req.body.userpwd,
		repassword:req.body.repassword
	};
	
	admin.update(user,function(resJson){
		if(resJson.state == 'success'){
            //写入session
            req.session.admin = req.body.username;
            return res.json(resJson);
        }
        return res.json(resJson);
	});
}
exports.logout = function(req, res, next){
    req.session.admin = null;
    return res.redirect('/');
};

exports.getArticle = function(req,res){
	article.getAllArticle(function(err,list){
		if(err){
			res.render('500',{
				message:'数据库内部出现问题',
				status:503,
				title: config.siteData.name,
				siteData: config.siteData,
				links:'index',
				userInfo:req.session.user
			});
		}else{
			res.render('admin/article',{
				title: config.siteData.shortname + '_个人博客文章管理',
				siteData: config.siteData,
				links:'article',
				articles : list,
				userInfo:req.session.user
			});
		}
	});
}

exports.getAjaxArticle = function(req,res){
	var articleId = req.params.id;
	article.getArticleById(articleId,function(err,info){
		if(err){
			res.send({
				code:1,
				errorMessage:"服务器内部出现错误！"
			})
		}else{
			res.send({
				code:0,
				data:{
					headintro:info[0].headintro,
					content:info[0].content
				}
			});
		}
	});
}

exports.getAjaxShare = function(req,res){
	var articleId = req.params.id;
	share.getArticleById(articleId,function(err,info){
		if(err){
			res.send({
				code:1,
				errorMessage:"服务器内部出现错误！"
			})
		}else{
			res.send({
				code:0,
				data:{
					headintro:info[0].headintro,
					content:info[0].content
				}
			});
		}
	});
}

exports.getAddArticle = function(req,res){
	res.render('admin/add_article',{
		title: config.siteData.shortname + '_新增文章',
        siteData: config.siteData,
		links:'article'
	});	
}

exports.postAddArticle = function(req,res){
	var newatl = new article({
		author : config.siteData.shortname,
		title : req.body.name,
		readtime : 1,
		headintro:req.body.headintro,
		headimg:req.body.headimg,
		content : req.body.content,
		category : req.body.category
	});
	
	newatl.save(function(err,info){
		if(err){
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{id:info.insertId},info:"新增博客成功"});
		}		
	});
}

exports.getEditArticle = function(req,res){
	var articleId = req.params.id;
	
	article.getArticleById(articleId,function(err,info){
		if(err){
			res.send('404');
		}else{
			res.render('admin/edit_article',{
				title: info[0].title+"_文章修改",
				siteData: config.siteData,
				links:'article',
				article : info[0]
			});
		}
	});
}

exports.postEditArticle = function(req,res){
	var newatl = new article({
		id:req.body.id,
		author : config.siteData.shortname,
		title : req.body.name,
		readtime : 1,
		headintro:req.body.headintro,
		headimg:req.body.headimg,
		content : req.body.content,
		category : req.body.category
	});
	
	newatl.save(function(err,info){
		if(err){
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{id:newatl.id},info:"修改博客成功"});
		}		
	});
}

exports.deleteArticle = function(req,res){
	var articleId = req.body.id;
	article.deleteArticleById(articleId,function(err){
		if(err){
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{},info:"删除文章成功"});
		}
	});
}

exports.getShare = function(req,res){
	share.getAllArticle(function(err,list){
		if(err){
			res.render('500',{
				message:'数据库内部出现问题',
				status:503,
				title: config.siteData.name,
				siteData: config.siteData,
				links:'index',
				userInfo:req.session.user
			});
		}else{
			res.render('admin/share',{
				title: config.siteData.shortname + '_网站文章分享管理',
				siteData: config.siteData,
				links:'share',
				articles : list,
				userInfo:req.session.user
			});
		}
	});
}

exports.getShareQuery = function(req,res){
	res.send(req.body);
}

exports.getAdddShare = function(req,res){
	res.render('admin/addshare',{
		title: config.siteData.shortname + '_网站文章分享管理',
        siteData: config.siteData,
		links:'share'
	});	
}

exports.getOutArticle = function(req,res){
	var url = req.query.url;
	blog.readNetBlog(url,function(err,info){
		if(err){
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{obj:info},info:"获取博客成功"});
		}	
	});
}
exports.postAddShare = function(req,res){
	var shareArticle = new share({
		author : req.body.author,
		title : req.body.title,
		readtime : 1,
		url:req.body.url,
		headintro:req.body.headintro,
		headimg:req.body.headimg,
		content : req.body.content,
		category : req.body.category
	});
	
	shareArticle.save(function(err,info){
		if(err){
			console.log(err);
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{id:info.insertId},info:"新增博客成功"});
		}		
	});
}

exports.getEditShare = function(req,res){
	var articleId = req.params.id;
	
	share.getArticleById(articleId,function(err,info){
		if(err){
			res.send('404');
		}else{
			res.render('admin/edit_share',{
				title: info[0].title+"_分享文章修改",
				siteData: config.siteData,
				links:'share',
				article : info[0]
			});
		}
	});
}

exports.postEditShare = function(req,res){
	var newshare = new share({
		id:req.body.id,
		author : req.body.author,
		title : req.body.title,
		headintro:req.body.headintro,
		headimg:req.body.headimg,
		url:req.body.url,
		readtime : 1,
		content : req.body.content,
		category : req.body.category
	});
	
	newshare.save(function(err,info){
		if(err){
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{id:newshare.id},info:"修改博客成功"});
		}		
	});
}
exports.deleteShare = function(req,res){
	var articleId = req.body.id;
	share.deleteArticleById(articleId,function(err){
		if(err){
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{},info:"删除文章成功"});
		}
	});
}

exports.getLinks = function(req,res){
	links.getAllLinks(function(err,list){
		if(err){
			res.send('404');
		}else{
			res.render('admin/links',{
				title: config.siteData.name+'_的友链',
				siteData: config.siteData,
				links:'links',
				linkdata : list 
			});	
		}
	});
}

exports.getAddLinks = function(req,res){
	res.render('admin/addlinks',{
		title: config.siteData.shortname + '_网站链接新增',
        siteData: config.siteData,
		links:'links'
	});	
}

exports.postAddLinks = function(req,res){
	var link = new links({
		name:req.body.name,
		url:req.body.url,
		isInner:req.body.isInner,
		isExchange:req.body.isExchange,
		description:req.body.description
	});
	
	link.save(function(err,info){
		if(err){
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{id:info.id},info:"新增链接成功"});
		}
	});
}

exports.getEditLinks = function(req,res){
	var linkId = req.params.id;
	
	links.getLinkById(linkId,function(err,info){
		if(err){
			res.send('404');
		}else{
			res.render('admin/editlinks',{
				title: config.siteData.shortname + '_网站链接修改',
				siteData: config.siteData,
				links:'links',
				link:info
			});	
		}
	});	
}
exports.postEditLinks = function(req,res){	
	var link = new links({
		id:req.body.id,
		name:req.body.name,
		url:req.body.url,
		isInner:req.body.isInner,
		isExchange:req.body.isExchange,
		description:req.body.description
	});
	
	link.save(function(err,info){
		if(err){
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{id:info.id},info:"修改链接成功"});
		}
	});
}

exports.postDelLinks = function(req,res){	
	var linkId = req.body.id;
	links.deleteById(linkId,function(err){
		if(err){
			res.send({state:"500",data:{},info:"服务器内部错误"});
		}else{
			res.send({state:"200",data:{},info:"删除链接成功"});
		}
	});
}