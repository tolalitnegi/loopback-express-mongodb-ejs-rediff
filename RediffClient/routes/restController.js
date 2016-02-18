var http = require('http');

var restModule = {
	httpOptions: {},
	resetOptions: function() {
		this.httpOptions = {
			host: 'localhost',
			port: 5555,
			path: '/api/shoppers',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		};
	},
	registerUser: function(req, cb) {
		this.resetOptions();
		var postData = JSON.stringify(req.body || {});
		restModule.log('Request Body' + postData);

		this.httpOptions.data = postData;
		this.httpOptions.headers['Content-Length'] = postData.length;

		process.nextTick(function() {
			restModule.triggerRequest(postData, cb);
		});
	},
	findUserById: function(id, cb) {
		this.resetOptions();
		var postData = JSON.stringify({});

		this.httpOptions.data = postData;
		this.httpOptions.method = 'GET';
		this.httpOptions.headers['Content-Length'] = postData.length;
		this.httpOptions.path += '/' + id;
		process.nextTick(function() {
			restModule.triggerRequest(postData, cb);
		});
	},
	authenticate: function(req, cb) {
		this.resetOptions();

		this.log('Inside authenticate');
		var postData = JSON.stringify(req.body || {});
		restModule.log('Request Body' + postData);


		this.httpOptions.data = postData;
		this.httpOptions.headers['Content-Length'] = postData.length;
		this.httpOptions.path += '/authenticate';

		process.nextTick(function() {
			restModule.triggerRequest(postData, cb);
		});
	},
	searchProducts: function(searchString, cb) {
		this.resetOptions();

		var postData = JSON.stringify({
			searchString: searchString
		});


		this.httpOptions.data = postData;
		this.httpOptions.method = 'GET';
		this.httpOptions.headers['Content-Length'] = postData.length;
		this.httpOptions.path += '/searchRediff';
		process.nextTick(function() {
			restModule.triggerRequest(postData, cb);
		});

	},
	/**
	 * Service request and CB
	 * @param  {Function} cb [description]
	 * @return {[type]}      [description]
	 */
	triggerRequest: function(postData, cb) {
		var newReq = http.request(this.httpOptions, function(res) {
			restModule.log('------------------STATUS: ' + res.statusCode);
			restModule.log('------------------Response HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				//restModule.log('BODY: ' + chunk);
				restModule.log('now executing the callback: ' + typeof cb);
				restModule.log('req header' + newReq.getHeader('url'));
				//restModule.log('newReq : ' + restModule.logObject(newReq.getHeader('referrer')	));
				restModule.log('__inspector_url__'+newReq.__inspector_url__);
				cb(chunk, newReq.__inspector_url__ || "no-url");
			});
			res.on('end', function(data) {
				restModule.log('No more data in response.' + data);
			});
		});

		newReq.on('error', function(e) {
			restModule.log('problem with request: ' + e.message);
		});
		// write data to request body
		newReq.write(postData);
		newReq.end();
	},
	logObject: function(obj) {
		for (var property in obj) {
			restModule.log('property : '+ property);
		}

	},
	log: function(text) {
		console.log('------------Loging: ' + text);
	}


};

module.exports = restModule;