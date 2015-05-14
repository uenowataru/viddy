function VideoList() {
	this.vidlists = {};
	this.channel_vidindex = {};
	this.channels = ['all', 'gopro', 'youtubehaiku', 'bloopers', 'funnyvideos', 'fail', 'UnexpectedThugLife',
	'StandUpComedy', 'deepintoyoutube', 'ContagiousLaughter','LearnUselessTalents', 'trailers', 'musicvideos',
	'Music', 'sports' , 'nba', 'soccer', 'nfl','PublicFreakout', 'StreetFights', 'respectporn',
	'kidsafevideos'];
	this.channel = 'all';
	this.channel_index = 0;
	this.loading = false;
}

function loadVideos(channel) {
	if(video_list.getList(channel)!=undefined){
		return;
	}else{
	}
	var resourceUrl = "/api/ch/" + channel;
	return $.getJSON(resourceUrl, function(data){
		procVideos(data, channel);
	});
}

function loadVideo(channel, videoId){
	var url = "/api/vid/" + videoId;
	return $.getJSON(url, function(data){
		if(data.length > 2){
			var title = data[1];
			var index = 0;
			video_list.insertVideo(channel, index, [videoId, title]);
			video_list.setChannelVidIndex(channel, index);
		}
	});
}

function loadChannels(){
	loadVideos(video_list.getNextChannel());
	loadVideos(video_list.getPrevChannel());
}

function prevChannel(){
	video_list.prevChannel();
	setNewChannel(video_list.getCurrChannel());
}

function nextChannel(){
	video_list.nextChannel();
	setNewChannel(video_list.getCurrChannel());
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

	if(video_list.getList(channel)==undefined){
		video_list.putList(channel,queue);
	}else{
		//console.log(channel + ' vids defined');
	}
		
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
		return this.vidlists[this.channel][currindex < this.vidlists[this.channel].length - 1 ? currindex + 1 : 0];
	},

	getPrevVideo: function(){
		var currindex = this.channel_vidindex[this.channel];
		return this.vidlists[this.channel][currindex > 0 ? currindex-1 : currindex];
	},

	getCurrIndex: function(){
		return this.channel_vidindex[this.channel];
	},

	getListLength: function(){
		// console.log(this.channel);
		// console.log(Object.keys(this.vidlists));
		// console.log(this.vidlists);
		// console.log(this.channel_vidindex);
		if(this.vidlists[this.channel]==undefined) 
			return 0;
		else
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
		this.channel_index = this.findChannelIndex(channel);
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

	getNextChannel: function(){
		var nextchan_index = this.channel_index < this.channels.length - 1 ? this.channel_index + 1 : 0;
		return this.channels[nextchan_index];
	},

	getPrevChannel: function(){
		var prevchan_index = this.channel_index > 0 ?  this.channel_index - 1 : this.channels.length-1;
		return this.channels[prevchan_index];
	},

	setChannelVidIndex: function(channel, index){
		this.channel_vidindex[channel] = index;
	},

	findChannelIndex: function(channel){
		return this.channels.indexOf(channel);
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
				//console.log(i);
				return i;
			}
		}
		return -1;
	},

	insertVideo: function(channel, index, vidinfo){
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





