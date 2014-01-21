//Maeda Hanafi
//db file

var database = function(inconnectionString){
	var connectionString = inconnectionString;	
	var pg = require('pg');
	var client;
	
	var getConnectionString = function(){
		return connectionString;
	};
	
	var getBlogLinks = function(res, $, htmlSource){
	
		 var query = client.query("SELECT * FROM \"BLOGS\"");// function(err, result) {
			query.on('error', function(error) {
				//handle the error
				console.error('error running query', error);
			});
			
			query.on('row', function(row) {
				//fired once for each row returned
				//rows.push(row);
				$('body').append("<p>"+JSON.stringify(row));
			});
			query.on('end', function(result) {
				//fired once and only once, after the last row has been returned and after all 'row' events are emitted
				//in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
				console.log(result.rowCount + ' rows were received');
				htmlSource = $.html();
				res.send( htmlSource );
				console.log($.html());
			})
			

	
	};
	
	var setConnectionString = function(newConn){
		connectionString = newConn;
	};
	
	var databaseConnect = function(){
		//DAtabase connection*
		client = new pg.Client(connectionString);
		//client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  
		client.connect();

		
	 };
	
	var queryOLD = function( queryString){
		var query = client.query(queryString);// function(err, result) {
		
		query.on('error', function(error) {
			//handle the error
			console.error('error running query', error);
		});
		query.on("row", function (row, result) {
			result.addRow(row);
		});
		return query;
		
			
	};
	var query = function( queryString, callback){
		var query = client.query(queryString, callback);// function(err, result) {
		console.log("querying:"+queryString);
				
		return query;
		
			
	};
	var queryParam = function( queryString, param,callback){
		var query = client.query(queryString, param,callback);// function(err, result) {
		console.log("param querying:"+queryString+" "+param);
				
		return query;
		
			
	};
	var closeConnection = function(){
		client.end();
	};

	//remember jsonContent is the stringified of a JSON of a blog post content
 	function insertBlogPost(jsonContent, show, blog_id, link, date, guid, user_id, callback){		
		//2013-12-23T14:57:28.000Z
		//var query = conn.query("INSERT INTO \"BLOG_POST\" (\"CONTENT\", \"SHOW\", \"BLOG_ID\", \"LINK\", \"DATE\", \"GUID\", \"USER_ID\") VALUES (\'"+jsonContent+"\', "+show+", "+blog_id+", \'"+link+"\', \'"+date+"\',\'"+guid+"\', "+user_id+");" , callback);
		var query = queryParam("INSERT INTO \"BLOG_POST\" (\"CONTENT\", \"SHOW\", \"BLOG_ID\", \"LINK\", \"DATE\", \"GUID\", \"USER_ID\") VALUES ($1, $2, $3, $4, $5,$6,$7);" , [jsonContent, show, blog_id, link, date, guid, user_id],callback);
		
		return query;
	};
	
	//Gets all blog posts given a blog id
	function getBlogPostsByBlogId(blog_id, callback){
		var query = queryParam("SELECT * FROM \"BLOG_POST\" WHERE \"BLOG_ID\"=$1",[blog_id], callback);
		return query;
	};
	return  {
		getConnectionString: getConnectionString,
		setConnectionString: setConnectionString,
		databaseConnect:databaseConnect,
		getBlogLinks:getBlogLinks,
		closeConnection:closeConnection,
		query:query,
		queryParam:queryParam,
		insertBlogPost:insertBlogPost,
		getBlogPostsByBlogId:getBlogPostsByBlogId
		}
};
//allow others to access this file
exports.database = database;


