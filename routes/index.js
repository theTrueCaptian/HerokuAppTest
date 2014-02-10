
/*
 * GET home page.
	Handles also Next and Previous page
 */
 //Maeda Hanafi

var index = function(incoonn, infeed){
	var conn = incoonn;
	var globalfeed = infeed;
 	var PAGE_LIMIT = 10;
	
	var json2html = require('node-json2html'); 
	var transform = {'tag':'p','html':'<div class=".col-md-4" ><div class="text-center"><div class="panel panel-default"><div class="panel-heading"><h2>${title} <p><h3> By ${author}</h3></h2></div> <div class="panel-body"> <p><div class=""> ${description} <p><!--<a href=${link} target="_blank"><button class="btn btn-primary btn-block " type=\"submit\">More...</button></a>--></div> <div class="panel-footer"><p><bold>Blog source: ${link}</bold> <p> Date Published: ${pubdate}</div></div></div></div></div>'};
		
	var currentRes;	//used to point at current res 
	
	function sendFile(inbody, res){
		var fs=require('fs');
		var ejs = require('ejs');
		var ejs_file = fs.readFileSync(__dirname+'/../views/index.ejs', 'utf-8');
		var page_html = ejs.render(ejs_file, { body: inbody});
		res.render('layout', {body:page_html});
	};
	
	 
	var indexfile  = function(req, res){
		currentRes = res;
		globalfeed.loadLatestPosts(getFirstTen);
		
 	};

	var getFirstTen = function (){
		var firstTen  =  globalfeed.getFirstTen( PAGE_LIMIT);
		sendFile(display(firstTen, true), currentRes);
	};
	
	//grab the next set of posts based on a range of blog posts (requires an inner sql)
	function grabNext(req, res){
		currentRes = res;
		
		//Using global feed
		//Returns the list of posts to display
		var nextposts  = globalfeed.getNext(parseInt(req.query.last_blog_id), PAGE_LIMIT);
		sendFile(display(nextposts, false), res);
 	};
	
	function grabPrevious(req, res){
		currentRes = res;
		//get request: the last post from the previous page that is being requested; the previous page number that is being requested
		//find the post with that blog_id from globalfeed, and get the first ten before it
	
		var nextprevposts  = globalfeed.getPrevious(parseInt(req.query.last_blog_id), PAGE_LIMIT);
		//console.log("getting prev posts"+nextprevposts.length );
		sendFile(display(nextprevposts, false), res);
	};
	
	function display(showPosts, isFirstPage){
		var total ="";
		
		var first = showPosts[0];
		var last = showPosts[showPosts.length-1];
		
		showPosts.forEach(function(item){
			if(item){
				total = total + "<p>"+json2html.transform(item["CONTENT"],transform) ;
			}
		});
		
		//if not the first page, add a previous button
		total = total+"<p><div class=\"row\">";
		if(first && !isFirstPage){
			total = total + "<form role=\"previous\" action=\"/previous\" method=\"get\"><input type=\"hidden\" name=\"last_blog_id\" value="+first["BLOG_POST_ID"]+" ><button class=\"btn btn-primary pull-left\" type=\"submit\">Previous</button></form>  ";
		}
		if(last){
			total = total + "<form role=\"next\" action=\"/next\" method=\"get\"><input type=\"hidden\" name=\"last_blog_id\" value="+last["BLOG_POST_ID"]+" ><button class=\"btn btn-primary pull-right\" type=\"submit\">Next</button></form>   ";
		}
		total = total + "</div>";
		return total
	}
 
	
 
	return  {
		indexfile:indexfile,
		grabNext:grabNext,
		grabPrevious:grabPrevious
		}
};
//allow others to access this file
exports.index = index;
 