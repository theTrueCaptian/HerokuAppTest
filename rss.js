//MAeda Hanafi
//rss deals with the details of parsing the rss feeds
//There are two parts to the rss: There is one that automatically scans the links when the whole program starts (grabByURL function)
//									The second one is the one that scans the links continusously (scan function)
//The dfference is in the function called
//This is also where the Auto Tags are added to a blogpost as they are added

var rss = function(incoonn){
	var conn = incoonn;
	//Auto tagging algorithms
	var glossary = require("glossary");//(/*{ minFreq: 30, verbose:true }*/) ;
	//This is for cleaning up the html from the string we will operate on
	var sanitizer = require("sanitizer");
	
	//adds all rss content into db 
	//Called when a link is initially added into db
	//Also autotagging done before it is sent into db
	function grabByURL(show, blog_id, URL, user_id ){
		var FeedParser = require("feedparser");
		var request = require('request');
		  
		request(URL)
			.pipe(new FeedParser())
			.on('error', function (error) {
				console.error(error);
			})
			.on('meta', function (meta) {
				//console.log('===== %s =====', meta.title);
				
			})
			.on('readable', function() {
				var stream = this, item;
					
				while (item = stream.read()) {
					//insert blog posts
					//console.log(blog_id+" "+ item.link+" "+ item.pubdate+" "+item.guid+" "+ user_id);
					conn.insertBlogPost(JSON.stringify(item), show, blog_id, item.link, item.pubdate, item.guid, user_id, autotag(stripHTML(item.summary)),
						function(err, result){
							if(err){
								console.log(""+err);
							};
						}
					);
				}
				  
		});
		
	};
	
		
	//Scan a given feed for a guid that doesn't exist in the database, and puts it in db
	function scan(blog_id, URL, show, user_id, lastScanned){ 
 		//Scan URL with feedparser for a guid that doesn't exist in the db yet
		//If one is found then store it into the database
  		
		var FeedParser = require("feedparser");
		var request = require('request');
		
		request(URL)
			.pipe(new FeedParser())
			.on('error', function (error) {
				console.error(error);
			})
			.on('meta', function (meta) {
				
			})
			.on('readable', function() {
				var stream = this, item;
				
				while (item = stream.read()) {// For each item
					//Perhaps check the last updated attribute before parsing (if the lastScanned<lastUpdated)
					//ie if the latest update happens after lastScanned, then we scan it for updates
					//console.log(item.guid);
 					//Check if the guid already exists
					//Check for copyrights (renders the post to be shown to be false)**************************************
					
					
 					addBlogPost(item, blog_id, show, user_id);
 					
				}
				
				
				  
		});
		 
	}
	
	//Adds a blogpost into the db but first checks if there exists one already based on guid
	//This is also where the Auto Tagging is done to the blog posts and added to db	
	function addBlogPost(item, blog_id, show, user_id){
		conn.findBlogPostByGuidAndBlogId(item.guid, blog_id, function(err, result){//Callback for any blog_post given guid and blog_id
			if(err){
				console.log("SCANNED ERROR:"+err);
			}else if(result.rowCount>=1){
				console.log("SCANNED: Already in database! "+result);
			}else{
				
 				//Add the content to db
				console.log("We shall add this to the database! "+item.guid);
				conn.insertBlogPost(JSON.stringify(item), show, blog_id, item.link, item.pubdate, item.guid, user_id, autotag(stripHTML(item.summary)),
					function(err, result){
						if(err){
							console.log(""+err);
						}
					}
				);
				 
			}
		});
	
	}
	
	function autotag(content){
		//Auto Tagging on the content of the blog post
		var keywords = glossary.extract(content+"");
		console.log("Content:"+content);
		console.log("KEYWORDS: "+keywords);
		return keywords;
				
	}
	
	function stripHTML(html) {
		var clean = sanitizer.sanitize(html, function (str) {
			return str;
		});
		// Remove all remaining HTML tags.
		clean = clean.replace(/<(?:.|\n)*?>/gm, "");

		// RegEx to remove needless newlines and whitespace.
		// See: http://stackoverflow.com/questions/816085/removing-redundant-line-breaks-with-regular-expressions
		clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");

		// Return the final string, minus any leading/trailing whitespace.
		return clean.trim();
	}
	
	//Check for copyright keywords in the whole item tag
	//returns false if no copyrights exist
	//return true if copyright does exist
	function isCopyright(item){
		return false;
	}
	
	/*function findBlogPostByGuidAndBlogId(guid,blog_id,callback){
		var query = conn.queryParam("SELECT \"GUID\", \"BLOG_ID\" FROM \"BLOG_POST\" WHERE \"GUID\"=$1 AND \"BLOG_ID\"=$2", [guid,blog_id], callback);
		return query;
	};*/
	
	return  {
		grabByURL:grabByURL,
		//grabByURLAndGUID:grabByURLAndGUID, //Deprecated
		scan:scan
	}
};
//allow others to access this file
exports.rss = rss;
/*
//Deprecated
//Grabs a URL and searches for given guis, and adds the article with that guid into the db
//Called by feedsub on encountering a new guid
function grabByURLAndGUID(show, blog_id, URL, guid, user_id ){
	var FeedParser = require("feedparser");
	var request = require('request');
	  
	request(URL)
		.pipe(new FeedParser())
		.on('error', function (error) {
			console.error(error);
		})
		.on('meta', function (meta) {
		})
		.on('readable', function() {
			var stream = this, item;
				
			while (item = stream.read()) {
				//insert blog posts only if the guid matches
				//console.log(blog_id+" "+ item.link+" "+ item.pubdate+" "+item.guid+" "+ user_id);
				if(item.guid==guid){
					conn.insertBlogPost(JSON.stringify(item), show, blog_id, item.link, item.pubdate, item.guid, user_id, 
						function(err, result){
							if(err){
								console.log(""+err);
							};
						}
					);
				}
			}
			  
	});
	
};*/