# Yii1之CComponent

## CComponent介绍
CComponent是整个Yii的基类，主要实现的是`事件 event (private $_e)`和`行为 behavior (private $_m)`的相关操作。

## CComponent的事件处理
Yii的CComponent通过以`on`开头的方法来定义一个时间，如`onSave()`，`onSubmit()`等，事件存储在`$_e（array的key=>val类型）`中，每个key为`事件id (如'onSave','onSubmit')`，val为`CList(事件包含handle的列表)`；每一个事件可以包含多个`句柄 hanlde`，一个`handle`即为一个可以调用的`函数或者方法`；事件的相关信息，如完成状态、参数，存储在一个`CEvent`类型的对象中。

示例，一个`forbarComp`为例：
```
<?php
// path: protected/components/forbarComp.php
class forbarComp extends CComponent
{
    function __construct()
    {
        //这里调用的是属性，非方法，利用 __set() 将 handle 1 写入到 $_e['onSave'] 中
        $this->onSave = function($event){
            echo 'this is handle 1';
            echo PHP_EOL;
            var_dump($event->params);
            echo PHP_EOL;
        };
    }
    
    //定义一个事件，不需要代码，以on开头的方法就行
    public function onSave()
    {
    }
}
```
在某个`action`中：
```
<?php
//  web request： /index/test
class IndexController extends CController
{
    public function actionTest()
    {
        $qy = new forbarComp();
        //添加第二个handle
        $qy->onSave = function($event){
            echo 'this is in handle 2 ';
            echo PHP_EOL;
            var_dump($event->params);
            echo PHP_EOL;
            //设置处理完成
            $event->handled = true;
        };
        //第一个参数可以在handle函数中$event->sender调用，第二个参数可以$event->params调用
        $putEvent = new CEvent(null, array(
            'arg1'=>'nothing'
        ));

        echo '<pre>';
        //触发onSave事件，执行相关的handle
        $qy->raiseEvent('onSave',$putEvent);
        echo 'end:onSave()';
        echo PHP_EOL;
        var_dump($putEvent->handled);
    }
}
```
请求`?r=/index/test`可以得到结果：
```
this is handle 1
array(1) {
  ["arg1"]=>
  string(7) "nothing"
}

this is in handle 2 
array(1) {
  ["arg1"]=>
  string(7) "nothing"
}

end:onSave()
bool(true)
```

## CComponent的行为处理
行为`behavior`可以让`component`执行别的`behavior`类的方法，实现动态的加载某些方法，如对于下面的`behavior类`和`component类`：
```
class bhClass implements IBehavior
{
    public function attach($component){}
    public function detach($component){}
    public function getEnabled()
    {
        return true;
    }
    public function setEnabled($value){}

    public function say()
    {
        echo 'hi behavior';
    }

    public function otherFunc()
    {
        echo 'other function';
    }
}

class testComp extends CComponent
{
    function __construct()
    {
        $bhClass = new bhClass();
        //使 $this->_m['onekey'] = $bhClass;
        $this->attachBehavior('onekey' , $bhClass );
    }
}
```
在action中，代码：
```
        $qy = new testComp();
        echo '<pre>';
        $qy->say();
        echo PHP_EOL;
        $qy->otherFunc();
```
web请求，有结果：
```
hi behavior
other function
```