###Linux链接文件
在linux中，一个文件可以指向另外一个文件，实现两个文件的等效。生成链接文件通过ln命令，有两种方式，为软链接和硬链接，指定时-s来区分（-s 生成软链接）。
```
##ln -s [原文件]  [生成链接文件]
ln -s file.txt  file-symlink.txt
ls -la 
file-symlink -> file.txt
```
对于-s生成的链接文件，为软链接，删除时，不会影响原文件，索引方式为：
```
[链接文件]--->[原文件]--->[文件数据]
```
如果不加-s，则为硬链接，两个文件等效，但指向同一个数据区域。相当于：
```
[原文件]--->[文件数据]<---[新文件] 
```

两者的详细区别，可以学习或者查看linux文件系统的相关资料，关于inode和block的部分，会有更深入的理解。

####**应用**
当自己编译安装一个程序时，如VIM、PHP、Apache等。一般会选择一个安装目录，多数为/usr/local/vim74 , /usr/local/php5/ . /usr/local/apahce2等，安装好的程序要在终端中使用，需要使用全路径，或者加alias，或者ln一个链接文件。

**第一个办法**是使用alias的方法，对于当前用户，在 ~/.bashrc 文件中加入一个alias， 再source一下 .bashrc 文件
```
alias vim='/usr/local/vim74/bin/vim'
```
**另外一个办法**就是添加链接文件，终端中echo $PATH可以看到：
```
echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/home/username/.local/bin:/home/username/bin
```
对于这些以冒号隔开的路径，在其路径的的程序可以直接运行，不用使用全路劲。因而，可以链接一个文件到这些路径下（须root权限），(对于自己安装的程序，我一般选在在/usr/local/bin下)，就可以在终端中方便的使用，如VIM：
```
ln -s /usr/local/vim74/bin/vim  /usr/local/bin/vim
```
-----------------------------------------
***对于文件夹的链接，待续。。。。。。***