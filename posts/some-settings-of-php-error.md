# PHP error设置
对于PHP在运行时是否报错误的设置，可以设置php.ini或者检测函数error_reporting()是否存在(详细查看[php.net](http://cn2.php.net/manual/zh/errorfunc.configuration.php))，设置报错的级别。在php.ini中：
```
; Default Value: E_ALL & ~E_NOTICE
; Development Value: E_ALL | E_STRICT
; Production Value: E_ALL & ~E_DEPRECATED
; http://php.net/error-reporting
error_reporting=E_ALL & ~E_DEPRECATED & ~E_STRICT
```
在php脚本中设置([php.net](http://cn2.php.net/manual/zh/function.error-reporting.php)):
```
// 关闭所有PHP错误报告
error_reporting(0);
```
在线上环境中，可以关闭掉所有的Web错误显示，将错误储存到Log文件中，可以在php.ini中设置
```
;开启error的log记录
log_errors=On
;log纪录文件位置，这个为xampp的php error_log设置
error_log="/opt/lamp/logs/php_error_log"
```
在php脚本中可以调用[error_log()](http://cn2.php.net/manual/zh/function.error-log.php)函数，记录log信息，下面为php手册Web中的一些示例：
```
<?php
// 如果无法连接到数据库，发送通知到服务器日志
if (!Ora_Logon($username, $password)) {
    error_log("Oracle database not available!", 0);
}

// 如果用尽了 FOO，通过邮件通知管理员
if (!($foo = allocate_new_foo())) {
    error_log("Big trouble, we're all out of FOOs!", 1,
               "operator@example.com");
}

// 调用 error_log() 的另一种方式:
error_log("You messed up!", 3, "/var/tmp/my-errors.log");
?>
```
