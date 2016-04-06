###Apache2.4 配置多端口
####配置httpd.conf
监听多个端口:
```
Listen 80
Listen 8080
```
开启虚拟站点，（路径可能不一致，如xampp的为etc/extra/httpd-vhost.conf）:
```
# Virtual hosts
Include conf/extra/httpd-vhosts.conf
```
配置conf/httpd-vhosts.conf:
```
<VirtualHost *:8080>
    DocumentRoot "/data0/wwwroot"
    
    <Directory "/data0/wwwroot">
        Options FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

</VirtualHost>
```
访问站点出现you don't have permission to access / on this server(Apache Server权限访问问题)，尝试修改文权限或者修改apache的httpd.conf:
```
<Directory />
    AllowOverride none
    Require all denied
</Directory>
```
修改为：
```
<Directory />
    AllowOverride none
    #Require all denied
</Directory>
```