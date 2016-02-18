var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io');
var http = require('http');
var promise = require('express-promise');
var routes = require('./routes/routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(promise());
var session = require('client-sessions');



var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use('/', routes);

app.set('port', process.env.PORT || 3006);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
io = io.listen(server);

var loggedInUsers = [];

io.sockets.on('connection', function (socket) {
  console.log('connection established');
  socket.on('newloginInit', function (data) {
  	var tempArray = [];
  	for(var i=0;i<loggedInUsers.length; i++){
  		if(data.id === loggedInUsers[i].id){
  			//do nothing
  		}else{
  			tempArray.push(data);
  		}
  	}
  	if(!loggedInUsers.length ){
  		tempArray.push(data);
  	}
  	loggedInUsers = tempArray;

	console.log('new login init'+ data.name);  	
    io.sockets.emit('newlogin', loggedInUsers);

  });

});



module.exports = app;
