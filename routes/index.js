
/*
 * GET home page.
 */
 //Maeda Hanafi
//server version of a flying shape object

var index = function(incoonn){
	var conn = incoonn;
	
	function sendFile(inbody, res){
		var fs=require('fs');
		var ejs = require('ejs');
		var ejs_file = fs.readFileSync(__dirname+'/../views/index.ejs', 'utf-8');
		var page_html = ejs.render(ejs_file, { body: inbody});
		res.render('layout', {body:page_html});
	};
	
	var indexfile = function(req, res){
		var json2html = require('node-json2html');
 
		var transform = {'tag':'p','html':'<div class=".col-md-4" ><div class="text-center"><div class="panel panel-default"><div class="panel-heading"><h2>${title} <p><small> By ${author}</small></h2></div> <div class="panel-body"> <p><div class="lead"> ${description} </div> <p>Blog source: ${link} <p> Date Published: ${pubdate} Update: ${date} </div></div></div></div>'};
   
		grabPosts(
			function(err, result){ 	//callback for grabbing all posts
				if(err){ 
					console.log(""+err);
				}else{
					if(result.rowCount>=1){
						var total ="";
						var resultrows = result.rows;
						var last=result.rows[result.rowCount-1];
						console.log("last:"+last);
						resultrows.forEach(function(item){
							//console.log(item["CONTENT"]);
							total = total + "<p>"+json2html.transform(item["CONTENT"],transform) ;
						})
						//form for the next ten *******************
						total = total + "<p><form role=\"next\" action=\"/next\" method=\"get\"><input type=\"hidden\" name=\"blog_id\" value="+last["BLOG_ID"]+" ><button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\">Next</button></form>   ";
						console.log(total);
						
					}
					sendFile(total, res);
				}
			}
		);
		
 	};

	function grabNext(req, res){
		
	};
	
	
	function grabPosts( callback){
		var query = conn.query("SELECT * FROM \"BLOG_POST\" WHERE \"SHOW\"=true ORDER BY \"DATE\" DESC LIMIT 10",callback);
		return query;
	};
	function grabNextPosts(blog_id, callback){//******************************************** edit
		var query = conn.query("SELECT * FROM \"BLOG_POST\" WHERE \"SHOW\"=true ORDER BY \"DATE\" DESC LIMIT 10",callback);
		return query;
	};
	
	return  {
		indexfile:indexfile,
		grabNext:grabNext
		}
};
//allow others to access this file
exports.index = index;



//var total;
/*function grabRSS(res){
	
	var feed = ["http://rss.cnn.com/rss/cnn_latest.rss","http://blog.dianpelangi.com/feeds/posts/default?alt=rss"]//, "http://hijaberscommunity.blogspot.com/feeds/posts/default", "http://sitisstreet.blogspot.com/feeds/posts/default", "http://saturday-market.blogspot.com/", "http://hanatajima.tumblr.com/rss"]
		;
	
	
	for( i=0; i<feed.length; i++){
		var flag = false;
		console.log('Got item!');
		
		if(i==feed.length-1) flag = true;
		grabByURL(feed[i], res,flag);
	}
	
};
 
function grabByURL(URL,res, last){
	var FeedSub = require('feedsub');
	var json2html = require('node-json2html');
 
	var transform = {'tag':'p','html':'<div class=".col-md-4" ><div class="text-center"><div class="panel panel-default"><div class="panel-heading"><h2>${title} <p><small> By ${author}</small></h2></div> <div class="panel-body"> <p>Blog source: ${link} <p> Date Published: ${pubdate} Update: ${date} <p><div class="lead"> ${description} </div></div></div></div></div>'};
   
	
	var reader = new FeedSub(URL, {
	  interval: 1, // check feed every 10 minutes
	 autoStart: true,
	 forceInterval:false,
	 emitOnStart:true,
	 lastDate:null,
	 maxHistory: 10,
	 skipHours:true,
	 skipDays:true,
	 requestOpts:{}
	});

	reader.on('items', function(err, item) {
		console.log('err:'+err)
		console.log('Got items!');
		console.dir(item);
		//console.dir(item);
		total = total +"<p>"+json2html.transform(JSON.stringify(item),transform);
		if(last){	//only send on the last one
			//stream.on('end', function() {
				sendFile(total, res);
			  
			//});
		};
	});

	reader.start();
 
};*/
 /*
function sendFile(inbody, res){
	var fs=require('fs');
	var ejs = require('ejs');
	var ejs_file = fs.readFileSync(__dirname+'/../views/index.ejs', 'utf-8');
	var page_html = ejs.render(ejs_file, { body: inbody});
	res.render('layout', {body:page_html});
};
exports.index = function(req, res){
	
	
	
	
	
	//generate the news!
	//grabRSS(res);
	
	

	
};*/