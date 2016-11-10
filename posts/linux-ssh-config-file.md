# Linux下ssh使用config文件配置

## 概述

linux 或 unix 中使用 ssh 访问远端系统，不像 windows 下一般使用第三方的客户端，而是在系统 terminal 中直接使用 ssh 命令。

在管理多个远端服务器的时候，直接使用 ssh 输入每个远端服务器对应的 Host 、用户名、密码（或密钥）并不方便，此时在 ssh 的 config 文件（`~/.ssh/config`）中进行相关配置，可以很好的管理和使用 ssh 连接。


## 通用配置 

在 config 文件中，可以通过`Host *` 来配置所有 ssh 连接，如：

```
Host *
    ControlMaster auto
    ControlPath ~/.ssh/%h-%r-%p
    ControlPersist 4h
``` 
其中 `ControlMaster auto` 表示复用 ssh session 连接，每次建立连接是查看是否有连接存在，连接记录在 `ControlPath` 对应的文件中，`ControlPersist` 表示连接持久化，连接关闭后保存四小时。


## 主机单独配置

在 config 文件中，使用 `Host one_word` 可以单独配置一个主机信息，并可以在命令中直接使用 `ssh one_word` 快速进行 ssh 连接，配置示例如下：
```
Host one_word
    HostName <Ip or domain>
    User root
    Port 22
```
除了地址、端口、用户名等基本信息，还可以指定密钥等，密钥设置使用 `IdentityFile` 字段，以及可以覆盖 `Host *` 中的同名配置。

密钥登陆是在服务器管理中比较常用的方式，将公钥(如 `id_rsa.pub`)添加到服务器用户对应的授权 key 中(`~/.ssh/authorized_keys`，一般服务器默认允许密钥登陆)。则可以在 ssh 命令中指定以密钥登陆，需指定私钥(如 `id_rsa`)，自动寻找同目录下同名的公钥(即 `id_rsa.pub`)。

Ps：私钥可以再加上一个口令加密，降低被盗用时的风险。

