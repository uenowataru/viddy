

function VideoList() {
	this.vidlists = {};
	this.channel_index = {};
	this.channel = "all";
	this.channel_index["all"] = 0;
	this.loading = false;
}


function loadVideos() {
	var channel = video_list.getCurrChannel();
	var resourceUrl = "/api/" + channel;
	return $.getJSON(resourceUrl, function(data){
		procVideos(data, channel);
	});
}

function procVideos(data, channel){
	var queue = [];

	$.each(data, function(i, item){
		var vidurl = item[0];
		var vidtitle = item[1];
		queue.push([vidurl, vidtitle]);
	});

	video_list.putList(channel,queue);
}

VideoList.prototype = {
	getCurrVideo: function(){
		var currindex = this.channel_index[this.channel];
		return this.vidlists[this.channel][currindex];
	},

	getNextVideo: function(){
		var currindex = this.channel_index[this.channel];
		return this.vidlists[this.channel][currindex+1];
	},

	getPrevVideo: function(){
		var currindex = this.channel_index[this.channel];
		return this.vidlists[this.channel][currindex > 0 ? currindex-1 : currindex];
	},


	getCurrIndex: function(){
		return this.channel_index[this.channel];
	},


	next: function(){
		this.channel_index[this.channel] = this.channel_index[this.channel]+1;
	},

	prev: function(){
		this.channel_index[this.channel] = this.channel_index[this.channel]-1;
	},

	getListLength: function(){
		return this.vidlists[this.channel].length;
	},

	findVideo: function(videoId, maxIndex){
		for(var i = 0; i < this.vidlists[this.channel].length && i < maxIndex; i++){
			if(this.vidlists[this.channel][i][0]==videoId){
				return i;
			}
		}
		return 0;
	},

	//on curr error remove the video
	removeCurrVideo: function(){
		this.vidlists[this.channel].splice(this.channel_index[this.channel],1);
	},

	//on error remove the video
	removeNextVideo: function(){
		this.vidlists[this.channel].splice(this.channel_index[this.channel]+1,1);
	},

	setCurrVideo: function(videoId){
		this.channel_index[this.channel] = this.findVideo(videoId, this.getListLength());
	},

	putList: function(channel,queue){
		this.vidlists[channel] = queue;
	},

	getCurrChannel: function(){
		return this.channel;
	}
};

//deal with wrapping issues of queue







