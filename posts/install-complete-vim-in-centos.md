#Centos安装VIM完整版
`Centos`安装好后，自带的vim只是`vim-minimal`，即`vi`

此时`vim`为`command not found`状态，通过`yum`安装版本全面的`vim`：
```
yum install vim-common vim-enhanced
```