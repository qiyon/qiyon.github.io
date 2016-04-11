# PhpStorm的一些记录

### PhpStorm的一些快捷键
```
Ctrl + n            寻找一个类
Ctrl + Shift + n    搜索并打开工程中的文件
Ctrl + Shift + Alt + n    
                    搜索函数（方法）的声明处
Ctrl + e            最近编辑的文件
Ctrl + 左键单击      跳转到代码声明处
Alt  + F1           编辑器区域的选择，很有用
Alt  + Shift + c    查看项目最近发生的变化

Ctrl + /            注释行
Ctrl + Shift + /    块选择后的块注释
Ctrl + Shift + [或] 块选择代码
Ctrl + w            增量式的选中当前块
Ctrl + Shift + w    与ctrl+w相反
ctrl + - 或 +       折叠项目中的任何代码块

Ctrl + Delete       删除一个单词至结尾
Ctrl + Backspace    删除一个单词至词头

Ctrl + P            显示默认参数
Ctrl + q            查看代码注释，以及声明的参数

Alt  + down         查看下一个方法
Alt  + up           查看上一个方法
Ctrl + Shift + down 声明向下移动
Ctrl + Shift + up   声明向上移动

Ctrl + B            查看方法被调用的情况，唯一时直接跳转

Ctrl + o            重写当前类的一个方法
Ctrl + i            实现一个魔术方法
Alt  + Insert       选择并生成代码菜单
Ctrl + j            插入活动代码提示

Ctrl + Alt + F12    显示文件的路径层级，打开对应的文件夹

Shift + Esc         隐藏Log、Version Control、Terminal等框
```

### 设置换行符
设置新建文件的行分割符格式,即Unix(\n),Window(\n\r),classic Mac(\r)三种中选择：
```
phpStrom 8:
Settings --> Code Style --> General --> Line separator

phpStorm 9:
Settings --> Editor --> Code Style  --> Line separator
```

### 设置文件编码
```
Settings --> Editor --> File Encodings --> Project Encoding
```

### 设置代码折叠
```
Settings --> Editor --> General  --> Code Folding
我一般全部不选
```

### 让PhpStorm不语法分析某个文件
让PhpStorm不加载某个文件，即在查找类声明是不会从某个文件查找，对于某些框架的带压缩版本的文件的有奇效..
```
project --> 右键文件 --> Mark as Plain Text
```

### 设置terminal为`PowerShell`
```
Tools --> Terminal --> shell path 设置为 powershell.exe
```

### SVN回滚代码
先将代码设置到SVN最新版本，保持一致。

使用
```
VCS --> Integrate Project

Source 1 选择Head版本
Source 2 选择要回滚到的commit reversion
```
此功能类似于SVN命令行下的merge

再将更改后的代码`commit`到SVN。
