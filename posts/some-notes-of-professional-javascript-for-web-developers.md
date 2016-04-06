#JavaScript高级程序设计(第三版)
简单（基本）数据类型：
 - Undefined
 - Null
 - Boolean
 - Number
 - String

复杂数据类型：
 - Object

typeof。null会被认为是一个空的对象引用。
```js
var myTestJson = {
    oneString : "test",
    oneNull : null,
    oneFunction : function(){}
};
typeof(myTestJson.oneNull);  // "object"
typeof(myTestJson.error);//"undefined"
typeof(myTestJson.oneFunction);  //"function"
typeof(myTestJson);//"object"
```
转化为数字的函数 Number();

for-in语句:
```
var myO = {
   var1 : "kankan",
   var2 : "zai kankan"
};

for(var inVar in myO){
   console.log(inVar);
}
```
函数function中的参数数组 arguments:
```
arguments[0] //第一个参数
arguments[1] //第二个参数
arguments.length  //参数个数
```
获取对象属性：
```
var myO = {
    var1 : "the one ",
    var2 : "other one"
};
console.log(myO.var1);
console.log(myO["var1"]);
var keyStr = "var1";
console.log(myO[keyStr]);
//All output  "the one"
```
属性define：
```
var book = {
    year :2004,
    edition :1
};
Object.defineProperty(book,"year",{
    get:function(){
        return this.year;
    },
    set:function(newValue){
        if (newValue > 2004){
            this.year = newValue;
            this.edition += newValue - 2004;
        }
    }
});
```
原型模式构造对象：
```
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
     alert(this.name);
};
//or
Person.prototype = {
    name : "Nicholas",
    age : 29,
    job: "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};
var person1 = new Person();
var person2 = new Person();
person1.name = "Greg";
alert(person1.name); //"Greg"——来自实例
alert(person2.name); //"Nicholas"——来自原型
```
组合使用构造函数模式和原型模式：
```
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ["Shelby", "Court"];
}
Person.prototype = {
    constructor : Person,
    sayName : function(){
        alert(this.name);
    }
}
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
person1.friends.push("Van");
alert(person1.friends);//"Shelby,Count,Van"
alert(person2.friends);//"Shelby,Count"
alert(person1.friends === person2.friends);//false
alert(person1.sayName === person2.sayName);//true
```