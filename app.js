var express = require('express');
var js_server = require("js-server");
var app = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;


var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: '1641122906121098',
    clientSecret: 'ba3410f9c0afca7b95ca58e3e203f7f6',
    callbackURL: "http://www.test-trendeo.herokuapp.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
	console.log(profile);
    // User.findOrCreate(accessToken, refreshToken, profile, function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
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

app.post('/api/user/:userId', function (req, res) {
	console.log('\n\n\nGot uId+vId request....');
	var userId = req.params.userId;
	//console.log(req.body);
	var updown = req.body.updown;
	var video = req.body.video;
	js_server.updateUserLikedVideos(userId, updown, video);
	var resp = ["OK:200"];
	if(resp) console.log(resp);
	res.json(resp);
	console.log('uId+vId response sent..');
});

app.get('/*', function(req, res){
	console.log("Unknown URL caught");
	console.log(req.params);
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/auth/facebook', function(req, res){
	passport.authenticate('facebook');
});

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', function(req, res){
	passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' });
});

//logging
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Trendeo server listening at http://%s:%s', host, port);
});







