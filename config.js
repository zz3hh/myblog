/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.07.22 08:48
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @copyUrl https://github.com/Shaman05/node-blog/
 * @target 主网站的配置数据
 */

var tpl = 'ejs';

module.exports = {
    appRoot: __dirname,
    staticPath: 'public',
    viewEngine: tpl,
    viewsDir: __dirname + '/views/' + tpl + '_tpl',
    port: 5000,
    dbSettings: {
        cookieSecret: 'node-blog',
        cookieExpires: new Date(Date.now() + 2 * 60 * 60),
        "host": "localhost",
        "database": "myblog",
        "user": "root",
        "password": ""
    },
    siteData: {
        name: '前端白小白-个人博客',
        shortname: '前端白小白',
        domain: 'www.baiyatao.com',
        author: '白亚涛',
        email: 'flytosky1991@126.com',
        qq: '879974693',
        sessionSecret: "keyboard cat",
        description: '前端白小白-个人博客'
    },
    duoshuo:"自己申请的duoshuo的二级域名",
    pageSize: 10,
    admin: {
        username: 'xiaobai',
        password: "xiaobai"
    }
};
