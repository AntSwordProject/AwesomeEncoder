/**
 * jsp::zlib_deflated_class 编码器
 * zlib 压缩 字节码之后, 转 base64
 * 
 * Shell Script: https://github.com/AntSwordProject/AwesomeScript/blob/master/jsp/jsp_defineclass_zlib_deflated_script.jsp
 */

'use strict';

var zlib = require('zlib');
/*
* @param  {String} pwd   连接密码
* @param  {Array}  data  编码器处理前的 payload 数组
* @return {Array}  data  编码器处理后的 payload 数组
*/
module.exports = (pwd, data) => {
  let compressed = zlib.deflateSync(Buffer.from(data['_'], 'base64'), {
    level: 9, // 0~9
    memLevel:5
  })
  data[pwd] = compressed.toString('base64');
  delete data['_'];
  return data;
}
