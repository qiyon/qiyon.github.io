# mysql之distinct&group by
## distinct
```sql
select distinct name from user;
```

## group by 
```sql
select * from user group by  name;
```

PS: 对于经过 group 后的条件筛选使用 having (where 作用与 group 前)