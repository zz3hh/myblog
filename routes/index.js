/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.07.22 08:48
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @copyUrl https://github.com/Shaman05/node-blog/
 * @target 主网站的路由分配
 */

var user = require('./user');
var admin = require('./admin');
var links = require('../models/links');
var share = require('../models/share');
var query = require('../models/query');
var article = require('../models/article');
var page = require('../models/page');
var config = require('../config');

module.exports = function(app){
	
	// 展示给其他人看的路由
	app.get('/',user.index);
	app.post('/duoshuo',user.userInfo);
	app.get('/login',user.login);
	app.get('/logout',user.logout);
	app.get('/article/:id',user.showArticle);
	app.get('/self',page(article.getCount,config.pageSize),user.admin);
	app.get('/query',query.searchpage(query.getQueryKeyCount,config.pageSize),user.queryArticle);
	app.get('/share',page(share.getCount,config.pageSize),user.share);
	app.get('/share/:id',user.showShare);
	app.get('/chat',user.chat);
	app.get('/say',user.say);
	app.get('/links',user.links);
	app.get('/about',user.about);
	app.get('/lab',user.lab);
	app.get('/category/all/:type',query.categorypage(query.getAllCategoryCount,config.pageSize),user.getCategoryAll);
	app.get('/category/article/:type',query.categorypage(article.getCategoryCount,config.pageSize),user.getCategoryArticle);
	app.get('/category/share/:type',query.categorypage(share.getCategoryCount,config.pageSize),user.getCategoryShare);
	
	// admin 用户操作后台页面数据
	app.get('/admin/login',admin.getLogin);
	app.post('/admin/login',admin.postLogin);
	app.get('/admin/updatepwd',admin.getUpdatePassword);
	app.post('/admin/updatepwd',admin.postUpPassword);
	app.get('/admin/logout',admin.logout);
	app.get('/admin',admin.checkLogin);
	app.post('/admin',admin.checkLogin);
	app.get('/admin',admin.getArticle);
	app.get('/admin/article',admin.checkLogin);
	app.get('/admin/article',admin.getArticle);
	app.get('/admin/addarticle',admin.checkLogin);
	app.get('/admin/addarticle',admin.getAddArticle);
	app.post('/admin/addarticle',admin.postAddArticle);
	app.get('/admin/editarticle/:id',admin.checkLogin);
	app.get('/admin/editarticle/:id',admin.getEditArticle);
	app.post('/admin/editarticle',admin.postEditArticle);
	app.post('/admin/delarticle/:id',admin.deleteArticle);
	// admin 文章分享管理
	app.get('/admin/share',admin.checkLogin);
	app.get('/admin/share',admin.getShare);
	app.get('/admin/share',admin.checkLogin);
	app.get('/admin/share/query',admin.getShareQuery);
	app.get('/admin/getshare',admin.checkLogin);
	app.get('/admin/getshare',admin.getOutArticle);
	app.get('/admin/addshare',admin.checkLogin);
	app.get('/admin/addshare',admin.getAdddShare);
	app.post('/admin/addshare',admin.postAddShare);
	app.get('/admin/editshare/:id',admin.checkLogin);
	app.get('/admin/editshare/:id',admin.getEditShare);
	app.get('/edit/shareinfo/:id',admin.getAjaxShare);
	app.get('/edit/articleinfo/:id',admin.getAjaxArticle);
	
	
	app.post('/admin/editshare',admin.postEditShare);
	
	app.post('/admin/delshare',admin.deleteShare)
	
	// admin 友情链接管理操作
	app.get('/admin/links',admin.checkLogin);
	app.get('/admin/links',admin.getLinks);
	app.get('/admin/addlinks',admin.checkLogin);
	app.get('/admin/addlinks',admin.checkLogin);
	app.post('/admin/addlinks',admin.postAddLinks);
	app.get('/admin/editlinks/:id',admin.checkLogin);
	app.get('/admin/editlinks/:id',admin.getEditLinks);
	app.post('/admin/editlinks',admin.postEditLinks);
	app.post('/admin/dellinks',admin.postDelLinks);
	
	
	// Ajax 数据
	app.get('/ajax/hotblog',user.getListTopThreads);
	app.get('/ajax/category',user.getCategoryList);
	app.get('/ajax/acategory',user.getArticleCategoryList);
	app.get('/ajax/scategory',user.getShareCategoryList);
	app.get('/random/blog',user.getRandomArticle);
	// 网站提供对外的api
	app.get('/linkslist',page(links.getCount,config.pageSize),user.linksList);
}