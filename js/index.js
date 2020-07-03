import {
	compileFile
} from "swig";
import {
	Renderer,
	setOptions,
	marked
} from "marked";
import {
	readFile,
	readdir
} from "fs";

let rendererMD = new Renderer();
setOptions({ //makedown渲染引擎的默认配置
	renderer: rendererMD,
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false
});

class ArtMd {
	constructor(context, intr, title, date, tags, mathjax, owncss, categories, urlname) {
		this.context = context;
		this.intr = intr;
		this.title = title;
		this.date = date;
		this.tags = tags;
		this.mathjax = mathjax;
		this.owncss = owncss;
		this.categories = categories;
		this.urlname = urlname;
	}
}

const staticOut = (_site, _page) => {
	let tpl = compileFile('template/layout.html');
	let tpl_home_out = tpl({
		site: {
			title: _site["title"]
		},
		page: {
			title: _page["title"]
		}
	})
	return tpl_home_out;
}

const makerOut = (path) => {
	readFile(path, (err, data) => {
		if (err) throw err;
		let config = String(data).match(/---(\r\n|\n|.)*---/)[0].split(/\r\n|\n/).slice(1, -1); //匹配文章预设
		let intr = String(data).replace(/---(\r\n|\n|.)*---/, "").match(/(\r\n|\n|.)*<!-- more -->/)[0].replace(/<!-- more -->/, ""); //匹配文章导语, 注: intr 是introdtion的缩写
		for (let i = 0; i < config.length; i++) config[i] = "\"" + config[i].replace(": ", "\": \"") + "\""; //将预设改成string的样子
		config = JSON.parse("{" + config + "}"); //将预设改为json
		config.tags = config.tags ? String(config.tags).substring(1, String(config.tags).length - 1).split(",") : undefined; //将tags的格式改为array, 这里要注意识别undefined
		console.log(config);
		return new ArtMd(
			String(data).replace(/---(\r\n|\n|.)*---/, " ").split("<!-- more -->"),
			intr,
			config.title,
			config.date,
			config.tags,
			config.mathjax,
			config.owncss,
			config.categories,
			config.urlname
		);
	});
}

const main = function main(env){
	//console.log(env);
	readdir("./articles", (err, files) => {
		if (err) throw err;
		files.forEach((data) => {
			let artMd = makerOut("./articles/" + data);
			console.log(artMd);
			//console.log(artHtml);
		});
	}); //扫描需要转换的文章
}

main(process.env);