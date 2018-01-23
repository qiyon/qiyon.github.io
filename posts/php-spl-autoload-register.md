# PHP之spl_autoload_register
将函数注册到SPL `__autoload`函数栈中，使用`new`创建对象时，若对象不存在，依次执行这些注册的SPL `__autoload`函数栈中的函数。

## 示例
对于同一目录下的，以下三个文件：
```
//File A.php
class A {
        public function __construct(){
                echo "construct A\n";
        }
}
```
```
//File BClass.php 
class B {
        public function __construct(){
                echo "construct B\n";
        }
}
```
```
//File test.php
class AutoClass {
        public static function autoLoadFirst($class){
                echo "First \n";
                $file = $class.'.php';
                if (is_file($file)){
                        require_once($file);
                }
        }

        public static function autoLoadSecond($class){
                echo "Second \n";
                $file = $class.'Class.php';
                if (is_file($file)){
                        require_once($file);
                }
        }
}

spl_autoload_register(array('AutoClass','autoLoadFirst'));
spl_autoload_register('AutoClass::autoLoadSecond');
$a = new A();
$b = new B();
```
执行test.php，将会有以下输出：
```
First 
construct A
First 
Second 
construct B
```

## spl_autoload_register参数
对于`spl_autoload_register`函数的使用，有以下定义：
```
bool spl_autoload_register ([ callback $autoload_function ] )
```
传入回调函数，可以是一个单独的函数，一个类的静态方法，或者是一个对象的`public`方法。
```
//直接调用 funcName() 函数
spl_autoload_register('funcName');

//调用  className 类的静态方法 staticFunc
spl_autoload_register('className::staticFunc');

//同上，调用  className 类的静态方法 staticFunc
spl_autoload_register(array('className','staticFunc'));

//某个对象的公共方法，可以在对象内部使用 $this
$objVar = new className();
spl_autoload_register(array($objVar,'publicFunc'));
```