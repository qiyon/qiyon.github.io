#PHP的foreach和Iterator接口
###介绍
foreach可以遍历数组和对象，获取key和value值。

对于数值array()的遍历，很好理解，参照[php.net](http://php.net/manual/zh/control-structures.foreach.php)。

###foreach遍历对象
foreach遍历对象时，会将对象分为两类，一般的对象和继承Iterator接口的对象。

对于一般的对象，foreach会遍历对象的可见属性，获取属性名和值作为key-value。外部foreach对象可获取public的属性，对象内部foreach $this，可以获取public、protected、private(继承的不获取)。详细的内容可以参照[php.net](http://php.net/manual/zh/language.oop5.iterations.php)。

对于实现Iterator接口的对象，会按照接口的实现方式执行foreach。
```php
foreach($iteratorClass as $key=>$value){
}
```
###Iterator接口
Iterator(迭代器的定义)
```php
 Iterator extends Traversable {
    /* Methods */
    abstract public mixed current ( void )
    abstract public scalar key ( void )
    abstract public void next ( void )
    abstract public void rewind ( void )
    abstract public boolean valid ( void )
}
```
一个类实现Iterator的接口:
```php
class myIterator implements Iterator {
    //自定义的属性方法
    //实现Iterator接口的方法
    //......
    //rewind() foreach开始时执行的操作
    //valid() 用于判断foreach是否结束，需return bool值，true继续遍历，false终止遍历
    //key() 返回当前遍历中的key值，需return ，作为$key
    //current() 返回当前遍历中的value值，需return，作为$value
    //next() 当前轮遍历后执行的操作
}
```
执行的流程，直到valid()返回flase时终止：
- rewind()
- ----------循环----------
- valid()
- current()
- key()
- 执行foreach{}中的操作
- next()
- ----------循环----------