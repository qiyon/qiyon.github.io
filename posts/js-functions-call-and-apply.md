#js函数调用之call()与apply()
###匿名函数与this
js的函数可以一匿名函数的形式存在，对于一个对象的，对于某一个属性（可以说是方法）为匿名函数时，函数中的this表征这个对象。如以下代码
```
var obj = {
    a : 5,
    b : 4,
    c : 0,
    add : function(){
        this.c = this.a + this.b;
    }
};
obj.add();
alert(obj.c);
```
可以很显然的得到结果9。
###替换this
但很多时候，匿名函数，并不一定是对象的直接属性（方法），而可能是某个对象的属性的属性（方法）,直接调用的话，无法直接操作对象的属性。如下面一个对象：
```
var otherObj = {
    a : 1,
    b : 2,
    funcs : {
        onefunc : function(num1,num2){
            this.a = this.a + num1 + num2;
        },
        otherfunc : function(num1,num2){
            this.b = this.b + num1 + num2;
        },
    }
};
otherObj.funcs.onefunc();//报错，not find this.a
alert(otherObj.a);  //  任然是1
```
对于这种情况的实现，js的匿名函数内置了`call()`和`apply()`两个方法,本质一致，都是替换匿名函数中this引用对应的对象，只是调用形式有所区别。
```
//对于otherObj的调用采用如下
otherObj.funcs.onefunc.apply(otherObj,[1,2]);
alert(otherObj.a);  //结果为 1+1+2 ===>  4

otherObj.funcs.otherfunc.call(otherObj,2,2);
alert(otherObj.b);  //结果为 2+2+2 ===>  6
```