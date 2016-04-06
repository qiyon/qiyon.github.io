#一些mysql的笔记
###查看用户信息
```
select * from mysql.user;
```
###添加用户
`dbname`对应数据库，后面可以跟数据库表；`all privileges`所有权限，`@`前为用户名，后为有效的host(`%`可用于匹配，`localhost`代表本地)；`[passwd]`为密码，如下：
```
grant all privileges on dbname.* to addusername@"%" identified by '[passwd]'; 
```
###查看用户权限
如下，查看`username`在任意IP登录的权限:
```
show grants for "username"@"%";
```
###删除用户及其权限
```
drop user username@"%";
drop user username@localhost;
```
###linux下自动补全
找到mysql的client配置文件，一般为`my.cnf`，在`[mysql]`项下去掉`no-auto-rehash`,添加`auto-rehash`，如下：
```
#...
[mysql]
#no-auto-rehash
auto-rehash
#...
```