#从vagrantcloud.com下载box
###vagrant默认
可以通过vagrant命令行`vagrant box add <boxname>`可以获取对应的http地址
###vagrantcloud
vagrant的Box都可以在[vagrantcloud.com](http://vagrantcloud.com)上面可以找到，现在会跳转到这个网站[atlas.hashicorp.com/boxes/search](https://atlas.hashicorp.com/boxes/search)

可以在那里搜索别人打包制作好的Box，

或者，一般一个box的名字为`<foo>/<bar>`。

则有地址：`atlas.hashicorp.com/<foo>/boxes/<bar>`

选择相应的版本，则进入地址：`atlas.hashicorp.com/<foo>/boxes/<bor>/versions/<version>`

一般有vitualBox的下载地址：`atlas.hashicorp.com/<foo>/boxes/<bor>/versions/<version>/providers/virtualbox.box`


这样就可以直接在web端搜索并下载Box

###示例
如下载`ubuntu14.04`的64位版本，

搜索找到主页[https://atlas.hashicorp.com/ubuntu/boxes/trusty64](https://atlas.hashicorp.com/ubuntu/boxes/trusty64)，

选择一个版本，如`20150609.0.0`，则有版本页面[https://atlas.hashicorp.com/ubuntu/boxes/trusty64/versions/20150609.0.0](https://atlas.hashicorp.com/ubuntu/boxes/trusty64/versions/20150609.0.0)，

并且有VBox包的下载地址为[https://atlas.hashicorp.com/ubuntu/boxes/trusty64/versions/20150609.0.0/providers/virtualbox.box](https://atlas.hashicorp.com/ubuntu/boxes/trusty64/versions/20150609.0.0/providers/virtualbox.box)