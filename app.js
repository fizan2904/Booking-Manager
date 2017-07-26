var express = require('express'),
	app = express(),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	expressValidator = require('express-validator'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	flash = require('connect-flash-plus'),
	path = require('path'),
	mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/booking");
var db = mongoose.connection;

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.text({ type : 'text/html' }));
app.use(cookieParser());
app.use(session({
	secret : '2746827346hjgdf762ufdvs6fuybi2eot2oh3iu',
	saveUninitialized : true,
	resave : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
	errorFormatter : function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;
		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}return{
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));
app.use(flash());
app.use(function(req, res, next){
	res.locals.flash = req.flash();
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

var ensureAuth = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error_msg", "Please login to continue");
		res.redirect('/login');
	}
}

var index = require('./routes/index'),
	users = require('./routes/user'),
	request = require('./routes/request');

app.use('/', index);
app.use('/users', users);
app.use('/requests', request);

app.listen((process.env.PORT | 3000), () => {
	console.log('Server Started at port: 3000');
});