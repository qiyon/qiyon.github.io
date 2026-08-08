---
title: Js提取字符串中的数值
publishedAt: 2014-09-02T11:53:48+08:00
tags:
  - js
  - javascript
draft: false
---

通过正则替换字符串中的非数字为空。
```
var sourceStr = "2163/ssfg";
var toStr = sourceStr.replace(/[^0-9]/ig,"");   //"2163"
```
