# mysql之join
## join & inner join
`join`和`inner join`几乎一致，join的两个表都需要含有符合条件的字段。
## left join
`left join`以join左边的表为基准，不管右边表是否有符合条件，左边的每一行都会存在（对于不存在的字段会置为`NULL`）；左边表一个对应右边表多个，会重复出现，将所有对应情况罗列。
## right join
`right join`与`left join`类似，只是刚好相反。
## full join
`full join`会将所有的对应情况罗列，字段不存在置为`NULL`。