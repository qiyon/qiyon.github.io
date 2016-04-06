#ubuntu之nginx搭配php-fpm
采用ubuntu14.04的官方源，搭建nginx和php-fpm的Web环境。
###安装
安装php和php-fpm：
```
sudo apt-get install php5-cli php5-fpm
```
更好的php环境，可以安装更多php扩展, 根据自己的需求选择。
```
sudo apt-get install php5-redis php5-mcrypt php5-gd  php5-mysqlnd
```
安装nginx：
```
sudo apt-get install nginx
```
###配置
这里安装的php-fpm默认采用`unix:/var/run/php5-fpm.sock`,配置nginx即可。

配置`/etc/nginx/sites-enabled/default`文件，修改配置至如下的形式(`#`开头为注释)：
```
#file:/etc/nginx/sites-enabled/default
server{
    listen 80;
    server_name localhost;

    root /var/www/html/ExampleProject;

    location / {
        try_files $uri /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass    127.0.0.1:9000;
        fastcgi_index   index.php;
        fastcgi_param   SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include         fastcgi_params;
    }
}

```
配置`/etc/nginx/fastcgi_params`文件，修改如下(去掉`fastcgi_param  SCRIPT_FILENAME         $request_filename;`这一行，即在前面添加`#`);
```
#file:/etc/nginx/fastcgi_params
#原来的配置
fastcgi_param  SCRIPT_FILENAME         $request_filename;

#现在的配置
#fastcgi_param  SCRIPT_FILENAME         $request_filename;
```

更过nginx的配置方式，自行学习。
###相关操作和配置文件位置
打开、关闭、重启、查看nginx和php-fpm服务：
```
sudo service nginx start
sudo service nginx stop
sudo service nginx restart
sudo service nginx status

sudo service php5-fpm start
sudo service php5-fpm stop
sudo service php5-fpm restart
sudo service php5-fpm status
```
php-fpm配置文件位置：
```
#fpm配置文件
/etc/php5/fpm/php-fpm.conf

#fpm的php.ini配置文件
/etc/php5/fpm/php.ini

#监听方式的配置
/etc/php5/fpm/pool.d/www.conf
```
nginx配置文件位置：
```
#nginx主配置文件
/etc/nginx/sites-enabled/default

#fastcgi配置文件
/etc/nginx/fastcgi_params
```