var router = require('express').Router(),
	User = require('../models/user'),
	ensureAuth = (req, res, next) => {
		if(req.isAuthenticated()){
			return next();
		}else{
			req.flash('Please login to continue');
			res.redirect('/users/login');
		}
	},
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

router.get('/login', (req, res) => {
	if(req.isAuthenticated()){
		res.redirect('/requests');
	}else{
		res.render('login.html');
	}
});

router.get('/register', (req, res) => {
	if(req.isAuthenticated()){
		res.redirect('/requests');
	}else{
		res.render('register.html');
	}
});

router.post('/register', (req, res) => {
	if(req.isAuthenticated()){
		res.redirect('/requests');
	}else{
		var username = req.body.username,
			firstname = req.body.firstname,
			lastname = req.body.lastname,
			email = req.body.email,
			password = req.body.password,
			password1 = req.body.password1;
		console.log(req.body);
		req.checkBody("username", "Username is required").notEmpty();
		req.checkBody('firstname', 'Firstname is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid is required').isEmail();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password1', 'Passwords do not match').equals(password);

		var errors = req.validationErrors();
		if(errors){
			var messages = [];
			for(var i=0;i<errors.length;i++){
				messages.push(errors[i].msg);
			}
			req.flash('error_msg', messages);
			res.redirect('/users/login');
		}else{
			var newUser = new User({
				username : username,
				firstname : firstname,
				lastname : lastname,
				email : email,
				password : password
			});
			console.log(newUser);
			User.createUser(newUser, (err) => {
				if(err) throw err;
				req.flash('success_msg', 'User Successfully created');
				res.redirect('/users/login');
			});
		}
	}
});

passport.use(new LocalStrategy((username, password, done) => {
	User.getUserByUsername(username, (err, user) => {
		if(err){
			throw err;
		}else if(!user){
			return done(null, false, { message : 'Credentials don\'t match' });
		}else{
			User.comparePassword(password, user.password, (err, isMatch) => {
				if(err){
					throw err;
				}else if(isMatch){
					return done(null, user, { message : 'Success'});
				}else{
					return done(null, false, { message : 'Credentials don\'t match' });
				}
			});
		}
	});
}));

passport.serializeUser((user, done) => {
	var sessionUser = {
		_id : user._id,
		username : user.username
	}
	done(null, sessionUser);
});

passport.deserializeUser((id, done) => {
	User.getUserById(id, (err, sessionUser) => {
		done(err, sessionUser);
	});
});

router.post('/login',
	passport.authenticate(
		'local',{
			successRedirect:'/requests',
			failureRedirect:'/users/login',
			failureFlash: true
		}
	), (req, res) => {
		res.redirect('/');
	}
);

router.get('/logout', ensureAuth, (req, res) => {
	req.logout();
	req.flash("success_msg", "Successfully logged out");
	res.redirect('/login');
});

module.exports = router;