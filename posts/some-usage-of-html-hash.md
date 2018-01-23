# Html之hash
## 关于hash
对于百度云，网易云音乐之类的网页，整个网站都只用了一个地址，接不同的hash(即#之后的值)来确定不同的页面。这样处理时，浏览器不会刷新页面，再辅助Ajax，能够使页面有良好的体验。

## js操作hash
获取hash值。
```js
var myHash = window.location.hash;
```
改变hash。
```js
window.location.hash = "nexthash";
```
监听hash改变。window.onhashchange 在ie6,ie7中不可用，可是使用一个setInterval定期检查hash是否改变。
```js
window.onhashchange = function(){
    alert("hash change");
};
```