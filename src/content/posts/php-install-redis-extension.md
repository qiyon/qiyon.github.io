---
title: php安装redis扩展
publishedAt: 2014-08-19T16:03:07+08:00
tags:
  - php
  - extentsion
  - redis
draft: false
---

获取phpredis扩展[地址](https://github.com/nicolasff/phpredis)。解压。这里假设php安装地址为/usr/local/php5/，则phpize应该在/usr/local/php5/bin/phpize。加下来，cd进入phpredis目录：
```
/usr/local/php5/bin/phpize 
./configure  --with-php-config=/usr/local/php5/bin/php-config
make
make install   
```
make install 注意权限。

之后，找到php.ini文件，例子中为/usr/local/php5/lib/php.
添加extentsion。有些PHP，如某些yum安装的php，为动态加载扩展，不需要修改php.ini。
```
extension=redis.so
```
