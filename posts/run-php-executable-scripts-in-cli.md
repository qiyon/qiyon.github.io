###Linux下PHP脚本可执行
对于一个php脚本，在linux环境下，想要像一个可执行文件一样执行，如php的composr程序。需要在脚本的前方加shell注释。如下面一个php脚本：
```
#!/usr/bin/env php
<?php
echo "Hello x! \n";
```
前提是php执行文件在$PATH包含的目录中(脚本的第一行，会告诉Linux在$PATH中去寻找php执行程序)。

保存为demo（文件名自取）后加上x权限，可以在终端中直接执行:
```
./demo
```
想在终端中不加“./”，可以移动程序到/usr/local/bin或者其它环境目录（echo $PATH）下。
