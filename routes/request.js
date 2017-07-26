var router = require('express').Router(),
	mailer = require('nodemailer'),
	Request = require('../models/request');

var transporter = mailer.createTransport({
	service : "gmail",
	auth : {
		user : '@gmail.com',
		pass : ''
	}
});

var ensureAuth = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error_msg", "Please login to continue");
		res.redirect('/users/login');
	}
}

router.get('/', ensureAuth, (req, res) => {
	Request.find({}, (err, allRequests) => {
		if(err) throw err;
		console.log(allRequests);
		res.render('show_requests.html', {
			allRequests : allRequests
		});
	});
});

router.get('/add', (req, res) => {
	res.render('request.html');
});

router.post('/add', (req, res) => {
	var firstname = req.body.firstname,
		lastname = req.body.lastname,
		email = req.body.email,
		audit_name = req.body.audit_name,
		required_from = {
			from_date : req.body.from_date,
			from_time : req.body.from_time
		},
		required_to = {
			to_date : req.body.to_date,
			to_time : req.body.to_time
		},
		reason = req.body.reason;

	var newRequest = new Request({
		firstname : firstname,
		lastname : lastname,
		email : email,
		audit_name : audit_name,
		required_from : required_from,
		required_to : required_to,
		reason : reason
	});

	var mailOptions = {
	    from: '"Auditorium booking" <senorahacks@gmail.com>',
	    to: newRequest.email,
	    subject: 'Auditorium booking request',
	    text: 'Hello your request for the auditorium has been received successfully.Please wait till we process your request'
	};

	Request.createRequest(newRequest, (err) => {
		if(err) throw err;
		transporter.sendMail(mailOptions, (error, info) => {
			if(err) throw err;
			console.log('Message %s sent: %s', info.messageId, info.response);
			req.flash('Request sent successfully');
			res.redirect('/');
		});
	});
});

router.get('/accept/:id', ensureAuth, (req, res) => {
	var id = req.params.id;
	Request.findRequestById(id, (err, request) => {
		if(err) throw err;
		if(request){
			var mailOptions = {
			    from: '"Auditorium booking" <@gmail.com>',
			    to: request.email,
			    subject: 'Auditorium booking request',
			    text: 'Hello your request for the auditorium has been accepted.Please contact the higher authorities for further information.'
			};
			Request.updateRequest(id, (err) => {
				if(err) throw err;
				transporter.sendMail(mailOptions, (error, info) => {
					if(err) throw err;
					console.log('Message %s sent: %s', info.messageId, info.response);
					req.flash("success_msg", "Mail sent successfully");
					res.redirect('/requests')
				});
			});
		}
	});
});

router.get('/reject/:id', ensureAuth, (req, res) => {
	var id = req.params.id;
	Request.findRequestById(id, (err, request) => {
		if(err) throw err;
		if(request){
			var mailOptions = {
			    from: '"Auditorium booking" <@gmail.com>',
			    to: request.email,
			    subject: 'Auditorium booking request',
			    text: 'Hello your request for the auditorium has been rejected.Please contact the higher authorities for further information.'
			};
			Request.removeRequest(id, (err) => {
				if(err) throw err;
				transporter.sendMail(mailOptions, (error, info) => {
					if(err) throw err;
					console.log('Message %s sent: %s', info.messageId, info.response);
					req.flash("success_msg", "Mail sent successfully");
					res.redirect('/requests')
				});
			});
		}
	});
});

router.get('/showRequest/:id', ensureAuth, (req, res) => {
	var id = req.params.id;
	Request.findById(id, (err, request) => {
		if(err) throw err;
		if(request){
			res.render('singleRequest.html', {
				request : request
			});
		}
	});
});

module.exports = router;