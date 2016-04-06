###PHP编译安装
官网下载php源码包。如 php-5.5.15.tar.gz 。然后tar -xvzf 解压，cd进入到解压后的目录中。接下来开始进行编译配置，./configure 后面会跟许多的配置选择。详细的配置选项查看[核心配置选项列表](http://php.net/manual/zh/configure.about.php)。
```
./configure --prefix=/usr/local/php5
```
下列为常见的一些配置选项：
```
--prefix=/usr/local/php5   //安装位置
--with-openssl   //openssl
--enable-fpm     //php-fpm  fast-cgi
--with-mcrypt=/usr/local/lib    //用于加密的库 ，需要自己安装libmcrypt 
--enable-pdo   //PDO
--with-pdo-mysql   //PDO mysql 
--with-mysql=mysqlnd  //mysql native driver
--with-curl        //curl
```
进入php源码包  cp php.ini 文件到/usr/local/php5/lib/，注意权限
```
cp ./php.ini-development /usr/local/php5/lib/php.ini
```