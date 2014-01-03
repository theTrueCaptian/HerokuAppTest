
/*
 * GET home page.
 */

exports.index = function(req, res){
	var fs=require('fs');
	var ejs = require('ejs');
	//res.render('index', { title: 'Express' });
	var ejs_file = fs.readFileSync('views/index.ejs', 'utf-8');
	var page_html = ejs.render(ejs_file, { title: 'The index page!' });
	res.render('layout', {body:page_html});
};