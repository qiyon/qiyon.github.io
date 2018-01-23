# vagrant关联丢失的virtualbox
使用vagrant的时候不正常关机可能丢失virtualbox绑定信息，这时候运行`vagrant up`可能导致创建一个新virtualbox。

出现这种情况，可以手动更改vagrant的virtualbox绑定信息。

## 获取virtualbox的id值
`cd`到virtualbox的文件目录，执行`VBoxManage list vms`，如Windows下：
```
d:
cd D:\Program Files\Oracle\VirtualBox
VBoxManage list vms
```
之后得到如下类似的结果，找到对应虚拟机的id值：
```
"vag_default_1420120484274_49577" {b5631336-189e-4970-b313-3c6349210eb3}
```
此例子中，id值为`b5631336-189e-4970-b313-3c6349210eb3`。

## 绑定id值
进入Vagrantfile所在目录，进入其子目录`.vagrant\machines\default\virtualbox`，找到`id`文件，若不存在则自己创建一个，例如：
```
#Vagrantfile所在目录为
D:\vag\
#则id文件为
D:\vag\.vagrant\machines\default\virtualbox\id
```
将其文件内容改为之前获取的`id`值。
## 检查
之后可以在Vagrantfile所在目录下运行命令行`vagrant status`查看是否绑定成功。

## 参考文章
[Vagrant关联已经存在的virtualbox](http://blog.sina.com.cn/s/blog_5f54f0be0102v9hc.html)