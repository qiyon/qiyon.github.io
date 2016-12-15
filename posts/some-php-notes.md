# 一些PHP记录

## 函数参数
获取函数调用时传入的参数，通过函数`func_get_args()`：
```
<?php
function oneFunc(){
    $argArr = func_get_args();
    $args = count($argArr);
    $argvFirst = $argArr[0];
}
```
获取php命令行脚本传入的参数,变量`$argv`:
```
<?php
echo count($argv) . PHP_EOL;
echo $argv[0] . PHP_EOL;
echo $argv[1] . PHP_EOL;
```
shell：
```
php test.php hello
```
得到输出：
```
2
test.php
hello
```

## 设置默认值
对于数组中不存在的键设置默认值
```php
<?php
$source = ['foo' => 'val1'];
$default = [
    'foo' => '',
    'bar' => 'val2'
];
$source = $source + $default;
/*
$source var export : 
[
    "foo" => "val1",
    "bar" => "val2",
]
*/
```
