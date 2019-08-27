/**
 * custom::aes_128_cfb_zero_padding 编码器
 * Create at: 2019/08/22 09:38:58

以 https://github.com/AntSwordProject/antSword/blob/v2.1.x/shells/jsp_custom_script_for_mysql.jsp 为例

配置如下:

String encoder = "aes"; // 编码器

String SessionKey = "CUSTOMSESSID"; // 自定义sessionkey id
String aes_mode = "CFB";            // EBC|ECB|CFB|
String aes_padding = "NoPadding";   // NoPadding|PKCS5Padding|PKCS7Padding
int aes_keylen = 16;                // 16|32  // 16(AES-128) 32(AES-256)
String aes_key_padding = "a";       // 获取到的 key 位数不够时填充字符
 */

'use strict';
const path = require('path');
var CryptoJS = require(path.join(window.antSword.remote.process.env.AS_WORKDIR, 'node_modules/crypto-js'));

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
  let buff = Buffer.alloc(16, 'a');
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
  let buff = Buffer.alloc(16, 'a');
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
  let headers = ext.opts.httpConf.headers;
  if(!headers.hasOwnProperty('Cookie')) {
    window.toastr.error("请先设置 Cookie (大小写敏感), 可通过浏览网站获取Cookie", "错误");
    return data;
  }
  let session_key = "CUSTOMSESSID";
  let keyStr = get_cookie(session_key, headers['Cookie']);
  if(keyStr.length === 0) {
    window.toastr.error("未在 Cookie 中发现CUSTOMSESSID", "错误");
    return data;
  }
  
  let ret = {};
  for (let _ in data) {
    if (_ === '_') {
      continue
    };
    
    ret[_] = encryptText(keyStr, data[_]);
  }
  ret[pwd] = data['_'];
  return ret;
}