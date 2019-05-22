/**
 * php::aes-256-cfb (zeroPadding) 解码器
 * Create at: 2019/05/12 15:43:55
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
  let buff = Buffer.alloc(32, 'a');
  buff.write(keyStr,0);
  keyStr = buff.toString();
  let decodetext = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(keyStr), {
    iv: CryptoJS.enc.Utf8.parse(keyStr),
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.ZeroPadding
  }).toString(CryptoJS.enc.Utf8);
  return decodetext;
}

function encryptText(keyStr, text) {
  let buff = Buffer.alloc(32, 'a');
  buff.write(keyStr,0);
  keyStr = buff.toString();
  let encodetext = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(keyStr), {
    iv: CryptoJS.enc.Utf8.parse(keyStr),
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString();
  return encodetext;
}

module.exports = {
  /**
   * @returns {string} asenc 将返回数据base64编码
   * 自定义输出函数名称必须为 asenc
   * 该函数使用的语法需要和shell保持一致
   */
  asoutput: () => {
    return `function asenc($out){
      $key=substr(str_pad(session_id(),32,'a'),0,32);
      $iv=$key;
      return @base64_encode(openssl_encrypt(base64_encode($out), "AES-256-CFB", $key,OPENSSL_RAW_DATA|OPENSSL_ZERO_PADDING, $iv));
    }
    `.replace(/\n\s+/g, '');
  },
  /**
   * 解码字符串
   * @param {string} data 要被解码的字符串
   * @returns {string} 解码后的字符串
   */
  decode_str: (data, ext={}) => {
    if(data.length === 0) {
      return data;
    }
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
    let ret = decryptText(keyStr, data);
    return Buffer.from(ret, 'base64').toString();
  },
  /**
   * 解码 Buffer
   * @param {string} data 要被解码的 Buffer
   * @returns {string} 解码后的 Buffer
   */
  decode_buff: (data, ext={}) => {
    if(data.length === 0) {
      return data;
    }
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
    return Buffer.from(decryptText(keyStr, Buffer.from(data).toString()), 'base64');
  }
}