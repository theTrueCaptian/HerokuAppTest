
/*
 * GET home page.
 */
 //Maeda Hanafi

var index = function(incoonn){
	var conn = incoonn;
	var allPosts;
	var PAGE_LIMIT = 10;
	
	function sendFile(inbody, res){
		var fs=require('fs');
		var ejs = require('ejs');
		var ejs_file = fs.readFileSync(__dirname+'/../views/index.ejs', 'utf-8');
		var page_html = ejs.render(ejs_file, { body: inbody});
		res.render('layout', {body:page_html});
	};
	
	var indexfileOLD = function(req, res){
		 grabPostsNextTen(
			function(err, result){ 	//callback for grabbing all posts
				if(err){ 
					console.log(""+err);
				}else{
					sendFile(display(result, 1), res);
					 
				}
			}
		);
		
 	};
	var indexfile  = function(req, res){
		grabAllPosts( 
			function(err, result){ 	//callback for grabbing all posts
				if(err){ 
					console.log(""+err);
				}else{
					allPosts = result;
					//limit result to ten
 					sendFile(display(allPosts, 1), res);
 					
					 
				}
			}
		);
		
 	};

	//this was based on date
	function grabNextOLD(req, res){
		console.log("date num from prev:"+req.query.blog_pubdate);
		
		grabNextPostsByDate(req.query.blog_pubdate, req.query.page_num,
			function(err, result){ 	//callback for grabbing all posts
				if(err){ 
					console.log(""+err);
				}else{
					sendFile(display(result, req.query.page_num), res);
				}
			}
		);
	};
	
	//grab the next set of posts based on a range of blog posts (requires an inner sql)
	function grabNext(req, res){
		console.log("date num from prev:"+req.query.blog_pubdate);
		//return a result of all blog posts sorted by date desc	
		//then with that result, get the next ten posts that appear after a given blog_post****************************WORK ON THIS
		//but for a given blog post we have to find that blog_post's date, so we can make sure its less than that dudes date
		//
		
		//method 2: grab all posts on the first /index call and then use that same array 
		//to get the next set of posts
		//but this needs to be improved to work with posts constantly added to the db
		//var next = [];
		//fill next in with the blog posts
		
		sendFile(display(allPosts, req.query.page_num), res);
		
		//grabAllPosts(req.query.last_blog_id,
		//grabNextPostsByDate(req.query.blog_pubdate, req.query.page_num,  //old method that works
		//	function(err, result){ 	//callback for grabbing all posts
		//		if(err){ 
		//			console.log(""+err);
		//		}else{
					//how to do inner sql???
		/*			sendFile(display(result, req.query.page_num), res);
				}
			}
		);*/
	};
	
	function display(result, page_num  ){
		var json2html = require('node-json2html'); 
		var transform = {'tag':'p','html':'<div class=".col-md-4" ><div class="text-center"><div class="panel panel-default"><div class="panel-heading"><h2>${title} <p><h3> By ${author}</h3></h2></div> <div class="panel-body"> <p><div class=""> ${description} </div> <div class="panel-footer"><p><bold>Blog source: ${link}</bold> <p> Date Published: ${pubdate} Update: ${date} </div></div></div></div></div>'};
		var total ="";
		var moment = require('moment');
		moment().format();
		if(result.rowCount>=1){
			
			var resultrows = result.rows;
			var last=result.rows[result.rowCount-1];
			
			var first_post=page_num*10, last_post=(page_num*10)+PAGE_LIMIT;
 			//resultrows.forEach(function(item){
			for(var i = first_post ; i <=last_post; i++) {
				//total = total + "<p>"+json2html.transform(item["CONTENT"],transform) ;
				var item = resultrows[i];
				console.log(resultrows[i]);
				total = total + "<p>"+json2html.transform(item["CONTENT"],transform) ;
			};
			//})
			
 			var next_page=parseInt(page_num)+1;
			var prev_page = parseInt(page_num)-1;
			var newDate = moment(last["DATE"]).toISOString(); 
			
 			//console.log("setting blog date:"+last["DATE"]+" "+newDate);
		 
			//if not the first page, add a previous button
			total = total+"<p>";
			if(page_num!=1){
				total = total + "<form role=\"previous\" action=\"/previous\" method=\"get\"><input type=\"hidden\" name=\"page_num\" value="+prev_page+" ><input type=\"hidden\" name=\"last_blog_id\" value="+last["BLOG_ID"]+" ><button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\">Previous</button></form>  ";
			}
			
			total = total + "<form role=\"next\" action=\"/next\" method=\"get\"><input type=\"hidden\" name=\"page_num\" value="+next_page+" ><input type=\"hidden\" name=\"last_blog_id\" value="+last["BLOG_ID"]+" ><input type=\"hidden\" name=\"blog_pubdate\" value=\'"+newDate+"\' ><button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\">Next</button></form>   ";
			
			//console.log(total);
			
		}
		return total;
		
	};
	function grabPostsNextTen( callback){
		var query = conn.query("SELECT * FROM \"BLOG_POST\" WHERE \"SHOW\"=true ORDER BY \"DATE\" DESC LIMIT 10",callback);
		return query;
	};
	
	function grabAllPosts ( callback){
		 
		var query = conn.query("(SELECT * FROM \"BLOG_POST\" WHERE \"SHOW\"=true ORDER BY \"DATE\" DESC) ",callback);
		return query;
	};
	
	/*function grabAllPostsRange (starting_post, last_post, callback){
		 
		var query = conn.query("SELECT * FROM (SELECT * FROM \"BLOG_POST\" WHERE \"SHOW\"=true ORDER BY \"DATE\" DESC) AS \"ALL_POSTS\" ",callback);
		return query;
	};*/
	
	function grabNextPostsByDate(blog_pubdate, page, callback){ 
		var startPt = page * 10;
 		var query = conn.queryParam("SELECT * FROM \"BLOG_POST\" WHERE \"SHOW\"=true AND \"DATE\"<= $1 ORDER BY \"DATE\" DESC LIMIT 10 ",[blog_pubdate],callback);
		return query;
		 
	};
	
 
	return  {
		indexfile:indexfile,
		grabNext:grabNext
		}
};
//allow others to access this file
exports.index = index;
 