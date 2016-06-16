/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.08.04 15:30
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @target 网站分页中间件
 */

module.exports = function(fn,perpage){
	perpage = perpage || 10;
	return function(req,res,next){
		var page = Math.max(parseInt(req.param('page') || '1',10),1)-1;
		fn(function(err,total){
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
