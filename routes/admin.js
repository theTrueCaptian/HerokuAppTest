//Maeda Hanafi
//deals with admin stuff
//routes to main admin page
//takes in db conn and rss parser
var admin = function(inconn, inscanner){
	var fs=require('fs');
	var ejs = require('ejs');
 
	var conn = inconn; //database connection
	var rssParser = inscanner;	//scanner that scans an rss
 	var regions, blogs, posts;
	
	var init=function(app){
		console.log("initing in the admin");
 	};
	 
	function adminmain(req, res){
		
		getAllRegions(
			function(err, result){	//callback for getting all regions
				console.log(""+err);
	
				if(result.rowCount>=1){				 
					regions = result.rows;				 
					getAllBlogs(	
						function(err, result2){	//callback for getting all blogs
							console.log(""+err);	
							if(result2.rowCount>=1){
								blogs = result2.rows; 
								getAllBlogPosts(
									function(err, result3){	//callback for getting all blog posts
										console.log(""+err);											
										if(result3.rowCount>=1){
											posts = result3.rows; 
 											sendLayout(req, res, regions, blogs, posts);
										}else{
											//var page_html = ejs.render(ejs_file, { region:regions, blog:blogs, post:[]});
											//res.render('layout', {body:page_html});
											sendLayout(req, res,regions, blogs, []);
										}
									}
								);
								
								
							}else{
								//var page_html = ejs.render(ejs_file, { region:regions, blog:[], post:[]});
								//res.render('layout', {body:page_html});
								sendLayout(req, res, regions, [], [] );
							}
						}					
					);
					
 				}else{
					res.redirect('/admin');
				}
				
 			}		
		);
		
	};
	
	function sendLayout(req,res, inregion, inblog, inpost){
		var file=__dirname+'/../views/admin.ejs';
		console.log('\t :: Express :: file requested : ' + file+' '+req.path);
		var ejs_file = fs.readFileSync(file, 'utf-8');
		
		var file2=__dirname+'/../views/adminSideMenu.ejs';
 		var ejs_file2 = fs.readFileSync(file2, 'utf-8');		
		var rendersidemenu = ejs.render(ejs_file2, {});
		
		
		var page_html = ejs.render(ejs_file, { region:inregion, blog:inblog, post:inpost, adminSideMenu:rendersidemenu});
		res.render('layout', {body:page_html});
	};
	
	//called when an rss link is added
	function addRSS(req, res){
		//console.log("we out here with rss:"+req.body.show); 
		//grab the region id first
		findRegionByRegion(req.body.region, 
			function(err, result){ 	//callback for finding region id
				if(err){ 
					console.log(""+err);
				}else{
					if(result.rowCount>=1){ 
						var regionid = result.rows[0]; 
						//console.log("region id:"+regionid["REGION_ID"]);
						 
						insertBlog(req.body.blog_name, req.body.show, req.body.link, 4, regionid["REGION_ID"],
							function(err, result2){	//callback for inserting a blog  link
								if(err==null){
									//find blog id first
									findBlogIdByRSSLink(req.body.link, 
										function(err, result3){	//callback for finding blog id
											if(err){ 	
												console.log(""+err);
											}else{
												if(result.rowCount>=1){ 
													var blog_id = result3.rows[0]; 
													console.log("blog_id id:"+blog_id["BLOG_ID"]);
													//scan and insert its blog post
													rssParser.grabByURL(req.body.show, blog_id["BLOG_ID"], req.body.link, 4);
												}
											}
										}									
									);
								}else{
									console.log(""+err); 							
								}
								
							}		
						);
					};
				};
				res.redirect('/admin');
			}
		);
	};
	
	function regionDashboard(req, res){
		//send user the region dashboard file***********************WORK ON THIS
	};
 
	//placing the blog posts inside the db

 
	function deleteRSS(req, res){
		deleteBlogByBlogId(req.body.blog_id,
			function(err, result){
				if(err) console.log(err);
				res.redirect('/admin');
			}
		);
	};
	
	
	function deleteBlogByBlogId(blog_id, callback){
		var query = conn.queryParam("DELETE FROM \"BLOGS\" WHERE \"BLOG_ID\"=$1",[blog_id],callback);
		return query;
	};
	
	function getAllRegions(callback){
		var query = conn.query("SELECT * FROM \"REGION\"",callback);
		return query;
	};
	
	function getAllBlogs(callback){
		var query = conn.query("SELECT * FROM \"BLOGS\"",callback);
		return query;
	};
	
	function getAllBlogPosts(callback){
		var query = conn.query("SELECT * FROM \"BLOG_POST\"",callback);
		return query;
	};
	
	function findRegionByRegion(region, callback){
		var query = conn.queryParam("SELECT \"REGION_ID\" FROM \"REGION\" WHERE \"REGION\"= $1",[region],callback);
		return query;
	};
	
	function findBlogIdByRSSLink(URL, callback){
		var query = conn.queryParam("SELECT \"BLOG_ID\" FROM \"BLOGS\" WHERE \"LINK\"=$1",[URL],callback);
		return query;
	};
	
	function insertBlog(blogname, show, link, user_id, region_id, callback){		
		//ALERT! use params to protect from sql injection!!
 		//var query = conn.query("INSERT INTO \"BLOGS\" (\"BLOG_NAME\", \"SHOW\", \"LINK\", \"USER_ID\", \"REGION_ID\") VALUES (\'"+blogname+"\', "+show+", \'"+link+"\', "+user_id+", "+region_id+");" , callback);
		var query = conn.queryParam("INSERT INTO \"BLOGS\" (\"BLOG_NAME\", \"SHOW\", \"LINK\", \"USER_ID\", \"REGION_ID\") VALUES ($1, $2, $3, $4, $5);" , [blogname, show, link, user_id,region_id] ,callback);
		
		return query;
	};
	
	/*function insertBlogPost(jsonContent, show, blog_id, link, date, guid, user_id, callback){		
		//2013-12-23T14:57:28.000Z
		//var query = conn.query("INSERT INTO \"BLOG_POST\" (\"CONTENT\", \"SHOW\", \"BLOG_ID\", \"LINK\", \"DATE\", \"GUID\", \"USER_ID\") VALUES (\'"+jsonContent+"\', "+show+", "+blog_id+", \'"+link+"\', \'"+date+"\',\'"+guid+"\', "+user_id+");" , callback);
		var query = conn.queryParam("INSERT INTO \"BLOG_POST\" (\"CONTENT\", \"SHOW\", \"BLOG_ID\", \"LINK\", \"DATE\", \"GUID\", \"USER_ID\") VALUES ($1, $2, $3, $4, $5,$6,$7);" , [jsonContent, show, blog_id, link, date, guid, user_id],callback);
		
		return query;
	};*/
	 
	return  {
		init:init ,
		adminmain:adminmain,
		addRSS:addRSS,
		deleteRSS:deleteRSS,
		regionDashboard:regionDashboard
		}
};
//allow others to access this file
exports.admin = admin;

