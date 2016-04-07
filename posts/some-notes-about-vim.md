#Vim的一些记录

##分屏

参考[酷壳](http://coolshell.cn)中的一片博文[Vim的分屏功能](http://coolshell.cn/articles/1679.html)

##代码折叠相关
```
zc        折叠当前位置
zo        展开当前位置
zC        当前区域，递归折叠所有
zO        当前区域，递归展开所有

zn        当前文件，全部展开
zN        当前文件，全部折叠

[z        到当前打开的折叠的开始处。
]z        到当前打开的折叠的末尾处。
zj        向下移动。到达下一个折叠的开始处。关闭的折叠也被计入。
zk        向上移动到前一折叠的结束处。关闭的折叠也被计入。
```

##复制与删除
```
清除{}中的内容 di{
清除[]中的内容 di[
清除''中的内容 di'
清除""中的内容 di"

复制{}中的内容 yi{
复制[]中的内容 yi[
复制''中的内容 yi'
复制""中的内容 yi"

```