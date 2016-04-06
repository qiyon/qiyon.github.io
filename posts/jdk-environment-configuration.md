#jdk环境变量配置
###Linux下
以ubuntu下java-7-openjdk为例，更改`/etc/profile`，在末尾添加：
```
export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```
之后重启终端。
###Windows下
假设安装的java的路径为`C:\java\jdk7\`，环境变量设置如下：
```
JAVA_HOME = C:\java\jdk7
Path 添加 %JAVA_HOME%\bin;
CLASSPATH = .;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tool.jar
```
###安装ANT
配置`ANT_HOME`为ANT安装目录。

加入`%ANT_HOME%\bin`(windows)或者`$ANT_HOME\bin`(linux)到环境变量`Path`。