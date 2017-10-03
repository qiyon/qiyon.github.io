# Nginx与PHP-FPM的信号管理

## 说明

Linux 下可以通过 kill 等命令向进程发送信号 signal ，进程接受到信号，可以执行对应的预定义的相关操作，从而实现退出、重启、重新加载配置文件等相关操作。

命令行

`kill -INT <program id>`

进程 id 可以通过 `ps -ef` 或 `.pid` 文件等方式获得。

## PHP-FPM

| signal     | Desc                                     |                      |
| ---------- | ---------------------------------------- | -------------------- |
| `INT,TERM` | immediate termination                    | 立即关闭进程               |
| `QUIT`     | graceful stop                            | 优雅安全得退出 PHP-FPM      |
| `USR1`     | re-open log file                         |                      |
| `USR2`     | graceful reload of all workers + reload of fpm conf/binary | 优雅得重新加载配置文件和重启 woker |



## Nginx

| signal     | Desc                                     |                      |
| ---------- | ---------------------------------------- | -------------------- |
| `INT,TERM` | fast shutdown                            | 立即停止进程               |
| `QUIT`     | graceful shutdown                        | 优雅安全得退出关闭 nginx      |
| `HUP`      | graceful shutdown of old worker processes,  starting new worker processes | 优雅得重新加载配置文件和重启 woker |
| `USR1`     | re-opening log files                     |                      |
| `USR2`     | upgrading an executable file             |                      |
| `WINCH`    | graceful shutdown of worker processes    | 优雅得安全关闭 worker       |

以上信号可作用于 nginx 的 master 进程，以及 `INT, TERM, QUIT, USR1, WINCH` 也可以对应作用于 worker 进程，进行相应管理。

## 参考链接

[Controlling nginx](http://nginx.org/en/docs/control.html)

[PHP-FPM Signal Handling](https://forum.nginx.org/read.php?3,3485)

linux 文档 `man nginx` 与 `man php-fpm`

