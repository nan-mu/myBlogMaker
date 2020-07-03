"use strict";

var _swig = require("swig");

var _marked = require("marked");

var _fs = require("fs");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rendererMD = new _marked.Renderer();
(0, _marked.setOptions)({ //makedown渲染引擎的默认配置
	renderer: rendererMD,
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false
});

var ArtMd = function ArtMd(context, intr, title, date, tags, mathjax, owncss, categories, urlname) {
	_classCallCheck(this, ArtMd);

	this.context = context;
	this.intr = intr;
	this.title = title;
	this.date = date;
	this.tags = tags;
	this.mathjax = mathjax;
	this.owncss = owncss;
	this.categories = categories;
	this.urlname = urlname;
};

var staticOut = function staticOut(_site, _page) {
	var tpl = (0, _swig.compileFile)('template/layout.html');
	var tpl_home_out = tpl({
		site: {
			title: _site["title"]
		},
		page: {
			title: _page["title"]
		}
	});
	return tpl_home_out;
};

var makerOut = function makerOut(path) {
	(0, _fs.readFile)(path, function (err, data) {
		if (err) throw err;
		var config = String(data).match(/---(\r\n|\n|.)*---/)[0].split(/\r\n|\n/).slice(1, -1); //匹配文章预设
		var intr = String(data).replace(/---(\r\n|\n|.)*---/, "").match(/(\r\n|\n|.)*<!-- more -->/)[0].replace(/<!-- more -->/, ""); //匹配文章导语, 注: intr 是introdtion的缩写
		for (var i = 0; i < config.length; i++) {
			config[i] = "\"" + config[i].replace(": ", "\": \"") + "\"";
		} //将预设改成string的样子
		config = JSON.parse("{" + config + "}"); //将预设改为json
		config.tags = config.tags ? String(config.tags).substring(1, String(config.tags).length - 1).split(",") : undefined; //将tags的格式改为array, 这里要注意识别undefined
		console.log(config);
		return new ArtMd(String(data).replace(/---(\r\n|\n|.)*---/, " ").split("<!-- more -->"), intr, config.title, config.date, config.tags, config.mathjax, config.owncss, config.categories, config.urlname);
	});
};

var main = function main(env) {
	//console.log(env);
	(0, _fs.readdir)("./articles", function (err, files) {
		if (err) throw err;
		files.forEach(function (data) {
			var artMd = makerOut("./articles/" + data);
			console.log(artMd);
			//console.log(artHtml);
		});
	}); //扫描需要转换的文章
};

main(process.env);