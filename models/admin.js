/*
 * @Name: 个人博客 v0.0.1
 * @Date: 2015.07.26 15:30
 * @Author: 白亚涛
 * @Email:flytosky1991@126.com
 * @QQ:879974693
 * @target 管理者的数据操作model
 */
var db = require('./db').db;
var crypto = require('crypto');

function Admin(admin){
	this.user = admin.user;
	this.password = admin.password;
}

Admin.install = function(user,callback){
	var md5 = crypto.createHash('md5');
    var pwd =  md5.update(user.password).digest('base64');
    db.query('insert into `user`(`name`,`password`) values (?,?)',[user.username,pwd],function(err,info){
		if(err){
			return callback(err);
		}
		return callback(null);
	});
}

Admin.login = function(user,callback){
	var resJson = {
            state: 'failed'
        };
	if(!user.username){
    	resJson.message = '管理员用户名为空';
    	return callback(resJson);
    }
    if(!user.password){
    	resJson.message = '密码不能为空';
    	return callback(resJson);
    }
	var md5 = crypto.createHash('md5');
    var pwd =  md5.update(user.password).digest('base64');
    db.query('select * from `user` where `name` = ? limit 1',[user.username],function(err,data){
    	if(err){
            resJson.message = err;
        }else{
            if(data.length==0){
                resJson.message = '用户名不存在';
            }else{
                if(pwd != data[0].password){
                    resJson.message = '密码错误';
                }else{
                    resJson.state = 'success';
                    resJson.message = '登录成功';
                }
            }
        }
        callback(resJson);
    });
}

Admin.update = function(user,callback){
	var md5 = crypto.createHash('md5');
    var pwd =  md5.update(user.password).digest('base64');
    var repwd = md5.update(user.repassword).digest('base64');
    var resJson = {
        state: 'failed'
    };
    if(!user.username){
    	resJson.message = '管理员用户名为空';
    	return callback(resJson);
    }
    if(!user.password){
    	resJson.message = '旧密码不能为空';
    	return callback(resJson);
    }
    if(!user.repassword){
    	resJson.message = '新密码不能为空';
    	return callback(resJson);
    }
    
    db.query('select * from `user` where `name` = ? and `password` = ? limit 1',[user.username,pwd],function(err,data){
    	if(err){
            resJson.message = err;
            return callback(resJson);
        }else{
            if(data.length==0){
                resJson.message = '用户名不存在';
                return callback(resJson);
            }else{
                if(pwd != data[0].password){
                    resJson.message = '旧密码错误';
                    return callback(resJson);
                }
                if(repwd == data[0].password){
                	resJson.message = '新旧密码相同';
                    return callback(resJson);
                }
                db.query('update `user` set `password` = ? where `name` = ?',[repwd,user.username],function(err,info){
					if(err){
						resJson.message = err;
            			return callback(resJson);
					}
					resJson.state = 'success';
                    resJson.message = '修改密码成功';
                    return callback(resJson);
				});
            }
        }
    });
}
/**
 * @description 保存后台管理者的信息
 * @param {Object} callback
 */
Admin.prototype.save = function(callback){
	var admin = {
		user:this.user,
		password:this.password
	};
	db.query('insert into `user`(`name`,`password`) values (?,?)',[admin.user,admin.password],function(err,info){
		if(err){
			return callback(err);
		}
		return callback(null);
	});
}

/**
 * @description 更新后台管理者的密码
 * @param {Object} callback
 */
Admin.prototype.update = function(callback){
	var admin = {
		user:this.user,
		password:this.password
	};
	
	db.query('update `user` set `password` = ? where `name` = ?',[admin.password,admin.user],function(err,info){
		if(err){
			return callback(err);
		}
		return callback(info);
	});
}

/**
 * @description 得到后台管理者的登录信息
 * @param {Object} callback
 */
Admin.prototype.get= function(callback){
	var admin = {
		user:this.user,
		password:this.password
	};
	
	db.query('select * from `user` where `name` = ?',[admin.user],function(err,info){
		if(err){
			return callback(err);
		}
		return callback(info);
	});
	
};

/**
 * @description 得到后台管理者的名称
 * @param {Object} callback
 */
Admin.prototype.getName = function(callback){
	db.query('select * from `user`',[admin.user],function(err,info){
		if(err){
			return callback(err);
		}
		return callback(info[0]);
	});
};

module.exports = Admin;
