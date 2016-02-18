var express = require('express');
var router = express.Router();
var restModule = require('./restController');
var fsModule = require('./fsModule');


/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session && req.session.userData) {
		res.redirect('/searchPage');
	} else {
		res.render('index', {
			title: 'Welcome to Rediff Shopping'
		});
	}
});

router.get('/register', function(req, res, next) {
	res.render('registration-page', {
		title: 'Please fill the below form',
		shopper: {}
	});
});

router.get('/searchProducts', function(req, res, next) {
	var searchString = req.param('query');
	restModule.log('Search String is: ' + searchString);

	restModule.searchProducts(searchString, function(data, url) {
		var writableJSON = {
			searchKey: searchString + '--' + new Date().toLocaleString(),
			url: url
		};

		fsModule.writeToFile(JSON.stringify(writableJSON), function() {
			console.log('written', url);
		});


		res.send(data || {
			'response': 'Some error'
		});
	});

});

router.post('/submit', function(req, res, next) {
	restModule.log('reached submitRegistration' + req.body.username);

	restModule.registerUser(req, function(data) {
		restModule.log('registerUser callback data :' + data);
		data = JSON.parse(data);
		restModule.log('registerUser callback :' + data);

		try {
			if (data && data.username) {
				restModule.log('registerUser callback valid data recieved : ' + data.username);

				res.render('welcome', {
					title: 'welcome',
					shopper: data
				});
			} else {
				restModule.log('registerUser callback no valid data recieved : ' + data);
				res.render('error', {
					title: 'Error' + JSON.stringify(data)
				});
			}
		} catch (e) {
			restModule.log('registerUser callback some error ' + e);
		}

	});

});



router.get('/login', function(req, res, next) {
	if (req.session && req.session.userData) {
		res.redirect('/searchPage');
	} else {
		res.render('login-page', {
			title: 'Enter username and password'
		});
	}

});


router.get('/error', function(req, res, next) {

});

router.get('/userDetails', function(req, res, next) {

	var id = req.param('id');

	restModule.log('Get User Detail of : ' + id);

	restModule.findUserById(id, function(data) {
		data = JSON.parse(data);
		restModule.log('Inside userDetails callback ');
		res.render('registration-page', {
			title: 'User Detail Page',
			shopper: data
		});
	});
});

router.post('/authenticate', function(req, res, next) {
	restModule.authenticate(req, function(data) {
		restModule.log(' authenticate cb data :' + data);
		data = JSON.parse(data);
		restModule.log('authenticate cb data :' + data);

		try {
			if (data && data.authentication) {
				restModule.log('authenticate cb valid data recieved : ' + data.authentication);
				if (data.authentication === 'failed') {
					res.render('error', {
						title: 'authentication ' + data.authentication
					});
				} else {
					req.session.userData = data;
					res.redirect('/searchPage');
				}
			} else {
				restModule.log('authenticate cb no valid data recieved : ' + data);
				res.render('error', {
					title: 'authentication Failed or some error'
				});
			}
		} catch (e) {
			restModule.log('authenticate cb some error ' + e);
		}
	});
});

router.get('/searchPage', function(req, res, next) {
	var data = req.session.userData;
	if (data) {
		res.render('search-page', {
			title: 'Search Page',
			shopper: data.shopper
		});
	} else {
		res.redirect('/login');
	}

});

router.get('/logout', function(req, res, next) {
	req.session.reset();
	res.redirect('/login');
});



router.get('/getSearchHistory', function(req, res, next) {
	fsModule.readFromFile(function(str) {
		var arrStr = '[' + str + ']';
		var arr = JSON.parse(arrStr);
		res.send({
			history: arr || []
		});
	});
});

module.exports = router;