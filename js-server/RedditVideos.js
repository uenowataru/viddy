module.exports = {
  getRedditJSON: function () {
	return queueToJSON();
  }
};


var request = require("request");
var queue = [];
var tempqueue = [];
var subreddits = ['videos', 'gifs', 'all', 'youtubehaiku', 'deepintoyoutube', 'StandUpComedy', 'fail', 'gopro', 'ContagiousLaughter',
	'todayilearned', 'LearnUselessTalents','Music', 'listentothis', 'hiphopheads','sports' , 'nba', 'soccer', 'nfl',
	'UnexpectedThugLife', 'space', 'PublicFreakout', 'StreetFights', 'respectporn'];
var banned = ['leagueoflegends','hearthstone','smashbros','tf2','DotA2','gamegrumps','2007scape', 'wow', 'GrandTheftAutoV_PC','Games',
	'Minecraft', 'KotakuInAction','witcher','GlobalOffensive','MonsterHunter','osugame', 'PS4', 'pcgaming', 'CLG','funhaus', 'pcmasterrace',
	'totalwar','starcraft','Planetside','pathofexile','ffxiv','SSBM'];
var subrednum = 0;
var last = "null";
var resourceUrl;
var page = 0;
var MAX_PAGE = 20;


setInterval(function(){
  try{
	loadRedditVideos();
  }catch(err){
	console.log(err);
  }
}, 5*1000);

function loadRedditVideos() {
	if(subrednum == subreddits.length) return;
	//resourceUrl = "https://www.reddit.com/r/all/.json?limit=60&after=" + last;

	var url = "https://www.reddit.com/domain/youtube.com/.json?limit=60&after=" + last;
	getRedditVideos(url);
}

// https://gdata.youtube.com/feeds/api/standardfeeds/on_the_web?alt=json


function getRedditVideos(url) {
	var jsonres;
	request({
		url: url,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			procRedditVideos(body);
			if(queue.length == 0){
				queue = cleanQueue(tempqueue);
			}
			if(++page >= MAX_PAGE){
				queue = cleanQueue(tempqueue);
				tempqueue = [];
				last = "null";
				page = 0;
				console.log('Cache Refreshed to ' + queue.length + ' videos..');
			}
		}else{
			console.log(error);
		}
	});
}

function procRedditVideos(data){
	for(var i = 0; i < data.data.children.length; i++){
		item = data.data.children[i];
		var dom = item.data.domain;
		if(!isBanned(item.data.subreddit) && dom == "youtube.com"){
			var vidurl = item.data.url;
			if(item.data.secure_media != null && item.data.secure_media != undefined){
				vidurl = item.data.secure_media.oembed.url;
			}else if(item.data.media != null && item.data.secure_media != undefined){
				vidurl = item.data.media.oembed.url;
			}
			if(vidurl !== null && vidurl !== undefined){
				var vidtitle = item.data.title;
				tempqueue.push([vidurl.substring(vidurl.indexOf('v=')+2), vidtitle]);
			}
		}
	}
	last = data.data.after;
}

function isBanned(subreddit){
	for(var i = 0; i < banned.length; i++){
		if(banned[i]==subreddit){
			return true;
		}
	}
	return false;
}


//return JSON
function queueToJSON(){
	if(queue.length==0) return "[]";
	var str = "[";
	for(var i = 0; i < queue.length; i++){
		while(queue[i][1].indexOf("\"")!=-1) queue[i][1] = queue[i][1].replace('\"','');
		str += "[\"" + queue[i][0]+"\",\""+queue[i][1]+ "\"],";
	}
	str = str.substring(0,str.length-1) + "]";
	//console.log(str);
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