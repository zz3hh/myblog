var express = require('express');
var config = require('../config');
var router = express.Router();
var routes = require('./router');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index',{
		title: config.siteData.name,
        siteData: config.siteData,
        articles : [],
        paging: '',
        isLogin: req.session.user ? true : false
	});
});

router.get('/about', function(req, res, next) {
	res.render('about',{
		title: '关于-'+config.siteData.name,
        siteData: config.siteData,
        isLogin: req.session.user ? true : false
	});
});

router.get('/archives',function(req,res,next){
	res.send('archives');
});

router.get('/share',function(req,res,next){
	res.render('index',{
		title: config.siteData.name+'文章分享',
        siteData: config.siteData,
        articles : [],
        paging: '',
        isLogin: req.session.user ? true : false
	});
});

router.get('/say',function(req,res,next){
	res.send('say');
});

router.get('/chat',function(req,res,next){
	 res.render('chat', {
        title: '简易聊天室'
    });
});

router.get('/lib',function(req,res,next){
	res.send('lbs');
});

router.get('/links',function(req,res,next){
	res.send('links');
});

router.get('/edit',function(req,res,next){
	res.render('edit',{
		title: config.siteData.name,
        siteData: config.siteData,
        articles : [],
        paging: '',
        isLogin: req.session.user ? true : false
	});
});

router.get('/admin',function(req,res,next){
	res.render('admin/login',{
		title: config.siteData.name,
        siteData: config.siteData,
        isLogin: req.session.admin ? true : false
	});
});

router.post('/admin/login',function(req,res,next){
	res.send(req.body);
});

router.get('/admin/install',function(req,res,next){
	res.render('install');
});

router.post('/admin/install',function(req,res,next){
	res.send(req.body);
});

router.get('/admin/updatepwd',function(req,res,next){
	res.render('admin/updatepwd',{
		title: config.siteData.name,
        siteData: config.siteData,
        isLogin: req.session.admin ? true : false
	});
});

router.post('/admin/updatepwd',function(req,res,next){
	res.send(req.body);
});

router.get('/show',function(req,res,next){
	res.render('editshow',{
		title: config.siteData.name,
        siteData: config.siteData,
        articles : [],
        paging: '',
        isLogin: req.session.user ? true : false
	});
});


router.get('/admin',function(req,res){
	res.render('admin/ad_fileEdit', {
        title: '管理文件',
        dir: {
            root: config.appRoot,
            tpldir: config.appRoot+'/'+config.staticPath
        }
    });
});

module.exports = router;
