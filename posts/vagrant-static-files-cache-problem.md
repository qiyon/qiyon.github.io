# Vagrant下共享目录静态文件(js/jpg/png等)“缓存”问题
太万恶了。解决方法如下，以ubuntu为例。

##nginx
`/etc/nginx/nginx.conf`文件：
```
#修改
sendfile on;
#为
sendfile off;
```

## apache
找到配置文件，修改为：
```
EnableSendfile off
```

## 相关参考
[http://blog.smdcn.net/article/1325.html](http://blog.smdcn.net/article/1325.html)

[https://github.com/mitchellh/vagrant/issues/351#issuecomment-1339640](https://github.com/mitchellh/vagrant/issues/351#issuecomment-1339640)

[http://stackoverflow.com/questions/9479117/vagrant-virtualbox-apache2-strange-cache-behaviour](http://stackoverflow.com/questions/9479117/vagrant-virtualbox-apache2-strange-cache-behaviour)

## 问题的原因
搜索了一下，`sendfile`配置是让操作系统直接将文件发送，而不经过web服务器，按道理说操作系统都支持的，所以一切都应该很美好。。。

但是，vmbox的文件共享，对于这个功能的支持。。。。。。导致了这个问题的产生。。