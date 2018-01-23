# nginx常用变量
在nginx的配置文件中，常用到的变量，用于rewrit等。
```
#对于一个请求 http://foo.com/path/to/bar.php?query=example
#webroot为，/path/to/webroot

$uri==$document_uri /path/to/bar.php
$args==$query_string query=example
$request_uri /path/to/bar.php?query=example
$request_filename /path/to/webroot/path/to/bar.php
```

一个使用`try_files`来rewrite的例子：
```
location /{
    #other config......
    try_files $uri $uri/ /index.php$request_uri;
}
```
尝试访问`$uri`所代表的文件或目录，以及`/index.php$request_uri`（若请求为`http://foo.com/index/index`，即`http://foo.com/index.php/index/index`）。