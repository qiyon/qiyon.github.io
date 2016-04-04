#SSH终端-MobaXterm
MobaXterm是一款比较好用的windows下使用的终端软件，提供免费版本。

官网：[mobaxterm](http://mobaxterm.mobatek.net/)

一下是以`v8.5`为参考的一些相关信息和设置

##快捷键
```
复制终端    Ctrl+Shift+U
搜索session Ctrl+Shift+Q
切换TAB     Ctrl+Alt+ 左或者右 箭头  (与一些显卡的切换横竖屏功能冲突，可以先禁用显卡设置)
```

##一些设置
```
开启/关闭 compact mode (简洁形式):    View --> compact mode
设置Cursor：                         Setting --> Configuration --> Terminal --> Cursor
关闭SFTP：                           Setting --> Configuration --> SSH --> SFTP Settings
关闭X11：                            Setting --> Configuration --> X11 --> Auto Start X...... 
SSH设置：                            Setting --> Configuration --> SSH --> Sessions settings
                                         SSH keepalive
                                         X11-Forwarding
```
`Ps`:每个session有自己的设置，以上为整个终端的默认设置，对已建立的session无效。

`PPs`:很多设置都要重启`MobaXterm`才能生效

`PPPs`:终端下，进行中文输入时，退格键不太好用