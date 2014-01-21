 
//Maeda Hanafi
//Continuously scan the rss links from the database

var scanner = function(incoonn, inrssparser){
	var conn = incoonn;
	var rssParser = inrssparser;
	var lastScanned;
	var moment = require('moment');

	//Must be called to start scanning every 5 minuts
	function init(){
		setInterval(function() { startScanner();	 }, 300000);			
	};
	
	function startScanner(){
		moment().format();
		lastScanned = moment();
		
		//Grab All Links and corresponding blogID from the database, and scann that thing!
		getAllBlogLinkAndBlogId(function(err, result){ 	//callback for grabbing all posts
			if(result.rowCount>=1){
				var resultrows = result.rows;
 				
				resultrows.forEach(function(item){
					 rssParser.scan(item["BLOG_ID"], item["LINK"], item["SHOW"], item["USER_ID"], lastScanned);
					 //assignScanner(item["LINK"], , item["SHOW"], item["USER_ID"]);
				});
			}
		});
	};
	/*var MAX_HISTORY = 100;
	var readers = [];
	
	//scan an incomming url (needs to be done when a new link is added)
	//imp since startScanner is only called once
	//call startscanner multiple times************************************************
	
	
	//scan the urls already in the db
	function startScanner(){
		if(readers.length){
			readers.forEach(function(item){
				item.stop();
			});
		}
		readers = [];
		
		//var URL = "http://rss.cnn.com/rss/cnn_latest.rss";
		getAllBlogLinkAndBlogId(function(err, result){ 	//callback for grabbing all posts
			if(result.rowCount>=1){
				var resultrows = result.rows;
 				
				resultrows.forEach(function(item){
					 assignScanner(item["LINK"], item["BLOG_ID"], item["SHOW"], item["USER_ID"]);
				});
			}
		});
		//assignScanner(URL);
	};
 
	
	//put a scanner on this URL
	function assignScanner(URL, blog_id, show, user_id){
		var FeedSub = require('feedsub');
	  
		var reader = new FeedSub(URL, {
			interval: 1, // check feed every 10 minutes
			autoStart: true,
			forceInterval:false,
			emitOnStart:true,
			lastDate:null,
			maxHistory: MAX_HISTORY,
			skipHours:false,
			skipDays:false,
			requestOpts:{}
		});

	 
		  
		reader.on('item', function(item) {
			if(item && item.guid){ 
  				console.log("SCANNED:"+blog_id +":"+JSON.stringify(item["guid"]) ); //store the text of the guid
				var guidHolder = item["guid"];
				var guid;
				if(guidHolder.text){	
					guid= guidHolder["text"];
					
				}else{//when some guids are not placed in the text propoerty just take the guidHolder data
					guid= guidHolder;
				}
				 
				//should add to database if guid and blog id aren't the same
				findBlogPostByGuidAndBlogId(guid, blog_id, function(err, result){
					if(err){
						console.log("SCANNED ERROR:"+err);
					}else if(result.rowCount>=1){
						console.log("SCANNED: Already in database! "+guid);
					}else{
						//add the content to db
						//console.log("We shall add this to the database! "+guid);
 						console.log("SCANNED: We shall add this to the database! "+JSON.stringify(item));
 						rssParser.grabByURLAndGUID(show, blog_id, URL, guid, user_id );
 						 
					}
				});
				 
 			}  
		});
		
		reader.on('error',function(e){
 		   console.log("SCANNED ERROR:"+ e.stack );
		});
		reader.start();
		readers.push(reader);
 	};
	*/
	
	//Queries
	
	
	function getAllBlogLinkAndBlogId(callback){
		var query = conn.query("SELECT \"LINK\", \"BLOG_ID\", \"SHOW\", \"USER_ID\" FROM \"BLOGS\"",callback);
		return query;
	};
	 
	
	return  {
		init:init,
		 startScanner:startScanner
	}
};
//allow others to access this file
exports.scanner = scanner;