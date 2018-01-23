# PHP之url常用函数
## urlencode
将字符串编码成在url中传输的字符串，会将某些特殊符号转义。
```php
<?php
$myStr = " <>;'\"=&|[][]这是一段字符串..nomal";
echo urlencode($myStr);
//+%3C%3E%3B%27%22%3D%26%7C%5B%5D%5B%5D%E8%BF%99%E6%98%AF%E4%B8%80%E6%AE%B5%E5%AD%97%E7%AC%A6%E4%B8%B2..nomal
```
## urldecode
将经过urlencode编码的字符串转义回编码之前。
```php
$realStr = urldecode($encodeStr);
```
## http_build_query
将数组转化为http请求的形式。参照[php.net](http://php.net/manual/en/function.http-build-query.php)
```php
<?php
$data = array('foo'=>'bar',
              'baz'=>'boom',
              'cow'=>'milk',
              'php'=>'hypertext processor'
);
echo http_build_query($data);
//foo=bar&baz=boom&cow=milk&php=hypertext+processor
```