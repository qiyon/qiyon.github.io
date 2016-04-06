#php之exec记录
适用于linux下，有`a.php`和`b.php`两个文件，`a.php`通过`exec()`调用php执行`b.php`：
```
//b.php能够运行，但如果a.php退出，b.php一起退出
exec('php b.php');

//b.php后台运行，但a.php也会一直运行，手动kill掉a.php不影响b.php的运行
exec('php b.php&');

//b.php后台运行，a.php执行b.php后，继续执行之后的命令
exec('php b.php > /dev/null &');
```

###参考文章
[PHP 脚本后台执行 - awildfish - 博客园](http://www.cnblogs.com/helww/archive/2013/06/14/3136737.html)