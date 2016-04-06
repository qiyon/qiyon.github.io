###Yiic shell
Yii开发过程中，使用yiic可以快速创建module。

假设 app/framework/yiic 为yiic的位置，app/index.php 和 app/protected/config/main.php 为入口文件和配置文件。

进入yiic shell：

首先 cd 到 yiic到目录。
```php
./yiic shell ../index.php
```
或者
```php
./yiic shell ../protected/config/main.php
```
进入后：
```php
module  <module-ID>
```
则可以创建一个module，之后在main.php中添加module-ID就可以使用module了。