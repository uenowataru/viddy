function VideoList() {
	this.vidlists = {};
	this.channel_vidindex = {};
	this.channels = ['all', 'gopro', 'youtubehaiku', 'bloopers', 'funnyvideos', 'fail', 'UnexpectedThugLife',
	'StandUpComedy', 'deepintoyoutube', 'ContagiousLaughter','LearnUselessTalents', 'musicvideos',
	'Music', 'sports' , 'nba', 'soccer', 'nfl','PublicFreakout', 'StreetFights', 'respectporn',
	'kidsafevideos'];
	this.channel = "all";
	this.channel_index = 0;
	this.loading = false;
}



function loadVideos(channel) {
	if(video_list.getList(channel)!=undefined)
		return;
	var resourceUrl = "/api/ch/" + channel;
	video_list.channel_vidindex[channel] = 0;
	
	return $.getJSON(resourceUrl, function(data){
		procVideos(data, channel);
	});
}

function loadAPIVideo(channel, videoId){
	var url = "/api/vid/" + videoId;
	return $.getJSON(url, function(data){
		console.log(data);
		if(data.length > 2){
			//console.log(data[0]);
			var title = data[1];
			video_list.insertVideo(channel, 0, [videoId, title]);
			console.log(videoId + " " + title);
		}
	});
}

function loadChannels(){
	var prevchan_index = this.channel_index - 1 >= 0 ?  this.channel_index - 1 : this.channels.length-1;
	var nextchan_index = this.channel_index + 1 < this.channels.length ? this.channel_index + 1 : 0;
	loadVideos(this.channels[prevchan_index]);
	loadVideos(this.channels[nextchan_index]);
}

function loadVideo(channel, videoId){
	var url = "http://www.reddit.com/api/info/.json?url=https://www.youtube.com/watch?v=" + videoId;
	return $.getJSON(url, function(data){
		try{
			var maxscore = -1;
			var video = null;
			for(var i = 0; i < data.data.children.length; i++){
				var item = data.data.children[i];
				var dom = item.data.domain;
				if(dom == "youtube.com"){
					var vidurl = item.data.url;
					if(item.data.secure_media != null && item.data.secure_media != undefined){
						vidurl = item.data.secure_media.oembed.url;
					}else if(item.data.media != null && item.data.secure_media != undefined){
						vidurl = item.data.media.oembed.url;
					}
					if(vidurl !== null && vidurl !== undefined){
						if(item.data.score > maxscore){
							var vidtitle = item.data.title;
							var vidSubreddit = item.data.subreddit;
							var videoId = vidurl.substring(vidurl.indexOf('v=')+2);
							video = [videoId, vidtitle, vidSubreddit];
						}
					}
				}
			}
			if(video!=null)
				video_list.insertVideo(channel, 0, [video[0], video[1]]);
				video_list.setCurrVideo(videoId);
		}catch(err){
			console.log(err);
		}
	});
}

function procVideos(data, channel){
	var queue = [];
	
	$.each(data, function(i, item){
		//console.log(item);
		if(item==undefined) return;
		var vidurl = item[0];
		var vidtitle = item[1];
		//var subreddit = item[2];
		queue.push([vidurl, vidtitle]);
	});

	if(video_list.getList(channel)==undefined)
		video_list.putList(channel,queue);
}

VideoList.prototype = {
	getCurrVideo: function(){
		var currindex = this.channel_vidindex[this.channel];
		// console.log(Object.keys(this.vidlists));
		// console.log(this.channel_vidindex[Object.keys(this.channel_vidindex)[0]]);
		// console.log(this.channel);
		// console.log(currindex);
		// console.log(this.vidlists[this.channel]);
		return this.vidlists[this.channel][currindex];
	},

	getNextVideo: function(){
		var currindex = this.channel_vidindex[this.channel];
		return this.vidlists[this.channel][currindex + 1]; // < this.vidlists[this.channel].length ? currindex : 0
	},

	getPrevVideo: function(){
		var currindex = this.channel_vidindex[this.channel];
		return this.vidlists[this.channel][currindex > 0 ? currindex-1 : currindex];
	},

	getCurrIndex: function(){
		return this.channel_vidindex[this.channel];
	},

	getListLength: function(){
		//console.log(this.channel);
		return this.vidlists[this.channel].length;
	},

	//get the current channel
	getCurrChannel: function(){
		return this.channel;
	},

	//set the current channel
	setCurrChannel: function(channel){
		this.channel = channel;
		this.channel_vidindex[this.channel] = 0;
		loadChannels();
	},

	nextChannel: function(){
		this.channel_index += 1;
		if(this.channel_index >= this.channels.length)
			this.channel_index = 0;
		this.setCurrChannel(this.channels[this.channel_index]);
	},

	prevChannel: function(){
		this.channel_index -= 1;
		if(this.channel_index < 0)
			this.channel_index = this.channels.length-1;
		this.setCurrChannel(this.channels[this.channel_index]);
	},

	//set the curr video to be the videoid
	setCurrVideo: function(videoId){
		var index = this.findVideo(videoId, this.getListLength());

		if(index < 0){
			return loadVideo(this.channel, videoId);
		}else{
			this.channel_vidindex[this.channel] = index;
		}
	},

	//on curr error remove the video
	removeCurrVideo: function(){
		this.vidlists[this.channel].splice(this.channel_vidindex[this.channel],1);
	},

	//on error remove the video
	removeNextVideo: function(){
		this.vidlists[this.channel].splice(this.channel_vidindex[this.channel]+1,1);
	},

	//find video and return the index if within maxindex
	findVideo: function(videoId, maxIndex){
		for(var i = 0; i < this.vidlists[this.channel].length && i < maxIndex; i++){
			if(this.vidlists[this.channel][i][0]==videoId){
				console.log(i);
				return i;
			}
		}
		return -1;
	},

	insertVideo: function(channel, index, vidinfo){
		//console.log(channel + " " + vidinfo[0] + vidinfo[1]);
		this.vidlists[channel].unshift(vidinfo);
	},

	//set the video list for the channels
	putList: function(channel,queue){
		this.vidlists[channel] = queue;
	},

	getList: function(channel){
		return this.vidlists[channel];
	},

	next: function(){
		this.channel_vidindex[this.channel] = this.channel_vidindex[this.channel]+1;
		if(this.channel_vidindex[this.channel] >= this.vidlists[this.channel].length)
			this.channel_vidindex[this.channel] = 0;
	},

	prev: function(){
		this.channel_vidindex[this.channel] = this.channel_vidindex[this.channel]-1;
	}
};

//deal with wrapping issues of queue










