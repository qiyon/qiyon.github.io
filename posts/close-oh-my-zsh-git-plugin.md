#关闭oh-my-zsh的git插件
`oh-my-zsh`安装后会自带`git`附加功能，每次进入`git`的目录，都会进行`git status`命令获取相关信息。

如果项目的内容特别多，同时硬盘的性能也差的话，执行命令的延迟会非常大，甚至达到几秒钟的程度。

执行以下`git`的配置信息，`oh-my-zsh`就不会再执行`git status`命令了：
```
git config --global oh-my-zsh.hide-status 1
```