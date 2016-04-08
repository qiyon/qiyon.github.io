#Ubuntu安装pptpd的VPN服务器

以`ubuntu14.04`为例

##安装pptpd
```
apt-get install pptpd
```

##修改pptpd配置
修改`/etc/pptpd.conf`文件，找到
```
#localip 192.168.0.1
#remoteip 192.168.0.234-238,192.168.0.245
```
这两行，去掉注释（前面的`#`），保存

修改`/etc/ppp/pptpd-options`，找到`ms-dns`选项，设置为google的dns
```
ms-dns 8.8.8.8
ms-dns 8.8.4.4
```

##设置账号
修改`/etc/ppp/chap-secrets`文件，添加账号和密码，每一行的形式为：
```
theusername pptpd thepassword *
```
`theusername`为账号，`thepassword`为密码，`pptpd`是协议，`*`位置为远端IP`*`为任意的ip。可以添加多行

##允许ipv4 forward
修改`/etc/sysctl.conf`文件，找到：
```
#net.ipv4.ip_forward=1
```
去掉注释(`#`号)，保存

然后运行
```
sysctl -p
```

##重启pptpd
```
service pptpd restart
```
此时`pptpd`已经可以通过账户密码连接，连接设备能够分配到一个`192.168.0.234-238`间的vpn-ip，但其网络请求还需要通过iptables转发到外网，vpn才有意义和效果。

##添加iptables

先确定转发端口，通过`ifconfig`查看服务器的ip和对应的网络口名称，一般为`eth0`，不同的vps也有自定义的名称，如`venet0`等。

以`eth0`为例，设置iptable
```
iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -o eth0 -j MASQUERADE
```
即将`192.168.0.*`的请求通过`nat`的方式转发给`eth0`，并返回的结果送回`192.168.0.*`，从而实现vpn的效果。


##重启计算机
`注意`，服务器重启后，`iptables`的设置也会清空，需要重新设置`iptables`转发。

或者通过别的方式自动在重启时恢复相应的`iptables`设置
