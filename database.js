//Maeda Hanafi
//server version of a flying shape object

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
		//DAtabase connection***************************************************************
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

	return  {
		getConnectionString: getConnectionString,
		setConnectionString: setConnectionString,
		databaseConnect:databaseConnect,
		getBlogLinks:getBlogLinks,
		closeConnection:closeConnection,
		query:query,
		queryParam:queryParam
		}
};
//allow others to access this file
exports.database = database;


