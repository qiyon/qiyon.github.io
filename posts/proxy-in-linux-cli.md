# Linux命令行下的代理

在命令行下，需要使用代理安装某些东西或者进行某些操作，如`pip`，`git`等。虽然通过设置环境变量可以实现，但有些时候只想对某几条命令代理，来回改环境变量显得很麻烦。

单条命令的代理可以通过`proxychains`，`tsocks`来实现，`Ubuntu`下直接`apt-get`可以很方便的安装。

而想要编译安装，`tsocks`的代码似乎从2002年开始就一直没有更新，也缺少文档。

`proxychains`在`github`上有另外的人进行维护如这个[rofl0r/proxychains-ng](https://github.com/rofl0r/proxychains-ng)。

## 安装

一些安装的记录：

配置安装位置和配置文件位置：
```
./configure --prefix=/opt/proxychains-ng --sysconfdir=/etc
```

编译：
```
make
```

安装，root权限：
```
make install
```

安装配置文件，root权限:
```
make install-config
```

软连接运行程序，root权限，也可以选一个自己喜欢的名字：
```
ln -s  /opt/proxychains-ng/bin/proxychains4 /usr/local/bin/proxychains4 
```

之后便是修改配置文件`/etc/proxychains.conf`，配置文件的可读性很好，修改最后的`[ProxyList]`，改为自己的代理地址和端口，如一个本地`socks5`代理：
```
#......
[ProxyList]

socks5  127.0.0.1 8080

```

## 使用
`curl`谷歌为例:

```
➜  ~  proxychains4 curl google.com
[proxychains] config file found: /etc/proxychains.conf
[proxychains] preloading /opt/proxychains-ng/lib/libproxychains4.so
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>

```

## 环境变量实现代码

在MacOS下，proxychains可能无法使用，这种情况可以通过设置环境变量来实现，在`.bashrc`或`.zshrc`中添加如下alias

```
alias pxon="export http_proxy=http://127.0.0.1:10807; export https_proxy=http://127.0.0.1:10807; echo 'HTTP Proxy on';"
alias pxoff="unset http_proxy; unset https_proxy; echo 'HTTP Proxy off';"
```

对应替换成自己本地的代理设置后。

即可使用`pxon`和`pxoff`手动开启和关闭终端中的代理。
