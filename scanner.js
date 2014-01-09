
/*
 * GET home page.
 */
 //Maeda Hanafi
//server version of a flying shape object

var scanner = function(incoonn){
	var conn = incoonn;
	
	function startScanner(){
		var FeedSub = require('feedsub');
		var json2html = require('node-json2html');
	 
		var transform = {'tag':'p','html':'<div class=".col-md-4" ><div class="text-center"><div class="panel panel-default"><div class="panel-heading"><h2>${title} <p><small> By ${author}</small></h2></div> <div class="panel-body"> <p>Blog source: ${link} <p> Date Published: ${pubdate} Update: ${date} <p><div class="lead"> ${description} </div></div></div></div></div>'};
	   
		var URL = "http://rss.cnn.com/rss/cnn_topstories.rss";
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
			//total = total +"<p>"+json2html.transform(JSON.stringify(item),transform);
			 
		});

		reader.start();
	};
 
	return  {
		 startScanner:startScanner
	}
};
//allow others to access this file
exports.scanner = scanner;