function VideoList() {
	this.lists = {};
	this.channel_index = {};
	this.channel = "all";
	this.init = function(){
		this.channel_index["all"] = 0;
	};
}

VideoList.prototype.getCurrVideo = function(channel){
	
};

VideoList.prototype.getNextVideo = function(channel){
	
};

VideoList.prototype.getPrevVideo = function(channel){
	
};

VideoList.prototype.putList = function(channel,queue){
	this.lists[channel] = queue;
};