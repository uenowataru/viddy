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
	res.json(resp);
	console.log('Ch response sent..');
});

//get video 
app.get('/api/vid/:videoId', function (req, res) {
	console.log('\n\n\nGot vId request....');
	var videoId = req.params.videoId;
	var resp = js_server.getRedditVideoJSON(videoId, function(resp){
		if(resp) console.log(resp.length);
		res.json(resp);
		console.log('vId response sent..');
	});
});

//get user 
app.get('/api/user/:userId', function (req, res) {
	console.log('\n\n\nGot uId request....');
	var userId = req.params.userId;
	js_server.getUserJSON(userId, function(resp){
		if(resp) console.log(resp);
		res.json(resp);
		console.log('uId response sent..');
	});
});

app.get('/api/user/:userId/:updown/:videoId', function (req, res) {
	console.log('\n\n\nGot uId+vId request....');
	var userId = req.params.userId;
	var updown = req.params.updown;
	var videoId = req.params.videoId;
	js_server.updateUserLikedVideos(userId, updown, videoId);
	var resp = ["ok"];
	if(resp) console.log(resp);
	res.json(resp);
	console.log('uId+vId response sent..');
});

app.get('/*', function(req, res){
	console.log("Unknown URL caught");
	console.log(req.params);
	res.sendFile(__dirname + '/public/index.html');
});

//logging
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Trendeo server listening at http://%s:%s', host, port);
});







