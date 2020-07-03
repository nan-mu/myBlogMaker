# 开发笔记

## html部分

### swig

* `site`, 用于存储站点信息

	* `sit.title`, 用于存储站点名字

* `page`, 用于存储正在浏览的页面的信息  

	* `page.title`, 用于存储页面名字

	* `page.owncss`, 用于存储页面自带的css信息
	
		* `page.owncss.context`, 用于存储页面css信息的地址, 要记得写编译自己css的模块