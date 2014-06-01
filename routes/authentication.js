
 //Maeda Hanafi 
//var adminStatus = false;
	
var authentication = function(inconn){
	var passport = require('passport')
	  , LocalStrategy = require('passport-local').Strategy
	 // , bcrypt = require('bcrypt-nodejs')
	  , SALT_WORK_FACTOR = 10
	 // , flash = require('connect-flash');
 
	var redirects = { successRedirect: '/index',
									   failureRedirect: '/signin',
									   failureFlash: true };
	var conn=inconn;
	
	//only used when an admin is logged in
	var adminName = 'admin';
 	
	var init = function(app, express){
		app.use(express.cookieParser());
		app.use(express.bodyParser());
		app.use(express.session({ secret: 'SECRET' }));
		app.use(passport.initialize());
		app.use(passport.session());
		app.post('/login',	passport.authenticate('local', redirects));
		
		
		//authentication************************************************************************		
		passport.use(new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password'
			},
			function(usernameField, passwordField, done) {
				console.log("pasport local strategy");
				if(usernameField==adminName){
					conn.findPasswordByUsername(usernameField, passwordField,
						function(err, result){
							console.log(""+err);
				
							if(result.rowCount==1){
								/*var firstRow = result.rows[0];
								for(var columnName in firstRow) {
									console.log('column "%s" has a value of "%j"', columnName, firstRow[columnName]);
								  }*/
								var user = result.rows[0];//JSON.stringify(result.rows[0]);//{id: result[0].USER_ID, type: result[0].USER_TYPE_ID, email: result[0].EMAIL, username: result[0].USERNAME};
								//user.push({'adminStatusUser':true});
								console.log('logging in the admin:'+user);
								
								//change redirect to admin home
								redirects["successRedirect"] = "/admin";
								passport.authenticate('local', redirects);
								
								return done(null, user);
							};
							return done(null, false, { message: 'Wrong credentials ' });
						}
					);
				
			  }
			}
		));
		//set the user to req.user and establish a session via a cookie set in the user’s browser
		passport.serializeUser(function(user, done) {
			console.log('serializing and storing session info:'+ user["USER_ID"]);
						
			done(null, user["USER_ID"]);
		});

		passport.deserializeUser(function(id, done) {
			console.log('working on deserializin:d'+id);
			
			conn.findUserByUserId(id, function(err, result){
				console.log(""+err);
				
				if(result.rowCount==1){
					
					var user = result.rows[0];//{id: result[0]["USER_ID"], type: result[0]["USER_TYPE_ID"], email: result[0]["EMAIL"], username: result[0]["USERNAME"]};
					console.log('desserializing info:'+ JSON.stringify(user));
					//user.push({'adminStatusUser':true});
								
					done(null, user);
				}else{
					console.log('da heck nothing was found');
			
				}
			});
			
			
		});
	};

	function ensureAdmin(req, res, next) {
		if(req.user!=null && req.user["USER_TYPE_ID"] === 1){
			console.log("ADMIN STATUS ACHEIVED");
						
			next();
		}else{
			console.log("ADMIN STATUS NOT ACHEIVED");
			//res.sendfile( __dirname + '/signin.html' );
			res.redirect('signin');
			//res.send(403);
		}
	};	
	
	function signin(req, res){
		
		var fs=require('fs');
		var ejs = require('ejs');

		//res.render('index', { title: 'The index page!' });
		//var file = __dirname+'/../'+req.params[0]+'.ejs';//req.params[req.params.length-1];
		var file=__dirname+'/../views/signin.ejs';
		console.log('\t :: Express :: file requested : ' + file+' '+req.path);
		var ejs_file = fs.readFileSync(file, 'utf-8');
		var page_html = ejs.render(ejs_file, { title: 'The index page!' });
		res.render('layout', {body:page_html});
	};
	function isAdminLoggedIn( ) { //*********************************WORK ON THISSS
		//is the admin logged in?
		//return true or false
		return true;
	};
	return  {
		init:init,
		ensureAdmin:ensureAdmin,
		signin:signin,
		isAdminLoggedIn:isAdminLoggedIn
		}
};
//allow others to access this file
exports.authentication = authentication;


// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
	res.redirect('/signin')
};
  