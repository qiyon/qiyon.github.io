# PHP 5.4 Web Server
PHP从5.4 开始有自带的Web服务器，仅用于帮助开发和测试。

使用方法，cd到目录下，运行命令 -S ，指点端口号（localhost为本地访问，0.0.0.0:8080 为可远端访问）。如WebRoot目录为/var/www/html：
```
cd /var/www/html
php -S localhost:8080
```
或者直接指定Web根目录：
```
php -S localhost:8080 -t /var/www/html/
```
通过路由脚本控制Web服务器的响应，如下可实现仅访问图片：
```
//php 路由脚本  routes.php
<?php
if (preg_match('/\.(?:png|jpg|jpeg|gif)$/', $_SERVER["REQUEST_URI"])) {
    return false;    // serve the requested resource as-is.
} else { 
    echo "<p>Welcome to PHP</p>";
}
?>
-----------------------------
//终端执行代码
php -S localhost:8080 routes.php
```
一个重定向到index.php的路由脚本实例：
```
<?php
$request=parse_url(substr($_SERVER["REQUEST_URI"], 1))["path"];
if (is_file($request)) {
    return false;
}else{
    require 'index.php';
}

```
----------------------------------------------------------------------------------------------

Copy code from [php.net](http://php.net/manual/en/features.commandline.webserver.php)
```
<?php
// router.php

$route = parse_url(substr($_SERVER["REQUEST_URI"], 1))["path"];

if (is_file($route)) {
    if(substr($route, -4) == ".php"){
        require $route;         // Include requested script files
        exit;
    }
    return false;               // Serve file as is
} else {                        // Fallback to index.php
    $_GET["q"] = $route;        // Try to emulate the behaviour of your htaccess here, if needed
    require "index.php";
}
```




