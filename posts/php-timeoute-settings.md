# php超时设置
## curl_setopt
设置curl的超时时间：
```
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT ,0);  //连接时间
curl_setopt($ch, CURLOPT_TIMEOUT, 300); // 执行时间300秒
```
## default_socket_timeout
若不设置上面的curl超时，会使用`php.ini`中的`default_socket_timeout`作为执行时间上限，出厂设置一般为60，单位秒：
```
; Default timeout for socket based streams (seconds)
; http://www.php.net/manual/en/filesystem.configuration.php#ini.default-socket-timeout
default_socket_timeout = 60
```
## 脚本执行时间
对于做web脚本的php，一般有一个脚本执行时间上限，可以在`php.ini`中设置`max_execution_time`，出厂设置一般为60，单位秒：
```
; Maximum execution time of each script, in seconds
; http://www.php.net/manual/en/info.configuration.php#ini.max-execution-time
max_execution_time = 60
```
也可以在php脚本中使用函数`set_time_limit( $max_exec_time )`设置。
## nginx&php-fpm超时设置
使用nginx和php-fpm时，脚本的超时设置`max_execution_time`和`set_time_limit()`将不起作用。

起作用的为php-fpm的`pool.d/www.conf`文件中的`request_terminate_timeout`，默认为0，即不设置超时：
```
; The timeout for serving a single request after which the worker process will
; be killed. This option should be used when the 'max_execution_time' ini option
; does not stop script execution for some reason. A value of '0' means 'off'.
; Available units: s(econds)(default), m(inutes), h(ours), or d(ays)
; Default Value: 0
;request_terminate_timeout = 0
```
以及nginx配置文件中`fastcgi_read_timeout`参数，默认值为60秒，如下：
```
......
location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_read_timeout 300; 
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
......
```