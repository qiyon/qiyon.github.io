# VIM7.4编译安装
官网下载 vim-7.4.tar.bz2，解压。
```shell
tar -xvjf vim-7.4.tar.bz2
```
配置。
```shell
cd vim74
./configure --prefix=/usr/local/vim74 --enable-multibyte --with-features=huge
make
sudo make install
```
可能需要自己安装ncurses库。
```
#Centos 中
sudo yum install ncurses-devel
```

之后建立一个链接文件
```shell
sudo ln -s /usr/local/vim74/bin/vim /usr/local/bin/vim
```
ok!

-------------------------------------
git vim - vundle
```shell
git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim
```