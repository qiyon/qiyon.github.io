#PHP7beta版编译安装笔记

安装环境以`centos6.6`为例，`Web`服务器采用`Nginx + PHP-FPM`的形式，以`php-src/`作为源代码文件夹。

之前也做过一些这方面的笔记，但总的来说不是很完整。


##依赖
- `autoconf` 用于生成自动配置程序
- `gcc` 用于编译
- `re2c` 一个基于c的正则表达解析器，用于php本身的词法分析
- `bison` 用于生成语法分析器程序
- `libxml2` `libxml2-devel`  XML和HTML的支持库的开发版
- `openssl` `openssl-devel` 用于php的openssl.so扩展的编译
- `libcurl-devel` 用于php的curl.so扩展的编译
- `gd-devel` 用于php的gd.so扩展的编译
- `gmp-devel` 用于php的gmp.so扩展的编译
- `libmcrypt-devel ` 用于php的mcrypt.so扩展的编译，yum的epel源
- `mhash-devel` 用于php的mhash.so扩展的编译，yum的epel源

`yum`安装：
```
yum install autoconf gcc re2c bison libxml2 libxml2-devel openssl openssl-devel libcurl-devel gd-devel gmp-devel libmcrypt-devel mhash-devel
``` 


##configure文件
通过`configure`文件进行编译配置，若`configure`文件不存在，通过`buildconf`程序生成。
```
./buildconf
```
`configure`文件用于生成`Makefile`文件，可以查看帮助得知配置项：
```
./configure --help
```
一些常用的配置说明如下，详情可查看[核心配置选项列表](http://php.net/manual/configure.about.php)：
```
--prefix                              安装前缀目录，其它相关路径依赖于此，默认[/usr/local]
--exec-prefix=EPREFIX                 执行文件前缀目录，其它相关路径依赖于此，默认[PREFIX]

--bindir=DIR                          用户执行文件(php等)安装目录，默认[EPREFIX/bin]
--sbindir=DIR                         管理员执行文件(如php-fpm)安装目录，默认[EPREFIX/sbin]
--libexecdir=DIR                      program executables [EPREFIX/libexec]
--sysconfdir=DIR                      系统配置文件目录，默认[PREFIX/etc]
--sharedstatedir=DIR                  modifiable architecture-independent data [PREFIX/com]
--localstatedir=DIR                   与本机相关的可变文件目录(如log，pid文件) 默认[PREFIX/var]
--libdir=DIR                          库文件目录，默认[EPREFIX/lib]

--with-config-file-path=PATH          php.ini文件位置目录 [PREFIX/lib]
--with-config-file-scan-dir=PATH      配置文件目录，其下的所有ini文件会被包含,可放置php扩展的配置文件，默认无

--with-apxs2=FILE                     apache的apxs程序位置，根据此程序，可编译apache2的module，并放到相应位置
--disable-cli                         禁止cli，有此项会强制不安装pear( --without-pear)

--enable-fpm                          安装php-fpm，程序执行位置为[SBINDIR]
--with-fpm-user=USER                  php-fpm worker的linux用户名. (默认: nobody)
--with-fpm-group=GRP                  php-fpm worker的linux group (默认: nobody)
--with-fpm-systemd                    激活systemd的相关整合程序文件

--with-openssl=DIR                    包含openssl支持，此DIR可不带(只需--with-openssl)(需要OpenSSL>=0.9.6)
--with-curl=DIR                       包含cURL支持，此DIR可不带
--enable-mbstring                     多字节字符串支持
--with-mcrypt=DIR                     包含mcrypt支持，用于加密，需要libmcrypt库，centos需要epel源
--with-gmp=DIR                        GNU MP 多重精度计算支持
--with-mhash=DIR                      安装mhash支持，centos6需要epel源，libmcrypt也需要依赖mhash
--with-gd=DIR                         gd图形处理支持，需要gd-devel
--enable-zip                          包含 Zip 读写支持

--enable-mysqlnd                      mysql native driver 支持
--with-pdo-mysql=DIR                  PDO MySQL支持，DIR 为MySQL 主文件夹路径。无值或mysqlnd为mysqlnd。
--with-mysqli=FILE                    MySQLi支持，FILE是到mysql_config的路径，
                                      没有值或者是mysqlnd，则为MySQL native driver
--with-pdo-pgsql=DIR                  PDO: PostgreSQL support.  DIR is the PostgreSQL base
                                      install directory or the path to pg_config
--without-pdo-sqlite=DIR              PDO: sqlite 3 support.  DIR is the sqlite base
                                      install directory BUNDLED
--with-pgsql=DIR                      Include PostgreSQL support.  DIR is the PostgreSQL
                                      base install directory or the path to pg_config

--disable-opcache                     禁用Zend OPcache支持，用于缓存php脚本解析的opcode，5.5版本后默认集成，
                                      5.4以前需要--enable-opcache声明编译
--with-snmp=DIR                       Include SNMP support

```
`configure`使用例子，可以根据自己的需求自行修改：
```
./configure --prefix=/opt/php7 --enable-fpm --with-openssl --with-curl --enable-mbstring  --with-mcrypt --with-mhash --with-gd --enable-zip --with-gmp    --enable-mysqlnd  --with-pdo-mysql --with-mysqli

```
通过`configure`配置可以生一些编译需要的数据，以及替换一些路径信息；还会检测依赖，可以根据提示自己安装所依赖的库。

##编译和安装
`configure`程序后，会生成相应的`Makefile`文件，此时可通过`make`命令编译`PHP`，编译所花的时间较长，请耐心等待：
```
make
```
编译完成后，若对编译有不满意，可以清理掉已编译的内容再重新编译：
```
make clean
```
将编译好的`PHP`安装到`configure`中配置的安装目录，执行下面的命令，可能需要安装目录的权限：
```
make install 
```
##配置
安装好后，对于上面的编译安装配置，可以找到`PHP`的安装目录`/opt/php7`，有`PHP`的执行文件路径为`/opt/php7/bin/php`，可查看版本信息:
```
[root@localhost ~]# /opt/php7/bin/php --version
PHP 7.0.0-dev (cli) (built: Aug  8 2015 08:28:48)
Copyright (c) 1997-2015 The PHP Group
Zend Engine v3.0.0-dev, Copyright (c) 1998-2015 Zend Technologies
```
可以创建一个链接文件方便`php`的执行，之后便可以直接使用`php`而无须全路径，（这里需root权限）：
```
ln -s /opt/php7/bin/php /usr/local/bin/php
```
可以通过`php --ini`命令查看`php.ini`所在位置，如下：
```
[root@localhost ~]# php --ini
Configuration File (php.ini) Path: /opt/php7/lib
Loaded Configuration File:         (none)
Scan for additional .ini files in: (none)
Additional .ini files parsed:      (none)
```
可以看到`php`要加载`php.ini`的路径为`/opt/php7/lib/php.ini`，而当前安装好`PHP`，这个`php.ini`文件是不存在的。

需要自己从源代码中复制过来，源代码下有`php.ini-development`和`php.ini-production`两个文件，分别代表开发版和生产环境版的`php.ini`配置文件，任选一个合适的复制，如：
```
cp ./php.ini-development /opt/php7/lib/php.ini
```
之后再执行`php --ini`可以看到，已加载了相应的配置文件：
```
[root@localhost ~]# php --ini
Configuration File (php.ini) Path: /opt/php7/lib
Loaded Configuration File:         /opt/php7/lib/php.ini
Scan for additional .ini files in: (none)
Additional .ini files parsed:      (none)
```
##php-fpm服务操作
`php-fpm`是一个`PHP`的`fastcgi`管理和分发程序，运行时作为一个服务进程(`daemon`)运行，监听一个端口或者`unix socket`。

使用`configure`程序生成编译配置项时，也会生成一个`php-fpm`的服务操作`shell`脚本，位置为`php-src/sapi/fpm/init.d.php-fpm`，可以将其拷贝出来，加上执行权限，如下：
```
cp ./sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
chmod +x /etc/init.d/php-fpm
```
由于`/etc/init.d/`的脚本可以直接通过`service`进行启动和关闭程序，可以有以下两种方式管理`php-fpm`进程:
```
#直接shell执行
/etc/init.d/php-fpm status
/etc/init.d/php-fpm start
/etc/init.d/php-fpm stop
/etc/init.d/php-fpm restart

#通过service
service php-fpm status
service php-fpm start
service php-fpm stop
service php-fpm restart
```
当然现在执行，会提示找不到相应的`php-fpm`配置文件，这个也需要自己复制：
```
cp /opt/php7/etc/php-fpm.conf.default /opt/php7/etc/php-fpm.conf
cp /opt/php7/etc/php-fpm.d/www.conf.default /opt/php7/etc/php-fpm.d/www.conf
```
`php-fpm.conf`和`www.conf`是`php-fpm`自带的两个默认配置，可以根据需求自行修改。

实际上仔细查看`/etc/init.d/php-fpm`的脚本内容，可以看到管理`php-fpm`最根本的操作实际上是：
```
#启动 --fpm-config选择配置文件 --pid储存pid的文件位置
/opt/php7/sbin/php-fpm --daemonize --fpm-config /opt/php7/etc/php-fpm.conf --pid /opt/php7/var/run/php-fpm.pid

#关闭
kill -QUIT `cat /opt/php7/var/run/php-fpm.pid`
```
`php-fpm`启动时还有一些别的参数设置，详情可以通过`/opt/php7/sbin/php-fpm --help`查看

##开启opcache
`opcache`随着`PHP`已经编译，但默认的`php.ini`配置中并没有包含，开启`opcache`只需要在`php.ini`中添加：
```
zend_extension=opcache.so
```
相关的还有一些`ini`配置，详情查看[php.net >> opcache.configuration](http://php.net/manual/opcache.configuration.php)

一个推荐的配置(from [风雪之隅](http://www.laruence.com/2013/11/11/2928.html))：
```
opcache.enable_cli=1
opcache.memory_consumption=128      //共享内存大小, 这个根据你们的需求可调
opcache.interned_strings_buffer=8   //interned string的内存大小, 也可调
opcache.max_accelerated_files=4000  //最大缓存的文件数目
opcache.revalidate_freq=60          //60s检查一次文件更新
opcache.fast_shutdown=1             //打开快速关闭, 打开这个在PHP Request Shutdown的时候
                                    //    会收内存的速度会提高
opcache.save_comments=0             //不保存文件/函数的注释
```