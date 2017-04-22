# PHP的Stream

## 简介

php的stream是对文件、socket等资源读写操作封装的一系列函数

## 创建

### 文件

```
$handle = fopen('/path/fo/file', 'r');
$handle = fopen('c:\path\to\win\file', 'r');
$handle = fopen('file:///path/to/file', 'r');
```

### Http

```
$handle = fopen('http://www.example.com', 'r');
$handle = fopen('https://www.example.com/path.html', 'r');
```

### Socket

```
$handle = stream_socket_client('tcp://127.0.0.1:18080');
$handle = stream_socket_client('udp://127.0.0.1:18081');
$handle = stream_socket_client('unix:///path/to/socketfile.sock');

$handle = fsockopen('tcp://127.0.0.1', 18080);
```

相关函数还包括错误码、错误信息变量绑定，timeout等参数，详情请查看官方文档

## 关闭

```
bool fclose(resource $handle)
```

## 读取(获取)数据

### fread 获取指定长度

```
$raw = fread($handle, $lenth);
```

PS：搭配`feol($handle)`函数判断内容是否读取完，对于socket流， 即为是否断开连接

### fgets 获取一行

```
$line = fgets($handle);
```

获取一行的内容，返回一行数据或者最大多少长度的内容(第二个参数设置， 默认1024)

PS：`fgetcsv($handle)`函数可解析csv形式的单行字符串，以数组形式返回

### stream_get_contents 全部内容

```
$content = stream_get_contents($handle);
```

可选制定长度和偏移量

### file_get_contents 直接获取

```
$content = file_get_contents('/path/to/file');
$html = file_get_contents('http://www.example.com');
$html = file_get_contents('https://www.example.com', false, $context);
```

context为stream的处理上下文配置，各协议均有默认的context，可传入自定义配置定义，详情请查看官方文档

## 写入(发送)数据

```
fwrite($handle, $content);
```

## Context配置

对于fopen等创建的流，针对不同scheme有默认的context，会决定传输数据的形式、内容等

详情请查看官方文档 http://php.net/manual/context.php

### 创建

```
$context = stream_context_create(array $options);
```

将$conext在fopen等函数中作为参数传入

### 修改

```
stream_context_set_option($handle, array $options)
```

修改流的context

## 属性设置

### 阻塞

```
bool stream_set_blocking(resource $handle, int $mode)
```

mode为0设为非阻塞，为1设为阻塞

阻塞模式影响fgets、fread等读取函数调用时是否立即返回结果

文件和socket一般默认为阻塞模式，阻塞时间由timeout决定

### timeout

```
bool stream_set_timeout(resource $handle, int $seconds [, int $microseconds = 0 ])
```

设置timeout，对于socket流，默认的timeout由php.ini配置的`default_socket_timeout`决定

## 自定义Scheme

PHP支持自定义Scheme，即以`scheme://foobarstr`形式的字符串通过fopen建立stream

```
bool stream_wrapper_register(string $protocol, string $classname [, int $flags = 0 ])
```

相关文档见官方 http://php.net/manual/class.streamwrapper.php 关键字StreamWrapper