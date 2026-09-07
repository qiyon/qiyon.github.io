---
title: Js实现保留指定html标签
publishedAt: 2015-11-18T15:34:01+08:00
tags:
  - js
  - javascript
  - html
  - filter
draft: false
---

php有类似的函数`strip_tag()`，相关说明 [php.net::strip_tag](https://secure.php.net/manual/zh/function.strip-tags.php)

可以考虑使用js实现一个精简版的，如只保留`<em>`标签，可以有如下函数：

```js
function onlyAllowEm(text) {
 	//正则匹配清除html标签，只允许显示em标签
    return text.replace(/<[\/\!\?]?([\w_-]*)[^>]*>/igm, function($0, $1) {
        return ($1 == 'em') ? $0 : '';
    });
}
```
