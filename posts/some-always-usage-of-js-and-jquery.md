# Js & Jquery常用
## Jquery
记录一些可能经常用到的jquery使用方法。
```
//点击事件
$("#buttonId").click(function(){});

//绑定回车键
$("#inputId").bind('keypress',function(event){
    if(event.keyCode == "13"){
        //handle;
    }
});

//设置buttondisabled
$("#buttonId").attr('disabled','disabled');
$("#buttonId").removeAttr('disabled');

//对于某些版本的jquery，操作select、checkbox、radio的选择，需要使用prop
//获取布尔值
if ($("#domid").prop("checked")) {}
//选择 与 不选择
$("#domid").prop("checked",true);
$("#domid").prop("checked",false);

//获取属性值
var arrtValue = $("#domId").attr('attrname');

//获取select选取的text
$("#selectId").find("option:selected").text();

//select改变
$("#selectId").change(function(){});

//移除自身
//<div><button onclick="_theFunc(this)"></button></div>
function _theFunc(btnObj){
    $(btnObj).parent().remove();
}

//等效简写
$(document).ready(function(){});
$(function(){});

//滚动事件
$(window).scroll(function(){};
//当前滚动顶部值
var nowWindownPosionTop = $(document).scrollTop();
//某个dom的顶部位置
var oneDomTop = $('#domId').position().top;

//某个dom的滚动条当前位置
var nowPosition = $('#pre-id').scrollTop();
//滚动条的总高度
var allPosition = $('#pre-id').get(0).scrollHeight; //get(0)为获取原生dom元素
//元素的显示高度
var domHeight = $('#pre-id').height();
//滚动到某个位置
$('#pre-id').scrollTop(intValOfToPosition);
```
## js
js函数的参数`arguments`:
```
function oneFunc(){
    var args = arguments.length;
    var argFirst = arguments[0]; 
}
```