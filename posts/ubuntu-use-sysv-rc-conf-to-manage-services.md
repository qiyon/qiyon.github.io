#ubuntu利用sysv-rc-conf设置服务启动
###安装和使用
安装：
```
sudo apt-get install sysv-rc-conf
```
root权限使用：
```
sudo sysv-rc-conf
```
###说明
每一列对应ubuntu的运行级别，如下：
```
0   系统停机状态
1   单用户或系统维护状态
2~5 多用户状态
6   重新启动 
```