# jQuery的Deferred对象
## 介绍
deferred对象用于封装一个执行过程，并定义它执行过后的回调函数。

执行的结果分为：
- 已完成 `deferred.resolve()`方法
- 已失败 `deferred.reject()`方法

执行后的回调函数有定义有三个：
- 已完成时调用 `deferred.done(function(){})`
- 已失败时调用 `deferred.fail(function(){})`
- 成功或失败都调用 `deferred.always(function(){})`

## ajax与deferred
jquery从1.5开始，`$.ajax()`返回的对象就已经是一个`deferred`对象了，如以下的代码：
```
$.ajax({
    url : 'test.php',
    data : {
        data : 1
    },
    dataType : 'json',
    type : 'post'
}).done(function(json){
    //对应 success 属性
    alert(json.msg);
}).fail(function(err){
    //对应 error 属性
    alert('error');
}).always(function(json){
    alert(json.msg);
});

```
采用deferred对象的方式来执行ajax，可以动态的添加多个回调函数，也可以对多个ajax绑定相同的回调函数，将ajax的请求部分和回调部分分离，如以下代码：
```
var ajaxNum1 = $.ajax({
    //...
});
var ajaxNum2 = $.ajax({
    //...
});
$.when(ajaxNum1,ajaxNum2)
    .done(function(retData){
        //function 1
    })
    .done(function(retData){
        //function 2
    })
    .always(function(retData){
        //function 3
    });
```

## 自定义一个deferred对象
可以自己定义一个deferred对象，代码如下：
```
    var wait = function(){
        var dfd = $.Deferred();
        var doSomething = function(){
            //...
            dfd.resolve('success msg');
        };
        setTimeout(doSomething,3000);
        return dfd.promise();   //返回已经屏蔽掉 resolve() reject()等方法的deferred对象
    };
    $.when(wait())
        .done(function(data){
            alert(data);
        })
        .fail(function(){
            alert('error');
        });
```

## 参考文章
- [阮一峰的个人网站](http://www.ruanyifeng.com/)的一篇文章[jQuery的deferred对象详解](http://www.ruanyifeng.com/blog/2011/08/a_detailed_explanation_of_jquery_deferred_object.html)
- jquery文档[Deferred object](http://api.jquery.com/category/deferred-object/)