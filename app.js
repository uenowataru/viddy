var express = require('express');
var js_server = require("js-server");
var app = express();

var port = process.env.PORT || 3000;

app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/res", express.static(__dirname + '/public/res'));


//client side get
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/ch/:channel/:videoId', function (req, res) {
	console.log('ch/' + req.params.channel + "/" + req.params.videoId);

	//get the channel and videoId somehow
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/ch/:channel', function (req, res) {
	console.log('ch/' + req.params.channel);

	//get the channel and videoId somehow
	res.sendFile(__dirname + '/public/index.html');
});

//api call
app.get('/api/ch/:channel', function (req, res) {
	console.log('\n\n\nGot ch request....');
	var subr = req.params.channel;
	var resp = js_server.getRedditJSON(subr);
	if(resp) console.log(resp.length);
	res.send(resp);
	console.log('Ch response sent..');
});

app.get('/api/vid/:videoId', function (req, res) {
	console.log('\n\n\nGot vid request....');
	var videoId = req.params.videoId;
	var resp = js_server.getRedditVideoJSON(videoId); //, function(resp){});
	if(resp) console.log(resp.length);
	res.send(resp);
	console.log('vId response sent..');
});

app.get('/*', function(req, res){
	console.log("Unknown URL caught");
	res.sendFile(__dirname + '/public/index.html');
});

//logging
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Trendeo server listening at http://%s:%s', host, port);
});







