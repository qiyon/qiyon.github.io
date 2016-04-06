#Kernel升级与VBox共享文件

对于Vbox虚拟机的Linux系统，升级Kernel，可能导致其共享文件功能无法使用。以`centos`为例，解决方法如下：

安装内核相关的依赖：
```
yum install kernel-tools kernel-devel kernel-tools-libs kernel-headers
```

重新安装Vbox扩展功能：
```
/etc/init.d/vboxadd setup
```

应该就能解决问题了......