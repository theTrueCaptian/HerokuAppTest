var connectionString =process.env.DATABASE_URL || "postgres://postgres:sesamestreet1@localhost:5432/hcdb" ; // || */"dbname=dbpsu0p5m1q0kt host=ec2-54-225-135-30.compute-1.amazonaws.com port=5432 user=qtplrjwwlajlru password=ReRrKSl0A8-mILhyUgJ43A8C8d sslmode=require";

/**
 * Module dependencies.
 */

var express = require('express');

var http = require('http');
var path = require('path');

//var routes = require('./routes');
var user = require('./routes/user');


 //Database 
var db = require('./database').database;
var conn = new db(connectionString);
conn.databaseConnect();

//The rest of the .js that need db connection
var authpath = new require('./routes/authentication').authentication(conn);
var rssParser = new require('./rss').rss(conn);
var globalfeed = new require('./globalfeed').globalfeed(conn);
var admin = new require('./routes/admin.js').admin(conn, rssParser);
var indexpg =new require('./routes/index.js').index(conn, globalfeed);
var menu = new require('./routes/menu').menu(authpath, conn);


var scanner = new require('./scanner').scanner(conn, rssParser);			
 //scan every 5 minutes	
scanner.init(); 


 
	
// passport to control sessions and whatnot
var passport = require('passport')
	  , LocalStrategy = require('passport-local').Strategy;
 



var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

//also app setting for authentication
authpath.init(app, express);
app.use(app.router);

//admin routing
admin.init(app);
app.all('/admin', authpath.ensureAdmin);
app.get('/admin', admin.adminmain);
app.post('/addRSS', admin.addRSS);
app.post('/deleteBlog', admin.deleteRSS);
app.post('/toggleShowBlog', admin.toggleShowBlog);
app.all('/manageRegion', authpath.ensureAdmin);
app.get('/manageRegion', admin.regionDashboard);
app.post('/deleteRegion', admin.deleteRegion);
app.post('/addRegion', admin.addRegion);
app.all('/manageBlogposts', authpath.ensureAdmin);
app.get('/manageBlogposts', admin.blogpostDashboard);
app.post('/toggleShow', admin.toggleShow);
app.all('/adminCrawler', authpath.ensureAdmin);
app.get('/adminCrawler', admin.adminCrawler);
app.post('/adminSearch', admin.adminSearch);
 
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/' , indexpg.indexfile);
app.get( '/index', indexpg.indexfile);
app.get( '/next', indexpg.grabNext);
app.get( '/previous', indexpg.grabPrevious);
app.get('/aboutus', menu.aboutus);
app.get('/faq', menu.faq);
app.get('/directory', menu.directory);
 


app.get('/signin', authpath.signin);
app.get('/login', authpath.signin);
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});
//app.get('/admin', user.list);




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
