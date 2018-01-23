# PHP防止mysql-sql注入
对于防止 SQL 注入，比较安全的方式是使用数据库的预处理。

一个防范字符串sql注入的代码，参考Yii 1.1.13版本，`CDbConnection`类的`quoteValue`方法。
## code
```
//危险的
$sql = "select * from user where username = '{$str}' ;";

//处理的
//$str为待处理的 需要嵌入到 sql 的字符串
$str = "'" . addcslashes(str_replace("'", "''", $str), "\000\n\r\\\032") . "'";
$sql = "select * from user where username = {$str} ;";
```
## 说明
当mysql的sql中，字符串以单引号包围时（如`where username = 'str_exampe'`），其中包含的连着的单引号，表示一个单引号，如`insert into tbl_name (forbar) values ('exampl''qoute''str')`，相当于插入了字符串`example'quote'str`;

`addcslashes`函数则是对特殊字符转义。