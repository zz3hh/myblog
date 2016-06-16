var fs= require('fs');
var path = require('path');

/**
 * @description 获取具体的信息并输出文件
 * @param {Object} filename
 * @param {Object} filecontent
 */
exports.debugFile = function(filename,filecontent){
	fs.writeFile(path.join(__dirname, filename), filecontent, function (err) {
        if (err) throw err;
    });
}
