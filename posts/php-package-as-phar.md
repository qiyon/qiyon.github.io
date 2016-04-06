#PHP打包为phar
###简介
phar的作用类似与java的jar，可以将php代码打包成为一个文件，即phar文件。这个phar文件可以想php文件一样执行，别的php文件也可以用phar文件流的形式来调用其中的文件。

###打包项目
对于一个项目`pro`，其中包含文件如下：
```
pro/proClass.php
pro/index.php
pro/other.php
createPhar.php
```
普通的按照以下的方式打包，在`php.ini`中设置`phar.readonly = Off`，通过`createPhar.php`文件：
```
<?php
$phar = new Phar('pro.phar' , FilesystemIterator::CURRENT_AS_FILEINFO | FilesystemIterator::KEY_AS_FILENAME , 'pro.phar');
$phar->buildFromDirectory(dirname(__FILE__) . '/pro/');
```
运行`php createPhar.php`将会生成`pro.phar`文件。

其中`new phar()`，第一个参数为生成phar的路径位置，第二个参数为文件访问方式，第三位参数为phar相关别名，用于`phar://`包含方式中的关键名。
###使用phar
在一般的php脚本中，直接包含phar文件，即：
```
include 'pro.phar';
```
会自动执行`pro.phar`中包含的`index.php`，若不存在`index.php`，php会报错。

通过`phar://`方式包含文件，如：
```
include 'phar://path/to/pro.phar/other.php';
//or
include 'phar://pro.phar/other.php';
```
将会只包含`other.php`文件。
###打包phar自执行文件
类似composer之类的phar文件，能够将文件移动到`/usr/local/bin`等目录，直接在shell中执行`composer`。这类phar有特殊的打包方法。

同样有`pro`项目，如：
```
pro/proClass.php
pro/index.php
pro/other.php
createPhar.php
```
`createPhar.php`文件内容：
```
<?php
$stub = <<<SSS
#!/usr/bin/env php
<?php
Phar::mapPhar();
include 'phar://pro.phar/index.php';
__HALT_COMPILER();
SSS;

$phar = new Phar('pro.phar' , FilesystemIterator::CURRENT_AS_FILEINFO | FilesystemIterator::KEY_AS_FILENAME , 'pro.phar');
$phar->buildFromDirectory(dirname(__FILE__) . '/pro/');
$phar->setStub($stub);
```
其中，`->setStub()`方法设置phar被调用时执行的代码，即执行`$stub`对应脚本内容。



`#!/usr/bin/env php`绑定shell环境执行脚本；

`Phar::mapPhar()`将当前文档所属phar映射到某个phar别名上，无参数即自身的别名(这里是`pro.phar`)；

`include 'phar://pro.phar/index.php'`为包含代码；

`__HALT_COMPILER()`为中断编译，停止接下来的执行。