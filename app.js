var express = require('express');
var js_server = require("js-server");
var app = express();

var port = process.env.PORT || 3000;

app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/res", express.static(__dirname + '/public/res'));


//client side get
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/ch/*/*', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

app.get('/ch/*', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

//api call
app.get('/api/*', function (req, res) {
	console.log('\n\n\nGot request....');
	var resp = js_server.getRedditJSON();
	if(resp) console.log(resp.length);
	res.send(resp);
	console.log('Response sent..');
});


//logging
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Trendeo server listening at http://%s:%s', host, port);
});







