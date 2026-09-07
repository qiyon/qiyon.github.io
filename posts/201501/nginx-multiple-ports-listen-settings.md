---
title: nginx多端口
publishedAt: 2015-01-13T23:06:57+08:00
tags:
  - nginx
  - port
draft: false
---

`nginx.conf`文件：
```
http {
    #......

    server {
        #......
    }

    server{
        #.......
    }

    #......
}
```
每个server可以设置不同的端口信息，主要修改一下三行：
```
server{
    #端口和server（域名）设置
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;
    
    root /path/to/htmldir;
    #......
}
```
