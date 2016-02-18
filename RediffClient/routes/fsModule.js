var fs = require("fs");

var fsModule = {};
var filePath = 'public/searchHistory.txt';
fsModule.writeToFile = function(jsonString, cb) {
	// Create a writable stream

	console.log('Wrting to file : ' + jsonString);
	var writeCB = function(data) {

		var writerStream = fs.createWriteStream(filePath);

		jsonString = data + ','+jsonString;
		writerStream.write(jsonString, 'UTF8');

		// Mark the end of file
		writerStream.end();

		// Handle stream events --> finish, and error
		writerStream.on('finish', function() {
			console.log("Write completed.");
			cb();
		});

		writerStream.on('error', function(err) {
			console.log(err.stack);
		});

		console.log("Program Ended");
	};
	var data = "";
	fs.readFile(filePath, {'encoding': 'utf8'}, function(err, data){
		writeCB(data);
	});
};


fsModule.readFromFile = function( cb) {

	fs.readFile(filePath, {'encoding': 'utf8'}, function(err, dataString){
		if(dataString.indexOf(',') === 0 ){
			dataString = dataString.substring(1);
		}
		cb(dataString);
	});

};

fsModule.getURLBasedOnId = function(data, searchId) {
	var dString = data;
	dString = '{' + data + '}';
	if (dString.indexOf('{,') === 0) {
		dString = dString.substring(1);
	}
	var json = JSON.parse(dString);
	var url = json[searchId] || 'no url';
	return url;
};
module.exports = fsModule;