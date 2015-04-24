var express = require('express');
var js_server = require("./js-server");
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/res'));

//
//app.set('view engine', 'jade');

app.get('/', function (req, res) {
	res.sendFile('index.html');

	res.sendFile('trendeo_server.js');
	res.sendFile('youtube.js');
	res.sendFile('usercontrol.js');
	res.sendFile('CacheService.js');
	
	res.sendFile('styles.css');
	
	res.sendFile('arrowLeft.png');
	res.sendFile('arrowLeft.png');
	res.sendFile('favicon.ico');
	//res.sendFile('white.png');
	//res.send(data);
	//res.sendFolder('/js');
});

app.get('/*', function (req, res) {
	console.log('\n\n\nGot request....');
	var resp = js_server.getRedditJSON();
	console.log(resp);
	res.send(resp);
	console.log('Response sent..');
});


var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Trendeo server listening at http://%s:%s', host, port);
});







