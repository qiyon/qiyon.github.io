#Laravel 4 Note
###代码结构
laravel/
- app/
	- commands
	- config/		---配置文件
    - controller/	---控制器
    - databases/
    - filters.php	---过滤器配置
    - lang/
    - models/		---模型
    - routes.php         ---路由配置
    - start/
    - storage/		---session、cache、view等  需可写
    - tests/
    - views/		---视图
- artisan			---命令
- bootstrap/
- composer.json
- composer.lock
- public/
	- css/
	- index.php
    - .htaccess
    - js/
    - img/
- server.php
- vendor/
- workbench/

###执行流程
1. 入口文件 laravel/public/index.php
2. 加载Composer和框架文件 laravel/bootstrap/autoload.php 
    - laravel/vendor/autoload.php
    - laravel/bootstrap/start.php
    - laravel/bootstrap/paths.php
3. 启动框架
4. 配置文件 laravel/app/config/
5. 全局启动文件 laravel/app/start/global.php
6. 过滤器配置文件 laravel/app/filters.php
7. 路由配置文件 laravel/app/routes.php
8. Route --> Filter --> MVC 执行 

###Route
路由，Laravel中所有的访问都需要在route中注册。

基本路由：
```php
<?php
//文件：/app/routes.php   
Route::get('/',function(){
	return "Hello world";
});
Route::post();
Route::match(array('get','post'),'/',function(){});
Route::any('/',function(){});
```
带参数，以及参数可选：
```php
<?php
Route::get('user/{name}',function($name){});
Route::get('user/{name?}',function($name='default'){});
```
正则表达式验证：
```php
<?php
Route::get('user/{name}',function($name){})->where('name','[A-Za-z]+');
Route::get('user/{id}/{name}',function($name){
})->where(array('id'=>'[0-9]+','name'=>'[A-Za-z]+'));
```
绑定单个控制器-方法：
```php
Route::get('/','IndexController@actionname');
```
绑定控制器(restful controller)，方法形式为 getActionname，posetActionname，缺省时为 getIndex，postIndex：
```php
Route::controller('controller','nameController');
```
为Route规则取别名：
```php
Route::get('route/name',array('as'=>'routename',function(){}));
Route::get('route/name',array('as'=>'rourename','uses'=>'controller@action'));
//别名的使用，生成到该路由的url路径
$url = URL::route('routename');
```
###Controller
Laravel的控制器，输出结果时，有Response、Redirect、View、字符串等，视图是一个对象，和Yii的输出流控制的视图实现不同。

当控制器-方法有return时，视图输出return的值或者视图对象。若没有return值，视图采用Layout。
```php
//文件：/app/controller/BaseController.php
<?php
class BaseController extends Controller {
	protected function setupLayout(){
		if ( ! is_null($this->layout)){
			$this->layout = View::make($this->layout);
		}
	}
}
```
Layout的定义可以在BaseController或者其他自定义的控制器中，然后别的控制器继承。
```php
<?php
class DemoController extends  BaseController{
	public function  getIndex(){
    	//产生一个到'控制器@方法'的链接，需在route中已注册
    	$url = URL::action('demoController@getIndex');
        $url = action('demoController@getIndex');
		//视图
        return View::make('hello',array('url'=>$url));
    }
    //定义方法的过滤器filter,过滤器在 /app/filters.php中定义
    public function __contruct(){
    	$this->beforeFilter('needlogin',array('only'=>array(
        	'getIndex'
        )));
    }
    //访问不存在的方法时，调用
    public function missingMethod($parameters = array()){
    }
}
```
###Filter
过滤器filter一般定义在 /app/filters.php中。可以以如下的方式定义一个过滤器：
```php
Route::filer('needlogin',function(){
	if(!demouser::isLogin()){
    	//有return，则输出return，终止程序；无return，继续执行
    	return 'No Access!';
    }
});
```
###Input & Cookie & Session
请求的参数，统一用Input操作。get和post的数据均用Input::get()获取。
```php
$name = Input::get('name');
$name = Input::get('name','defaultname');
if (Input::has("name")) {}
$inputArray = Input::all();
$inputArray = Input::only('username','passwd');

$file = Input::file('photo');
Input::file('photo')->move($destinationPath);
Input::file('photo')->move($destinationPath, $fileName);
// ...
```
Laravel的Cookie都经过加密处理。读取和设置Cookie的使用。
```php
$value = Cookie::get('cookieKey');

Cookie::queue($key,$value,$minutes);
```
Laravel中，Session的保存有很多种方式。通过 app/config/session.php 配置，有文件保存（在app/storage/sessions/目录下）、数据库、Redis、Memcached、Cookie。Session的使用：
```php
Session::put('key', 'value');
Session::push('user.teams', 'developers');   //数组
$value = Session::get('key');
$value = Session::get('key', 'default');
$value = Session::get('key', function() { return 'default'; });  //回调函数
```
###Responses & Redirect
除了简单的字符串和视图输出，Laravel还封装了许多响应以及重定向。

一些Response：
```php
<?php
Route::get('/',function(){
	//输出字符串
    return 'string';
    //header
    $response = Response::make('contentString',200);
    $response->header('Content-Type','something');
    return $reponse;
    //视图
    return Response::view('hello')->header('Content-Type', $type);
    //json
    return Response::json(array());
    //download
    return Response::download($pathToFile);
});
```
重定向Redirect：
```php
Route::get('redirect',function(){
	//url
	return Redirect::to('user/login');
    //route
    return Redirect::route('login');
    //controller  需要在route中以注册
    return Redirect::action('HomeController@index');
    return Redirect::action('UserController@profile', array('user' => 1));
});
```
###View & Layout
视图和布局在Laravel中是等效的，在/app/view/目录下，以.php或者.blade.php后缀结尾。

要使用laravel自带的模板引擎需用.blade.php结尾。

使用视图：
```php
View::make('dir.viewname');
```
其中 dir.viewname 对应的路径为:app/view/dir/viewname.php 或者  app/view/dir/viewname.blade.php

为视图赋值：
```php
<?php
Route::get('/',function(){
	if (View::exits('filename')){};
	$view = View::make('viewname',array('vKey'=>'vValue'));
    //或者
    $view = View::make('viewname');
    $view->vKey = 'value';
    return $view;
});
```
Layout的使用：
```php
<?php
class DemoController extends BaseController{
	//-------------BaseController has--------------
	protected function setupLayout(){
    	if (!is_null($this->layout)){
        	$this->layout = View::make($this->layout);
        }
    }
    //-------------BaseController has end----------
    
    public $layout = 'layout.master';
    
    public function getIndex(){
    	$this->layout->title = "title";
        $this->layout->content = View::make('hi);
        //  使用Layout不需要return；
    }
}
```
Blade模版的使用：
```php
@foreach($users as $user)
@endforeach

@if(isset($oneV))
@else
@endif

{{ HTML::script('js/jsfile.js') }}
{{{ $name }}}
{{ $content }}
//--------Use in the html----------
$url=asset('img/photo.jpg');
//In view file Html
echo HTML::style('css/cssfile.css');
echo HTML::script('js/jsfile.js');
echo HTML::image('img/img.jpg');
//<link media="all" type="text/css" rel="stylesheet" href="http://10.210.226.237:8000/css/cssfile.css">
//<script src="http://10.210.226.237:8000/js/jsfile.js"></script>
//<img src="http://10.210.226.237:8000/img/img.jps">
```
Laravel中的一些路径
```php
//--------Some path----------------
app_path();
base_path();
public_path();
storage_path();
```
###Database & ORM
数据库的定义在/app/config/database.php

基本的sql使用：
```php
<?php
//---------------------Base use----------------------
DB::select('select * from tablename where id=?',[1]); //return an array
DB::inset('insert into tablename (id,col1) value (?,?)',[1,'val']);
DB::update();  //return numbers
DB::delete();  //return numbers
//running a generral statement
DB::statement('drop table tablename');

//DB 事务处理
DB::transaction(function(){
	//do something
});
//或者
DB::beginTransaction();
DB::rollback();
DB::commit();

// 使用另一个连接
DB::connnection('connectname')->select('sql');
```
查询构造的方式使用：
```php
//----------------------Query build-------------------
DB::table('tablename')->get();
DB::table('tablename')->where('name','val')->first();
DB::table('tablename')->lists('col1','col2');
$query = DB::table('tablename')->select('col1','col2');
$query = $query->addSelect('col3')->where('col1','val');
$query = $query->orWhere('col','val2')->distinct()
			->orderBy()->groupBy()->having()->get();
DB::table('name')->skip(4)->take(4)->get();//offet and limit

DB::table('name')->insert(array());
DB::table('name')->insertGetId(array());  //return primary key
?>
```
ORM,对象关系模型，相当于Yii的 ActiveRecord，定义在/app/models/目录下：
```php
<?php
//---------------------Eloquent ORM ------------------
class User extends Eloquent{
	protected $table = "user";
	protected $fillable = array();  //can be used
    protected $guarded = array();   //can't be used
	public $timestamps = false;  //Don't use create_at ,updated_at
    
    //self define scop ||  can use  User::women('w')->all();
    public function scopeWomen($query,$param='w'){
    	return $query->where('gender','=',$param);
    }
    //relation  
    //one to one
    //one to many
    //many to many
    //has many through
    //......
}
```
在route或者controller中使用：
```php
//use in controller or other file
$users = User::all();
$users = User::orderBy('id','desc')->get();
$userone = User::find(1);  //primary key
echo $userone->name;

$model = User::findOrFail(1);  //Not find ,throw ModelNotFoundException 
// use ModelNotFoundException
use Illuminate\Database\Eloquent\ModelNotFoundException;
App::error(function(ModelNotFoundException $e)
{
    return Response::make('Not Found', 404);
});

$count = User::where('name','=','thename')->count();
//An other connection
$user = User::on('con-name')->find(1);
$user->name = "new name";
$user->save();
$user = User::create(array('name'=>'the name','email'=>'blabla'));
$user->push();//And save the relationships;
$user->delete();
User::destory(1);  //destory by primary key
```