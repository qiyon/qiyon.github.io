# Mysql拼音排序
## 字符集
汉字排序时，可以直接字符串比较`strcmp`函数排序，但对于不同在字符集，排序获得的结果是不同。对于`gbk`和`UTF-8`两种在Web中运用比较多的中文字符集。`gbk`按照字符串排序时得到的结果就是按照拼音排序的，`UTF-8`则不是。

## Mysql中
对于`charset`是`gbk`的数据表，排序时可以直接`ORDER BY chineseColunm ASC`。

对于`utf8`的数据表，则可以在转换为`gbk`字符集来排序，`ORDER BY convert(chineseColunm using gbk) ASC`。

## 利用php
由于现在LAMP环境，大多数采用`UTF-8`字符集，对于`utf8`的数据表，若采用mysqk转化字符集排序的方式，有可能存在数据库没有安装`gbk`字符的情况，排序时会提示未知的字符集。

这时可以利用PHP的`iconv()`函数和`strcmp()`函数来进行拼音排序。

以下是一个利用`usort()`函数来进行`utf-8`拼音排序的例子。
```php
<?php
function cmpFunc($a,$b){
    if ($a['chineseColunm'] == $b['chineseColunm']) return 0;
    $a_gbk = iconv('UTF-8','gbk',$a['chineseColunm']);
    $b_gbk = iconv('UTF-8','gbk',$b['chineseColunm']);
    return strcmp($a_gbk,$b_gbk);
}

//处理部分,$dataArray代表从数据获得的全部数据，其中的一项代表一行
$dataArray = array(
    array('id'=>1,'chineseColunm'=>'中文字符串一个'),
    array('id'=>2,'chineseColunm'=>'另一个中文字符串'),
    array('id'=>3,'chineseColunm'=>'再一个中文字符串')
);
usort( $dataArray , 'cmpFunc' );
print_r($dataArray);
//结果
/*
Array
(
    [0] => Array
        (
            [id] => 2
            [chineseColunm] => 另一个中文字符串
        )
    [1] => Array
        (
            [id] => 3
            [chineseColunm] => 再一个中文字符串
        )
    [2] => Array
        (
            [id] => 1
            [chineseColunm] => 中文字符串一个
        )
)
*/
```