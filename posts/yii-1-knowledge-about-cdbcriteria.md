#Yii之CDbCriteria
[Yii1.1类参考手册](http://www.yiichina.com/api/1.1/CDbCriteria)
```
//建立
$ctr = new CDbCriteria();
//where
//=
$ctr->addCondition("col=1");
$ctr->addCondition("coll=1",'OR');
//IN
$ctr->addInCondition('id',array(1,2,3));  //where id IN (1,2,3)
$ctr->addNotInCondition('id',array(1,2,3));  //NOT IN
// name like '%theSearchStr%'
$ctr->addSearchCondition('name','theSearchStr');

//pre and params
$ctr->addCondition("id = :id");
$ctr->params[':id'] = $theId;

//基本的 sql 语句部分
$ctr->condition = "id != 3 AND name = 'name' ";
$ctr->select = "id,name,desc";
$ctr->join = "left join tableName on t.id = tableName.columnName";
$ctr->with = "xxx";  //relations
$ctr->limit = 10;
$ctr->offset = 100;
$ctr->order = "id desc,name asc";
$ctr->group = "colName";
$ctr->distinct = false;  //select DISTINCT id,name,desc  是否distinct
```