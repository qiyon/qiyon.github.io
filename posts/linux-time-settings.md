#Linux时间相关

##设置时区
```
cp /usr/share/zoneinfo/Asia/Chongqing /etc/localtime
```
复制`zoneinfo`中相关地点或时区的文件，覆盖`/etc/localtime`，实现设置时区。

Ps：`Chongqing`,`Shanghai`均为北京时间。

##同步网络时间
`centos`为例，安装`ntp`(Network Time Protocol，网络时间协议)
```
yum install ntp
```
使用`ntpdate`命令同步时间，需`root`权限
```
ntpdate time.nist.gov  
```
以下为一些常用网络时间域名

- cn.pool.ntp.org
- time.nist.gov  
- ......

##格式化输出当前时间
mysql的样式：
```
date "+%Y-%m-%d %H:%M:%S"
```