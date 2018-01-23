# scp note
scp 可以在 2个 linux 主机间复制文件； 基于ssh协议

从本地到远端：
```shell
#文件夹
scp -r local_file remote_username@remote_ip:remote_folder 
#文件
scp local_file remote_username@remote_ip:remote_file 
```
从远端到本地：
```shell
#文件夹
scp -r  remote_username@remote_ip:remote_folder local_file
#文件
scp  remote_username@remote_ip:remote_file local_file
```
常用参数：
```
-v 用来显示进度 . 可以用来查看连接,认证,或是配置错误.
-C 压缩选项 .
-P 选择端口
-4 强行使用 IPV4 地址 .
-6 强行使用 IPV6 地址 .
```