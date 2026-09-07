---
title: PHP的foreach的一个case
publishedAt: 2018-02-03T17:57:00+08:00
tags:
  - php
  - foreach
  - reference
draft: false
---

## case

```
$arr = ['a', 'b', 'c'];
foreach ($arr as &$item) {
    echo $item . ',';
}
//output: a,b,c,
foreach ($arr as $item) {
    echo $item . ',';
}
//output: a,b,b,
```

## explain 

```
$arr = ['a', 'b', 'c'];
//first foreach
$item = &$arr[0];
$item = &$arr[1];
$item = &$arr[2];
//second foreach
$item = $arr[0];  // $arr[2] = $arr[0] $arr[2] is 'a'
$item = $arr[1];  // $arr[2] = $arr[1] $arr[2] is 'b'
$item = $arr[2];  // $arr[2] = $arr[2] $arr[2] is 'b'
```
