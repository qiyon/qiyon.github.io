# Vagrant基本

## 添加Box
用`vagrant box add [options] <name, url, or path>`添加box，根据名字从Vagrant Cloud上下载对应的box加载到自己的电脑上。

由于国内网络的原因，速度太慢，建议先下载box文件，如一个别人制作好的`ubuntu.box`文件，再用命令从文件导入。导入命令：
```
vagrant box add /path/to/ubuntu.box
```
默认导入的box名称为`base`，可以使用`vagrant box list`命令查看。

指定名称：
```
vagrant box add --name myubuntu /path/to/ubuntu.box
```


## 创建配置文件
cd到某个目录，执行`vagrant init`将创建一个Vagrantfile名称的文件。默认绑定的Box为`base`,修改：

编辑Vagrantfile文件，找到`config.vm.box = "base"`，修改：
```
config.vm.box = "myubuntu"
```
Vagrantfile可以对VM进行各种配置，如端口对应及绑定等。

### 设置指定私有IP
vagrant的box之间默认不能通信，可以通过指定私有IP来使box之间通信。
```
config.vm.network "private_network", ip: "192.168.56.11"
```

### 指定SSH端口
vagrant默认的ssh端口为主机的2222端口，可以通过以下配置自定义指定(较老版本的vagrant可能不适用)。
```
config.vm.network :forwarded_port, guest: 22, host: 2221, id: 'ssh'
```

## 启动
在Vagrantfile所在的目录下，执行`vagrant up`启动虚拟机。

>启动后，会将到Vagrantfile所在目录映射到VM的`/vagrant/`目录。
>
>默认绑定`127.0.0.1:2222`为ssh连接。使用账号密码`vagrant:vagrant`登录，可以`sudo su -`切换到root用户。
>
>(这部分不太确定是否制作的box都是这样的用户管理形式)

关机：`vagrant halt`。


## 导出自己修改过的Box
如果自己对box进行了修改，想迁移到别的电脑上，或者复制给别人使用，可以将导出box。

直接导出Vagrantfile所在目录对应的box，在Vagrantfile所在目录下，执行命令：`vagrant package`。

导出指定box到指定路径，执行命令`vagrant package --base myubuntu --output /path/to/myubuntu.box`。
