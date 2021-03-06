
/*
 * GET  page under menu folder
 */
 
var menu = function( inauth, inconn){
	var fs=require('fs');
	var ejs = require('ejs');
	var auth = inauth;
	var conn = inconn;
	var blogs;
	
	function aboutus(req, res){
		
		
		//res.render('index', { title: 'Express' });
		var ejs_file = fs.readFileSync(__dirname+'/../views/aboutus.ejs', 'utf-8');
		var page_html = ejs.render(ejs_file, { title: 'The index page!', admin:auth.isAdminLoggedIn() });
		res.render('layout', {body:page_html});
	};
	
	function faq(req, res){ 
		var ejs_file = fs.readFileSync(__dirname+'/../views/faq.ejs', 'utf-8');
		var page_html = ejs.render(ejs_file, {  });
		res.render('layout', {body:page_html});
	};
	function directory(req, res){ 
		conn.getAllBlogs(	
			function(err, result2){	//callback for getting all blogs
				console.log(""+err);	
				var ejs_file = fs.readFileSync(__dirname+'/../views/directory.ejs', 'utf-8');
				if(result2.rowCount>=1){
					blogs = result2.rows; 
					 
					
					var page_html = ejs.render(ejs_file, { blog:blogs });
					res.render('layout', {body:page_html});
						 
				}else{
					var page_html = ejs.render(ejs_file, {  blog:[] });
					res.render('layout', {body:page_html});
				}
			}	
		);
		
	};
	
	return  {
		aboutus:aboutus,
		faq:faq,
		directory:directory
	}
};
//allow others to access this file
exports.menu = menu;
