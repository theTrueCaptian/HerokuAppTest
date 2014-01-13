//MAeda Hanafi
//rss deals with the details of parsing the rss feeds

var rss = function(incoonn){
	var conn = incoonn;
	
	//adds all rss content into db 
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
					conn.insertBlogPost(JSON.stringify(item), show, blog_id, item.link, item.pubdate, item.guid, user_id, 
						function(err, result){
							if(err){
								console.log(""+err);
							};
						}
					);
				}
				  
		});
		
	};
	
	//grabs a URL and searches for given guis, and adds the article with that guid into the db
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
		
	};
	
	
	return  {
		grabByURL:grabByURL,
		grabByURLAndGUID:grabByURLAndGUID
	}
};
//allow others to access this file
exports.rss = rss;