# Linux-Tmux记录
`tmux`用于管理终端会话，能够保留和恢复会话信息。

## 基本概念
- `Session`-会话
- `Window`-窗口，一个会话包含多个窗口
- `Pane`-窗格，一个窗口可以分割成为多个窗格


## 命令行命令
`tmux`命令行用于启动和管理会话，相关命令如下：
```
#启动tmux会话
tmux

#显示当前已有的会话列表
tmux ls

#attach指定session(先ls 再进入指定session)
tmux a -t name-or-number

#关闭一个session，按顺序
tmux kill-session

#关闭指定session
tmux kill-session -t name-or-number
```

启动`tmux`后，终端会发生相应变化，下方会显示具体的`session`和`window`信息。

## tmux基本操作
基本操作需要一个前置操作来引导，避免多余的快捷键冲突，默认前置快捷键为`ctrl-b`，以下用`prefix`表示

### 基本
```
查看按键列表                         prefix + ?  
执行tmux外命令                       prefix + :

可通过 (prefix + :tmux kill-session -t name-or-number)关闭指定session
```
### Session相关
```
显示session列表并选择                prefix + s
离开(detach)session                  prefix + d
重命名sesssion名称                   prefix + $
```

### Window相关
```
新建窗口                              prefix + c
列出窗口并选择                        prefix + w
关闭当前窗口                          prefix + &
切换到指定窗口                        prefix + (0-9)
```
在窗口的最后一个终端中执行`exit`可退出并关闭该窗口。

### Pane相关
```
垂直拆分新窗格                        prefix + "
水平拆分新窗格                        prefix + %
查看所有窗口的号码                    prefix + q
切换指定窗口                          prefix + q + (0-9)
切换到下一个窗格                      prefix + o (字母 o 而不是数字 0)
放大(恢复)窗格                        prefix + z
```
在对应窗格中执行`exit`可关闭此窗格。
