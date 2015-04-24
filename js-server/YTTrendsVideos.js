module.exports = {
  getYTTrendsJSON: function () {
	return queueToJSON();
  }
};

var request = require("request");
var queue = [];
var tempyttrendsqueue = [];
var resourceUrl;

/*
setInterval(function(){
  try{
	loadYTTrendsVideos();
  }catch(err){
	console.log(err);
  }
}, 5*1000);
*/

function loadYTTrendsVideos(){
	var url = "https://gdata.youtube.com/feeds/api/standardfeeds/on_the_web?alt=json";
	getYTTrendsVideos(url);
}

function getYTTrendsVideos(url) {
	var jsonres;
	request({
		url: url,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			procYTTrendsVideos(body);
			queue = cleanQueue(tempyttrendsqueue);
			tempyttrendsqueue = [];
			//console.log('Refreshed cache');
		}else{
			console.log(error);
		}
	});
}

function procYTTrendsVideos(data){
	for(var i = 0; i < data.feed.entry.length; i++){
		item = data.feed.entry[i];
		tempyttrendsqueue.push([item["media$group"]["yt$videoid"]["$t"], item.title['$t']]);
	}
}

function queueToJSON(){
	if(queue.length==0) return "[]";
	var str = "[";
	for(var i = 0; i < queue.length; i++){
		while(queue[i][1].indexOf("\"")!=-1) queue[i][1] = queue[i][1].replace('\"','');
		str += "[\"" + queue[i][0]+"\",\""+queue[i][1]+ "\"],";
	}
	str = str.substring(0,str.length-1) + "]";
	return str;
}

//remove duplicates
function cleanQueue(queue){
	var hashtable = {};
	var newqueue = [];
	for(var i = 0; i < queue.length; i++){
		if(hashtable[queue[i][0]] != "true"){
			newqueue.push(queue[i]);
			hashtable[queue[i][0]] = "true";
		}
	}
	return newqueue;
}