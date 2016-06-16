var mysql = require('mysql');
var config = require('../config');
exports.db = mysql.createConnection({
	host : '127.0.0.1',
	port : 3306,
	database : config.dbSettings.database,
	user : config.dbSettings.user,
	password : config.dbSettings.password
});