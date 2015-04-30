function VideoList() {
	this.lists = {};
	this.channel_index = {};
	this.channel = "all";
	this.init = function(){
		this.channel_index["all"] = 0;
	};
}

VideoList.prototype.getCurrVideo = function(){
	var currindex = this.channel_index[this.channel];
	return this.lists[this.channel][currindex];
};

VideoList.prototype.getNextVideo = function(){
	var currindex = this.channel_index[this.channel];
	return this.lists[this.channel][currindex+1];
};

VideoList.prototype.getPrevVideo = function(){
	var currindex = this.channel_index[this.channel];
	return this.lists[this.channel][currindex-1];
};

VideoList.prototype.changeChannel = function(channel){
	this.channel = channel;
};

VideoList.prototype.putList = function(channel,queue){
	this.lists[channel] = queue;
};