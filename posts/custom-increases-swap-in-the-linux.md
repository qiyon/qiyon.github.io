#自定义增加Swap

使用`composer`或者`npm`等工具时，无`swap`可能会造成包无法安装。

这时需要添加`swap`，参考[Troubleshooting - Composer](https://getcomposer.org/doc/articles/troubleshooting.md#proc-open-fork-failed-errors)

##创建文件
```
/bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
```
`/var/swap.1`为`swap`的对应存储占用文件，大小为1024M。文件和大小根据实际需求情况决定。

##生成swap
```
/sbin/mkswap /var/swap.1
```

##打开swap
```
/sbin/swapon /var/swap.1
```

##开机自动启动
以上方式建立的`swap`重启后失效。

保持开机自动建立`swap`，需再以上操作基础上，执行以下操作。

修改`/etc/fstab`，添加
```
/var/swap.1 swap swap defaults 0 0
```