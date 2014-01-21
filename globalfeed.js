
// Global feed holds the actual feed that everyone will see, and it will be updated when ever the rss scanner detects an update to one of the sites
// GLobal feed also returns an array of posts, requested by the index, next, and previous requests from user
//Maeda Hanafi

var GlobalFeed = function(inconn ){
	var conn = inconn;	//db connection
	var globalfeed = [];
	var MAX_LENGTH = 1000;//Max number of latest posts that globalfeed can handle
	 
	 // Load the latest MAX_LENGTH posts into globalfeed. 
	 // Used on first load or when an update occurs (should be called by rss scanner
	function loadLatestPosts(  onDone){
		//Grab all posts
		grabAllPosts(function(err, result){	//Callback for PSQL query
			if(err){ 
				console.log(""+err);
			}else{
				//Clear entries
				globalfeed = [];
				var resultrows = result.rows;
				
 				for(var i = 0 ; i <MAX_LENGTH; i++) {
					if(i== result.rowCount){	//Make sure we dont go beyond the number of results given.  
 						//console.log("Break!");
						break;
					};
					globalfeed[i]=(resultrows[i]);
  				};
				onDone( );
   			}
		});
	};
	
	//Grab the first few posts for the main index page
	//Called when index is called
	//Returns an array of the latest few posts
	function getFirstTen( limit){
		var temp = [];
		for(var i = 0 ; i <limit; i++) {
			temp[i] = globalfeed[i];
			console.log(temp[i]);
		}
		return temp;
	}

	// Grab next few posts after a given blog_id from globalfeed. 
	// Called when the visitor clicks the next button
	// Returns an array of posts that appear after start_blog_id with lemgth limit
	function getNext(start_blog_id, limit){
		var temp = [];
		var index=0; //index of temp to fill
		var flag = false;
		//Search for a blog post with start_blog_id
		//Save the next 'limit' number of posts into a temp array

		//globalfeed.forEach(function(item){
		for(var i = 0 ; i <globalfeed.length; i++) {
			var item = globalfeed[i];
			//console.log(start_blog_id+" "+item["BLOG_POST_ID"]+" "+item["DATE"] );
			if(flag){//flag is raised to start saving posts into temp
				temp[index]=item;
				index++;
				//console.log("item added");

				if(temp.length-1==limit  ){//If enough is filled
					break;
				}
			}
			
 			if( item["BLOG_POST_ID"]== start_blog_id){
				flag = true;
				//console.log("FLAG is raised");
 			}
			
		//});
		}
		//Return that array
		return temp;
	};
	
	// Grab previous few posts before a given blog_id from globalfeed. 
	// Called when the visitor clicks the previous button
	// Returns an array of posts that appear before start_blog_id of length limit
	function getPrevious(start_blog_id, limit){
		var temp = [];
		var index=limit-1; //index of temp to fill. Start with the limit   so that the result will be sorted
		var flag = false;
 		//Search for a blog post with start_blog_id
		//Scan the globalfeed backwards
		for(var i = globalfeed.length-1 ; i >=0; i--) {
			var item = globalfeed[i]; 
			
 			if(flag){//flag is raised to start saving posts into temp
			
				//Save the previous 'limit' number of posts into a temp array		
				temp[index]=item;
				index--;
 				if(index==-1 ||  i<=0){//If enough is filled or if the next one undefined, then stop
					break;
				}
			}
			
			//Check if we have found the blog_post
 			if( item["BLOG_POST_ID"]== start_blog_id){
				flag = true;	//If so we start saving posts into temp
   			}
			 
		};
		
		//Return that array
		return temp;
	};
	
	function grabAllPosts ( callback){		 
		var query = conn.query("(SELECT * FROM \"BLOG_POST\" WHERE \"SHOW\"=true ORDER BY \"DATE\" DESC) ",callback);
		return query;
	};
 
	 
	return  {
			loadLatestPosts:loadLatestPosts,
			getNext:getNext,
			getPrevious:getPrevious,
			getFirstTen:getFirstTen
		}
};
//allow others to access this file
exports.globalfeed = GlobalFeed;
 