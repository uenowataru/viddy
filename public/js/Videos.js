function VideoList() {
	this.vidlists = {};
	this.channel_vidindex = {};
	this.channels = ['all', 'videos', 'gopro', 'youtubehaiku', 'bloopers', 'funnyvideos', 'fail', 'UnexpectedThugLife',
	'StandUpComedy', 'deepintoyoutube', 'ContagiousLaughter','LearnUselessTalents', 'movietrailers', 'musicvideos',
	'Music', 'listentothis', 'hiphopheads', 'sports' , 'nba', 'soccer', 'nfl','PublicFreakout', 'StreetFights', 'respectporn',
	'kidsafevideos'];
	this.channel = "all";
	this.channel_index = 0;
	this.loading = false;
}



function loadVideos() {
	var channel = video_list.getCurrChannel();
	var resourceUrl = "/api/" + channel;
	video_list.channel_vidindex[channel] = 0;
	return $.getJSON(resourceUrl, function(data){
		procVideos(data, channel);
	});
}

function procVideos(data, channel){
	var queue = [];
	
	$.each(data, function(i, item){
		if(item==undefined) return;
		var vidurl = item[0];
		var vidtitle = item[1];
		//var subreddit = item[2];
		queue.push([vidurl, vidtitle]);
	});

	video_list.putList(channel,queue);
}

VideoList.prototype = {
	getCurrVideo: function(){
		var currindex = this.channel_vidindex[this.channel];
		//console.log(Object.keys(this.vidlists));
		//console.log(this.channel);
		//console.log(this.vidlists[this.channel]);
		return this.vidlists[this.channel][currindex];
	},

	getNextVideo: function(){
		var currindex = this.channel_vidindex[this.channel];
		return this.vidlists[this.channel][currindex+1];
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
		this.channel_vidindex[this.channel] = this.findVideo(videoId, this.getListLength());
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
				return i;
			}
		}

		//add the video to the beginning of the list 
		///this.vidlists[this.channel] = videoId;

		// var url = "http://youtube.com/oembed?url=http://www.youtube.com/watch?v=" + videoId + "&format=json";
		// $.getJSON(url, function(data){
		// 	console.log(data.title);
		// 	var title = data.title;
		// 	this.vidlists[this.channel].unshift([videoId, title]);
		// });

		return 0;
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
	},

	prev: function(){
		this.channel_vidindex[this.channel] = this.channel_vidindex[this.channel]-1;
	}
};

//deal with wrapping issues of queue










