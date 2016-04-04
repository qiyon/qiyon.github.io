#windows下php的https相关设置
以`php7`为例（假设安装目录为`D:\php7\`），安装完成后，再安装`composer`或者请求`https`的链接时，会请求失败。

解决方法如下：

##ini文件
复制安装目录下的`php.ini-development`或者`php.ini-production`为`php.ini`文件。

`php.ini-development`为开发环境的相关配置，`php.ini-production`为生产环境的配置文件。一般`windows`作为开发环境。

##下载cacert.pem
从[http://curl.haxx.se/ca/cacert.pem](http://curl.haxx.se/ca/cacert.pem)下载`cacert.pem`，保存在某个位置，如`D:\php7\cacert.pem`

##设置php.ini
###设置扩展位置
编辑`php.ini`文件，找到：
```
extension_dir
```
这个是扩展目录的选项，设置为：
```
extension_dir = "D:\php7\ext"
```

###打开扩展
接下来打开扩展，找到
```
;extension=php_curl.dll
```
以及
```
;extension=php_openssl.dll
```
去掉前面的`;`号，打开这两个扩展

###设置信任文件
最后设置`ca`信任文件，即设置为之前下载的`cacert.pem`文件的位置，找到：
`curl.cainfo`和`openssl.cafile`选项，设置为：
```
curl.cainfo = "D:\php7\cacert.pem"
```
和
```
openssl.cafile="D:\php7\cacert.pem"
```