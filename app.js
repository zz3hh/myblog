var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compression = require('compression');
var config = require('./config');
var seoConfig = require('./seo');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', config.viewsDir);
app.set('view engine', config.viewEngine);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
// 打印在控制台上的客户端访问路径及返回的状态
//app.use(logger('dev'));
app.use(compression());
app.use(bodyParser({
    uploadDir: './public/KE/attached' //富文本上传目录
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: config.siteData.sessionSecret,
	resave: false,
	saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//var err = new Error('Not Found');
//err.status = 404;
//next(err);
//});

app.use(function(req, res) {
res.status(404).format({
	html:function(){
		res.render('404',{
			title: config.siteData.name,
			siteData: config.siteData,
			toplist:[],
			searchkey:"",
			links:'index',
			seo:seoConfig.Nofind,
			userInfo:req.session.user
		});
	},
	json:function(){
		res.send({
			message:'Resouce not found'
		});
	},
	xml:function(){
		res.write('<error>\n');
		res.write('<message>Resouce not found</message>\n');
		res.end('</error>');
	},
	text:function(){
		res.send('Resouce not found\n');
	}
});
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: err
//  });
//});
//}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//res.status(err.status || 500);
//res.render('error', {
//  message: err.message,
//  error: {}
//});
//});

app.use(function(err,req,res,next){
	var message;
	switch (err.type){
		case 'database':
			message = 'Server Unavailable';
			res.statusCode = 503;
			break;
		default:
			message = 'Internal Server Error';
			res.statusCode = 500;
			break;
	}
	
	res.format({
		html:function(){
			res.render('500',{
				message:message,
				status:res.statusCode,
				title: config.siteData.name,
				siteData: config.siteData,
				toplist:[],
				searchkey:"",
				links:'index',
				seo:seoConfig.Error,
				userInfo:req.session.user
			});
		},
		json:function(){
			res.send({error:message});
		},
		xml:function(){
	  		res.write('<error>\n');
	  		res.write('<message>'+message+'</message>\n');
	  		res.end('</error>');
	  	},
		text:function(){
			res.send(message+'\n');
		}
	});
});

module.exports = app;
