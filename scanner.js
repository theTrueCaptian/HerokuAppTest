 
//Maeda Hanafi
//Continuously scan the rss links from the database. Also limits the database

var scanner = function(incoonn, inrssparser){
	var conn = incoonn;
	var rssParser = inrssparser;
	var lastScanned;
	var moment = require('moment');
	
	var MAX_BLOG_POSTS = 2000;
	var SCAN_GAP = 300000; //5 minutes

	//Must be called to start scanning every 5 minuts
	function init(){
		setInterval(function() { startScanner();	 }, SCAN_GAP );			
	};
	
	function startScanner(){
	
		console.log("Scanning");
		moment().format();
		lastScanned = moment();
		
		//Grab All Links and corresponding blogID from the database, and scann that thing!
		conn.getAllBlogLinkAndBlogId(function(err, result){ 	//callback for grabbing all posts
			if(result.rowCount>=1){
				var resultrows = result.rows;
 				
				//Scans each blog
				resultrows.forEach(function(item){
					//Calling this rssParser.scan would add a new blogpost along with its auto tags that are determined in rssParser.scan
					 rssParser.scan(item["BLOG_ID"], item["LINK"], item["SHOW"], item["USER_ID"], lastScanned);
				});
			}
		});
		
		//Limits the number of blog posts stored in the database
		limitation();
	};
	
	function limitation(){
		console.log("Deciding on limitation");
		//Limit the database
		conn.getAllBlogPosts(function(err, result){ 	//callback for grabbing all posts
			if(err){console.log(err);}
			if(result.rowCount>=MAX_BLOG_POSTS){//If the number of blog posts exceed the limit delete those old ones
				var resultrows = result.rows;
				var record = resultrows[MAX_BLOG_POSTS-1];
				var datepast = record["DATE"];
				conn.deleteBlogPostsGivenDatePast(datepast, function(err, result){ 
					if(err){console.log(err);}
					console.log("LIMITATION: DELETED BLOG_POSTs");
				});
			}
		});
	};
	
	
	//Queries ***Needs testing along with a few others that are noted in database.js
	/*function getAllBlogLinkAndBlogId(callback){
		var query = conn.query("SELECT \"LINK\", \"BLOG_ID\", \"SHOW\", \"USER_ID\" FROM \"BLOGS\" WHERE \"SHOW\"=true",callback);
		return query;
	};*/
	 
	
	return  {
		init:init,
		 startScanner:startScanner,
		 limitation:limitation
	}
};
//allow others to access this file
exports.scanner = scanner;