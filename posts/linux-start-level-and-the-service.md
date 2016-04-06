#Linux启动级别与服务

##1. Linux的启动级别种类
如下：
```
#   0 - halt (Do NOT set initdefault to this)
#   1 - Single user mode
#   2 - Multiuser, without NFS (The same as 3, if you do not have networking)
#   3 - Full multiuser mode
#   4 - unused
#   5 - X11
#   6 - reboot (Do NOT set initdefault to this)
```
##2. 查看默认启动级别
```
cat /etc/inittab 
```
最后有`id:3:initdefault:`，表明默认的启动级别是`3`，即多用户模式

##3. 服务相关
Linux的服务位于`/etc/rc.d/init.d/`文件夹中，其中每个文件为一个脚本，包含`start`，`stop`等服务相关的操作。

且有`/etc/init.d/`文件夹是链接指向`/etc/rc.d/init.d/`的，所以一般也说服务启动脚本的位置为`/etc/init.d/`文件夹。

对于`/etc/init.d/`文件夹中的脚本，如`/etc/init.d/nginx`，服务相关操作，可以直接运行脚本，也可以使用`service nginx start`等命令来操作。如下：
```
/etc/init.d/nginx status
/etc/init.d/nginx start
/etc/init.d/nginx stop

service nginx status
service nginx start
service nginx stop
```

而对于`/etc/rc[0-6].d/`(即`/etc/rc0.d`，`/etc/rc1.d`，...，`/etc/rc6.d`七个文件夹)有链接关系
```
/etc/rc[0-6].d/ -> /etc/rc.d/rc[0-6].d/
```
每个数字对应不同的运行级别会对服务进行的不同操作。

如有文件`/etc/rc3.d/S85nginx`,`/etc/rc3.d/S84php-fpm`，其中的`S`字母表示`start`启动服务，即在多用户模式(`3`)启动`nginx`,`php-fpm`服务。

而对于文件`/etc/rc6.d/K15nginx`,`/etc/rc6.d/K16php-fpm`，字母`K`表示关闭，即在关机模式时关闭`nginx`,`php-fpm`服务。

##4. chkconfig设置与查看服务列表
想要直观的查看和修改服务在不同运行级别下的情况可以通过`chkconfig`命令来查看。

查看服务在不同级别下的关闭启动情况，`chkconfig`或者`chkconfig --list`命令，效果如下：
```
......
nginx           0:off   1:off   2:on    3:on    4:on    5:on    6:off
php-fpm         0:off   1:off   2:on    3:on    4:on    5:on    6:off
......
```

服务可能在chkconfig列表中（即，没有在`/etc/rc[0-6].d/`目录中），可以通过`chkconfig --add <daemon>`添加服务操作脚本到`/etc/rc[0-6].d/`中，缺少会从`/etc/rc.d/init.d/`中链接过去，如添加`nginx`服务：
```
chkconfig --add nginx
```

删除各运行级别中的某个服务操作使用命令`chkconfig --del <daemon>`，如删除`nginx`服务的操作：
```
chkconfig --del nginx
```

对某个服务的运行级别操作作统一设置，使用命令`chkconfig <daemon> [on | off | reset]`，相关使用说明如下：
```
#设置nginx的2,3,4,5运行级别为on状态
chkconfig nginx on

#设置nginx的2,3,4,5运行级别为off状态
chkconfig nginx off

#重置nginx的运行级状态，一般为全off
chkconfig nginx reset
```

设置服务在某个运行级别的状态，使用命令`chkconfig --level <levelId> <daemon> [on | off | reset]`，如设置`nginx`的`2,3,4`运行级别状态为`off`:
```
chkconfig --level 234 nginx off
```
##5. 新的操作方式systemctl
以上运行级别和服务的查看、设置，对于`Centos7`，做了一些更改，统一为`systemctl`相关命令来操作。`systemctl`是`systemd`的服务管理程序，它融合 service 和 chkconfig 的功能于一体。

相关的命令如下：
```
#运行一个服务：
  systemctl start mariadb.service 

#关闭一个服务：
  systemctl stop mariadb.service 

#重启一个服务：
 systemctl restart mariadb.service 

#显示一个服务（无论运行与否）的状态：
 systemctl status mariadb.service 

#在开机时启用一个服务：
 systemctl enable mariadb.service 

#在开机时禁用一个服务：
 systemctl disable mariadb.service 

#检查一个服务是否是开机启用：
 systemctl is-enabled mariadb.service

```