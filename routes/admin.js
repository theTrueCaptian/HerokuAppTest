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
	 
	 //Functions related to blogs management
	function adminmain(req, res){
		
		getAllRegions(function(err, result){	//callback for getting all regions
			console.log(""+err);

			if(result.rowCount>=1){				 
				regions = result.rows;				 
				getAllBlogs(function(err, result2){	//callback for getting all blogs
					console.log(""+err);	
					if(result2.rowCount>=1){
						blogs = result2.rows; 
						getAllBlogPosts(function(err, result3){	//callback for getting all blog posts
							console.log(""+err);											
							if(result3.rowCount>=1){
								posts = result3.rows; 
								sendMainLayout(req, res, regions, blogs, posts);
							}else{
								//var page_html = ejs.render(ejs_file, { region:regions, blog:blogs, post:[]});
								//res.render('layout', {body:page_html});
								sendMainLayout(req, res,regions, blogs, []);
							}
						});
						
					}else{
						//var page_html = ejs.render(ejs_file, { region:regions, blog:[], post:[]});
						//res.render('layout', {body:page_html});
						sendMainLayout(req, res, regions, [], [] );
					}
				});
				
			}else{
				res.redirect('/admin');
			}
				
 		});
		
	};
	
	function sendMainLayout(req,res, inregion, inblog, inpost){
		var file=__dirname+'/../views/admin.ejs';
		console.log('\t :: Express :: file requested : ' + file+' '+req.path);
		var ejs_file = fs.readFileSync(file, 'utf-8');
		
		var file2=__dirname+'/../views/adminSideMenu.ejs';
 		var ejs_file2 = fs.readFileSync(file2, 'utf-8');		
		var rendersidemenu = ejs.render(ejs_file2, {});
		
		
		var page_html = ejs.render(ejs_file, { region:inregion, blog:inblog, post:inpost, adminSideMenu:rendersidemenu});
		res.render('layout', {body:page_html});
	};
	
	//Called when an rss link is added
	function addRSS(req, res){
		//console.log("we out here with rss:"+req.body.show); 
		//grab the region id first
		findRegionByRegion(req.body.region, function(err, result){ 	//callback for finding region id
			if(err){ 
				console.log(""+err);
			}else{
				if(result.rowCount>=1){ 
					var regionid = result.rows[0]; 
					//console.log("region id:"+regionid["REGION_ID"]);
					 
					insertBlog(req.body.blog_name, req.body.show, req.body.link, 4, regionid["REGION_ID"],function(err, result2){	//callback for inserting a blog  link
						if(err==null){
							//find blog id first
							findBlogIdByRSSLink(req.body.link, function(err, result3){	//callback for finding blog id
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
							});
						}else{
							console.log(""+err); 							
						}
							
					});
				};
			};
			res.redirect('/admin');
		});
	};
	
	function deleteRSS(req, res){
		deleteBlogByBlogId(req.body.blog_id,
			function(err, result){
				if(err) console.log(err);
				res.redirect('/admin');
			}
		);
	};
	
	function toggleShowBlog(req, res){
		 toggleBlogShowGivenBlogId(req.body.blog_id, req.body.show, function(err, result){
			if(err) console.log(err);
			res.redirect('/admin');
		 });
	};
	
	//Region Dashboard
	function regionDashboard(req, res){
 		getAllRegions(function(err, result){	//callback for getting all regions
			console.log(""+err);											
			if(result.rowCount>=1){
				regions = result.rows; 
				sendRegionLayout(req, res, regions );
			}else{
				 sendRegionLayout(req, res,  []);
			}
		});
	};
	
	function sendRegionLayout(req,res, inregion){
		var file=__dirname+'/../views/adminRegion.ejs';
		console.log('\t :: Express :: file requested : ' + file+' '+req.path);
		var ejs_file = fs.readFileSync(file, 'utf-8');
		
		var file2=__dirname+'/../views/adminSideMenu.ejs';
 		var ejs_file2 = fs.readFileSync(file2, 'utf-8');		
		var rendersidemenu = ejs.render(ejs_file2, {});
		
		
		var page_html = ejs.render(ejs_file, { region:inregion, adminSideMenu:rendersidemenu});
		res.render('layout', {body:page_html});
	};
 
	function deleteRegion(req, res){
		deleteRegionByRegionId(req.body.region_id,
			function(err, result){
				if(err) console.log(err);
				res.redirect('/manageRegion');
			}
		);
	};
	
	function addRegion(req, res){
		insertRegion(req.body.region_name,
			function(err, result){
				if(err) console.log(err);
				res.redirect('/manageRegion');
			}
		);
	};
 
	//Blogpost Management
	function blogpostDashboard(req, res){
 		getAllBlogPosts(function(err, result){	//callback for getting all regions
			console.log(""+err);											
			if(result.rowCount>=1){
				posts = result.rows; 
				sendBlogpostLayout(req, res, posts );
			}else{
				 sendBlogpostLayout(req, res,  []);
			}
		});
	};
	
	function sendBlogpostLayout(req,res, inblogposts){
		var file=__dirname+'/../views/manageBlogposts.ejs';
		console.log('\t :: Express :: file requested : ' + file+' '+req.path);
		var ejs_file = fs.readFileSync(file, 'utf-8');
		
		var file2=__dirname+'/../views/adminSideMenu.ejs';
 		var ejs_file2 = fs.readFileSync(file2, 'utf-8');		
		var rendersidemenu = ejs.render(ejs_file2, {});
		
		
		var page_html = ejs.render(ejs_file, { blogpost:inblogposts, adminSideMenu:rendersidemenu});
		res.render('layout', {body:page_html});
	};
	
 	function toggleShow(req,res){
		//update the a given blog post to toggle its show
 		togglePostShowGivenPostId(req.body.blogpost_id, req.body.show, function(err, result){
			if(err) console.log(err);
			res.redirect('/manageBlogposts');
		
		});
	};
 	
	//Database Queries
	function deleteBlogByBlogId(blog_id, callback){
		var query = conn.queryParam("DELETE FROM \"BLOGS\" WHERE \"BLOG_ID\"=$1",[blog_id],callback);
		return query;
	};
	
	function deleteRegionByRegionId(region_id, callback){
		var query = conn.queryParam("DELETE FROM \"REGION\" WHERE \"REGION_ID\"=$1",[region_id],callback);
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
	
	function insertRegion(region_name, callback){		
		//ALERT! use params to protect from sql injection!!
 		var query = conn.queryParam("INSERT INTO \"REGION\" (\"REGION\") VALUES ($1);" , [region_name] ,callback);
		
		return query;
	};
	
	function insertBlog(blogname, show, link, user_id, region_id, callback){		
		//ALERT! use params to protect from sql injection!!
 		//var query = conn.query("INSERT INTO \"BLOGS\" (\"BLOG_NAME\", \"SHOW\", \"LINK\", \"USER_ID\", \"REGION_ID\") VALUES (\'"+blogname+"\', "+show+", \'"+link+"\', "+user_id+", "+region_id+");" , callback);
		var query = conn.queryParam("INSERT INTO \"BLOGS\" (\"BLOG_NAME\", \"SHOW\", \"LINK\", \"USER_ID\", \"REGION_ID\") VALUES ($1, $2, $3, $4, $5);" , [blogname, show, link, user_id,region_id] ,callback);
		
		return query;
	};
	
	function togglePostShowGivenPostId(postid, newshow, callback){		
		var query = conn.queryParam("UPDATE \"BLOG_POST\" SET \"SHOW\"=$1 WHERE \"BLOG_POST_ID\"=$2;" , [newshow, postid] ,callback);
		
		return query;
	};
	
	function toggleBlogShowGivenBlogId(blogid, newshow, callback){		
		var query = conn.queryParam("UPDATE \"BLOGS\" SET \"SHOW\"=$1 WHERE \"BLOG_ID\"=$2;" , [newshow, blogid] ,callback);
		
		return query;
	};
	return  {
		init:init ,
		adminmain:adminmain,
		addRSS:addRSS,
		deleteRSS:deleteRSS,
		toggleShowBlog:toggleShowBlog,
		regionDashboard:regionDashboard,
		deleteRegion:deleteRegion,
		addRegion:addRegion,
		blogpostDashboard:blogpostDashboard,
		toggleShow:toggleShow
 		}
};
//allow others to access this file
exports.admin = admin;

