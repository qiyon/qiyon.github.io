---
title: svn的一些笔记
publishedAt: 2014-09-09T11:02:50+08:00
tags:
  - svn
  - subversion
draft: false
---

## svn diff
比较文档修改的详细信息。
```
#比较当前目录下，工作副本和本地库文件修改。
svn diff  

#比较当前目录下oldreversion到newreversion版本的文件修改。
svn diff -r <oldreversion>:<newreversion>  
```
## svn log
日志信息。
```
#oldversion到newversion的日志信息
svn log -r <oldreversion>:<newreversion>
```
## update
```
#更新（或回滚）到制定版本
svn up -r <Reversion>
```
