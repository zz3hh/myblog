前端白小白 个人博客
=

[![node version][node-image]][node-url]

[node-image]: https://img.shields.io/badge/node.js-%3E=_0.12-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

## 介绍

前端白小白网站 是使用 **Node.js** 和 **Mysql** 、**Express**开发的个人博客，界面优雅，功能略少，小巧迅速，
部署在前端白小白 [http://www.baiyatao.com](http://www.baiyatao.com)。

本来想着不公开代码的，但是为了传播知识并希望大家共同进步，所以就把代码共享了，你完全可以用它搭建自己的博客。

此代码是我2015年写的，没有持续更新了，已经一年多了才拿出来共享，主要是怕误人子弟，目前再重构一套代码，采用MongoDB+Redis,
代码可以扩展成在自己项目中使用。

呵呵，主要是来骗星星了！

目录结构
-------

- public 客户端资源
- controllers 控制器
- models 数据模型（数据结构定义）
- routes 服务器端路由
- read 工具类 主要是网站博客数据爬虫，和多说评论插件数据获取
- view 服务器端视图文件 

## 安装部署

*不保证 Windows 系统的兼容性*


```
1. 安装 `Node.js[必须]` `Mysql[必须]`
2. 启动 Mysql
3. `$ npm install` 安装项目的依赖包
4. `cp config.js` 请根据需要修改配置文件，并执行`node setup`,请认查看config
5. `$ npm start` 确保静态脚步和样式压缩
6. visit `http://localhost:3000`
7. done!
```

## 参考项目
- [Node-blog](http://github.com/Shaman05/node-blog) 


## 贡献
这个项目可以个人使用修改，但是请不要进行售卖和添加恶意代码等行为。至于留链接什么的，就不奢望了。

有任何意见或建议都欢迎提 issue，或者直接提给 [@zz3hh](https://github.com/zz3hh)


## License

MIT

## 后记
博客数据爬虫代码中我只保留了爬csdn的文章方法，如果想要新增网站数据来源，请自己写方法，参照csdn方法。或者联系本人，在我网站上留言，或者直接QQ，邮件；