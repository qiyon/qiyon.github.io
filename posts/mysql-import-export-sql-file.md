###mysql数据库导入导出-sql文件
####**导出**：
mysql导出为sql文件一般可以通过许多数据库工具来实现，如phpmyadmin，navicat for mysql 等。但通过linux的终端或者windows的cmd来实现更容易理解学习，也有很多可设置选项。

首先mysql/bin如果已加入环境变量可以直接通过mysqldump导出，否则cd到mysql的bin目录，在终端中运行mysqldump导出到某个sql文件，如：
```
d:
cd mysql\bin
mysqldump -uroot -p --default-character-set=utf8 dbname>d:\dbname.sql
```
然后输入密码即可。其中  --default-character-set=utf8 为设置为utf8字符  dbname是数据库名，导出到的的D盘的dbname.sql文件。


####**导入**：
同理导入也可以通过工具实现，但我使用navicat导入utf8的时候经常有问题，不解。phpmyadmin有导入上限（当然可以自己修改，不过可能要涉及到php的设置）；所以通过终端来导入更好些。

 配置了环境变量或者cd到mysql的bin目录；

进入mysql，建立要导入到的数据库 如dbname，utf8字符；

退出mysql，在终端或者cmd中运行导入命令。

```
mysql -uroot -p --default-character-set=utf8 dbname<d:\dbname.sql
```

输入密码，同理，设置了utf8字符，将D盘的dbname.sql文件导入到dbname数据库中。