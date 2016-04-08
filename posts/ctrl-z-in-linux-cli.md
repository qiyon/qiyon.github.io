#Linux关于Ctrl+Z
在使用Vim的时候，不小心按到`Ctrl + Z`，使当前Vim关闭，返回到了终端...

出现以下字符：
```
[1]  + 5060 suspended  vim test.md
```

使Vim被挂起了。


##挂起程序
`使用Ctrl + Z`发送挂起命令到当前程序。

##查看挂起的程序
终端中使用`jobs`查看当前挂起的程序。
```
➜  jobs
[1]  + suspended  vim test.md
```
前面的`[1]`为挂起任务的编号。

##唤醒挂起任务
使用`fg %`跟上任务Id，唤醒任务。

如，唤醒此例子中的Vim
```
fg %1
```