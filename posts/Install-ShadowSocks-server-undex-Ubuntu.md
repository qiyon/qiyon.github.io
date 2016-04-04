#Ubuntu安装ShadowSocks服务端

ShadowSocks使用分为三部分，`1 ShadowSocks服务器端`，`2 ShadowSocks客户端，也是代理的服务器端`，`3 浏览器等客户端`

以在`ubuntu14.04`下安装为例

##安装
安装`python-pip`，`python-gevent`
```
apt-get install python-pip python-gevent
```
安装`shadowsocks`
```
pip install shadowsocks
```

##配置
自己创建以个配置文件，如`/root/config/shadowsocks.json`，内容如下：
```
{
        "server":"<string : ip>",
        "server_port":<int : port>,
        "password":"<string : passwd>",
        "timeout":600,
        "method":"aes-256-cfb"
}
```
相关说明，可以查看官网的文档

##启动
确定一个日志文件位置，如`/root/log/shadow.log`，通过`nohup`启动程序，并将输出重定向到日志文件
```
nohup ssserver -c /root/config/shdowsocks.json > /root/log/shadow.log &
```