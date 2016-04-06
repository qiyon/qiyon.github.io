#apt-get note
###基本命令
安装:
```
apt-get install <package>
```
卸载，移除：
```
#卸载软件但保留配置文件
apt-get remove <package>

#卸载软件和配置文件，下面两个都可以
apt-get purge <package>
apt-get --purge remove <package>
```
卸载的同时自动卸载某些依赖的软件：
```
apt-get autoremove <package>
```
搜索：
```
apt-cache search <package>
```
依赖性
```
apt-cache depends <package>
```
清除已下载的缓存包  `/var/cache/apt/archives/`
```
apt-get clean
```
更新包档案：
```
apt-get update
```
更新升级已安装的软件：
```
#不会安装新依赖
apt-get upgrade
#可能会添加新套件，解决依赖
apt-get dist-upgrade
```

###源文件位置
Ubuntu会根据源文件的配置去相应的镜像点下载软件。

源文件包括`/etc/apt/sources.list`文件和`/etc/apt/sources.list.d`目录下的`.list`扩展名的文件。

###PPA源
除了有官方源，还有个人源PPA（Personal Package Archives）。

ppa源的地址：`https://launchpad.net/ubuntu/+ppas` ，在其中搜索到你需要的ppa源，例如`duggan/composer`,然后使用以下命令添加（或者删除已安装的）源。
```
#添加 ppa:duggan/composer
add-apt-repository ppa:duggan/composer

#删除 ppa:duggan/composer
add-apt-repository -r ppa:duggan/composer
```
之后再更新源档案：
```
apt-get update
```

###查看安装的软件aptitude
`aptitude`可以查看所有软件的安装信息