
/*
 * GET  page under menu folder
 */
 
var menu = function( inauth){
	var fs=require('fs');
	var ejs = require('ejs');
	var auth = inauth;
		
	function aboutus(req, res){
		
		
		//res.render('index', { title: 'Express' });
		var ejs_file = fs.readFileSync(__dirname+'/../views/aboutus.ejs', 'utf-8');
		var page_html = ejs.render(ejs_file, { title: 'The index page!', admin:auth.isAdminLoggedIn() });
		res.render('layout', {body:page_html});
	};
	return  {
		aboutus:aboutus
	}
};
//allow others to access this file
exports.menu = menu;

/*
  exports.aboutus = function(req, res){
	var fs=require('fs');
	var ejs = require('ejs');
	
	
	//res.render('index', { title: 'Express' });
	var ejs_file = fs.readFileSync(__dirname+'/../views/aboutus.ejs', 'utf-8');
	var page_html = ejs.render(ejs_file, { title: 'The index page!' });
	res.render('layout', {body:page_html});
};
	 */
 
 
/*exports.menu = function(req, res){
	var fs=require('fs');
	var ejs = require('ejs');
	//res.render('index', { title: 'The index page!' });
	var file = __dirname+'/../'+req.path+'.ejs';//req.params[req.params.length-1];
 	console.log('\t :: Express :: file requested : ' + file+' '+req.path);
	var ejs_file = fs.readFileSync(file, 'utf-8');
	var page_html = ejs.render(ejs_file, { title: 'The index page!' });
	res.render('layout', {body:page_html});
};*/