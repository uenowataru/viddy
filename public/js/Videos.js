function VideoList() {
	this.vidlists = {};
	this.channel_vidindex = {};
	this.channels = ['all', 'gopro', 'youtubehaiku', 'bloopers', 'funnyvideos', 'fail', 'UnexpectedThugLife',
	'StandUpComedy', 'deepintoyoutube', 'ContagiousLaughter','LearnUselessTalents', 'musicvideos',
	'Music', 'trailers', 'sports' , 'nba', 'soccer', 'nfl','PublicFreakout', 'StreetFights', 'respectporn',
	'kidsafevideos'];
	this.channel = "all";
	this.channel_index = 0;
	this.loading = false;
}



function loadVideos() {
	var channel = video_list.getCurrChannel();
	var resourceUrl = "/api/ch/" + channel;
	video_list.channel_vidindex[channel] = 0;
	console.log(channel);
	return $.getJSON(resourceUrl, function(data){
		console.log(channel);
		procVideos(data, channel);
	});
}

function procVideos(data, channel){
	var queue = [];

	console.log(channel + ":" + data);
	
	$.each(data, function(i, item){
		console.log(item);
		if(item==undefined) return;
		var vidurl = item[0];
		var vidtitle = item[1];
		//var subreddit = item[2];
		queue.push([vidurl, vidtitle]);
	});

	console.log(channel + ":" + queue.length);

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
		var url = "/api/vid/" + videoId;
		$.getJSON(url, function(data){
			if(data.length > 1){
				console.log(data[0]);
				var title = data[1];
				this.vidlists[this.channel].unshift([videoId, title]);
			}
		});
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
		if(this.channel_vidindex[this.channel] >= this.vidlists[this.channel].length)
			this.channel_vidindex[this.channel] = 0;
	},

	prev: function(){
		this.channel_vidindex[this.channel] = this.channel_vidindex[this.channel]-1;
	}
};

//deal with wrapping issues of queue










