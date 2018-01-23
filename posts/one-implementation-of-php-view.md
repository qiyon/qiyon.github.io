# PHP视图层(View)实现
## MVC
MVC(Model,Controller,View)三个层次，几乎所有的PHP框架都是这种实现形式。
- model负责具体的数据处理
- controller负责数据验证和权限判断
- view负责页面显示

## render
一个简单的render引擎，参考[Yii](http://www.yiiframework.com/)框架。

其中比较关键的renderInternal()方法。其中有三个关键的函数，将view脚本中php的输出重定向到某个变量中，再返回。
```php
<?php
extract($_data,EXTR_PREFIX_SAME,'data');
ob_start();
ob_implicit_flush(false);
require($_viewFile);
$returnHtml = ob_get_clean();
return $returnHtml;
```
控制器的实现。
```php
<?php
class CController{
    public $layout = null;


    public function init()
    {}

    //将视图名称转化成视图文件路径，并返回
    public function getViewFilePath($viewStr)
    {
    }

    //加载布局layout的渲染
    public function render($view,$data=null,$return=false)
    {
        $output = $this->renderPartial($view,$data,true);
        if (!empty($this->layout))
            $output = $this->renderPartial($this->layout,array('content'=>$output),true);
        if ($return){
            return $output;
        }else{
            echo $output;
        }
    }
    
    //不加载布局layout
    public function renderPartial($view,$data=null,$return=false)
    {
        $filePath = $this->getViewFilePath($view);
        $output = $this->renderInternal($filePath,$data,true);
        if ($return){
            return $output;
        }else{
            echo $output;
        }
    }

    //输出流重定向
    public function renderInternal($_viewFile,$_data=null,$_return=false)
    {
        if (is_array($_data)){
            extract($_data,EXTR_PREFIX_SAME,'data');
        }
        if($_return){
            ob_start();
            ob_implicit_flush(false);
            require($_viewFile);
            return ob_get_clean();
        }else{
            require($_viewFile);
        }
    }
}
```