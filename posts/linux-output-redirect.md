#Linux重定向
###信道
每个进程至少有三个信道：标准输入(STDIN)、标准输出(STDOUT)、标准出错(STDERR)。

从STDIN获取数据，将正常的输出数据送入STDOUT，将错误送入STDERR。

###输入文件内容
```
./mypro < inputfile.txt
```
将`inputfile.txt`里的内容关联到`./mypro`的STDIN信道。
###输出重定向
输出重定向分为`>`和`>>`两种：`>`会清空原有文件，替换为相应的输出内容；`>>`会在原有文件内容后面追加内容。


####标准输出重定向
`>`与`1>`等效，代表标准输出STDOUT重定向，如：
```
ls > outfile.txt
ls 1> outfile.txt
```
将当前目录的信息保存到`outfile.txt`文件中

####标准出错重定向
`2>`将错误信息重定向，如：
```
ls notHasFile 2> erroutfile.txt
```
对于当前目录下不存在的文件或目录`notHasFile`,不会在终端中显示错误信息，错误信息会保存带`erroutfile.txt`文件中。

####标准输入和标准输出
如果要将标准输入和标准输出重定向到同一位置，使用`>&`，如
```
ls xxx >& outfile.txt
```
或者如下方式：
```
ls xxx > outfile.txt 2>&1
```
表示将标准输出重定向到`outfile.txt`，将标准出错重定向到标准输出。

####后台运行程序
```
./myBackPro > logfile 2>&1 &
```
最后一个`&`表示程序后台运行，虽然输出重定向了，但此时运行的进程仍依赖终端，终端关闭，程序也会终止。想要脱离终端可以使用`nohup`，如下：
```
nohup ./myBackPro > logfile 2>&1 &
```