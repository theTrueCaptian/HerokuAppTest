
/*
 * GET  page under menu folder
 */

exports.menu = function(req, res){
	var fs=require('fs');
	var ejs = require('ejs');
	//res.render('index', { title: 'The index page!' });
	var file = __dirname+'/../'+req.path+'.ejs';//req.params[req.params.length-1];
 	console.log('\t :: Express :: file requested : ' + file+' '+req.path);
	var ejs_file = fs.readFileSync(file, 'utf-8');
	var page_html = ejs.render(ejs_file, { title: 'The index page!' });
	res.render('layout', {body:page_html});
};