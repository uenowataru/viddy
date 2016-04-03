function VideoManager() {
	var vidlists = {};
	var channel_vidindex = {};
	var channels = ['all', 'gopro', 'youtubehaiku', 'bloopers', 'funnyvideos', 'fail', 'UnexpectedThugLife',
	'StandUpComedy', 'deepintoyoutube', 'ContagiousLaughter','LearnUselessTalents', 'trailers', 'musicvideos',
	'Music', 'sports' , 'nba', 'soccer', 'nfl','PublicFreakout', 'StreetFights', 'respectporn',
	'kidsafevideos'];
	var channel = 'all';
	var channel_index = 0;
	var loading = false;
	
	this.loadVideos = function(channel){
		return loadVideos(channel);
	};

	function loadVideos(channel) {
		if(getList(channel)!=undefined){
			return;
		}
		var resourceUrl = "/api/ch/" + channel;
		return $.getJSON(resourceUrl, function(data){
			procVideos(data, channel);
		});
	};

	function loadVideo(channel, videoId){
		var url = "/api/vid/" + videoId;
		return $.getJSON(url, function(data){
			if(data.length > 1){
				var title = data[1];
				var index = 0;
				insertVideo(channel, index, [videoId, title]);
				setChannelVidIndex(channel, index);
			}
		});
	};

	function loadChannels(){
		loadVideos(getNextChannel());
		loadVideos(getPrevChannel());
	}

	this.procVideos = function(data, channel) {
		procVideos(data, channel);
	};

	function procVideos(data, channel){
		var queue = [];
		
		$.each(data, function(i, item){
			if(item==undefined) return;
			var vidurl = item[0];
			var vidtitle = item[1];
			var subreddit = item[2];
			queue.push([vidurl, vidtitle, subreddit]);
		});

		if(getList(channel)==undefined){
			putList(channel,queue);
		}else{
			//console.log(channel + ' vids defined');
		}
	};

	this.likeCurrVideo = function(){
		likeCurrVideo();
	}

	function likeCurrVideo(){
		try{
			if(user==undefined) return;
			user.likeVideo(getCurrVideo());
		}catch(err){
			console.log(err.stack);
		}	
	};

	this.getCurrVideo = function(){
		return getCurrVideo();
	}

	function getCurrVideo(){
		var currindex = channel_vidindex[channel];
		// console.log(Object.keys(vidlists));
		// console.log(channel_vidindex[Object.keys(channel_vidindex)[0]]);
		// console.log(channel);
		// console.log(currindex);
		// console.log(vidlists[channel]);
		return vidlists[channel][currindex];
	};

	this.getNextVideo = function(){
		return getNextVideo();
	}
	function getNextVideo(){
		var currindex = channel_vidindex[channel];
		return vidlists[channel][currindex < vidlists[channel].length - 1 ? currindex + 1 : 0];
	};

	this.getPrevVideo = function(){
		return getPrevVideo();
	}

	function getPrevVideo(){
		var currindex = channel_vidindex[channel];
		return vidlists[channel][currindex > 0 ? currindex-1 : currindex];
	};

	this.getCurrIndex = function(){
		return getCurrIndex();
	}
	function getCurrIndex(){
		return channel_vidindex[channel];
	};

	this.getListLength = function(){
		return getListLength();
	};

	function getListLength(){
		// console.log(channel);
		// console.log(Object.keys(vidlists));
		// console.log(vidlists);
		// console.log(channel_vidindex);
		if(vidlists[channel]==undefined) 
			return 0;
		else
			return vidlists[channel].length;
	};

	this.getCurrChannel = function(){
		return getCurrChannel();
	}

	//get the current channel
	function getCurrChannel(){
		return channel;
	};

	this.setCurrChannel = function(channel){
		setCurrChannel(channel);
	}

	//set the current channel
	function setCurrChannel(newChannel){
		channel = newChannel;
		channel_vidindex[channel] = 0;
		channel_index = getChannelIndex(channel);
		loadChannels();
	};

	function nextChannel(){
		channel_index += 1;
		if(channel_index >= channels.length)
			channel_index = 0;
		setCurrChannel(channels[channel_index]);
	};

	function prevChannel(){
		channel_index -= 1;
		if(channel_index < 0)
			channel_index = channels.length-1;
		setCurrChannel(channels[channel_index]);
	};

	function getNextChannel(){
		var nextchan_index = channel_index < channels.length - 1 ? channel_index + 1 : 0;
		return channels[nextchan_index];
	}

	function getPrevChannel(){
		var prevchan_index = channel_index > 0 ?  channel_index - 1 : channels.length-1;
		return channels[prevchan_index];
	}

	function setChannelVidIndex(channel, index){
		channel_vidindex[channel] = index;
	};

	function getChannelIndex(channel){
		if(channels.indexOf(channel) < 0){
			channels.push(channel);
			channel_index = findChannelIndex(channel);
		}
		return channel_index;
	}

	this.setCurrVideo = function(videoId){
		setCurrVideo(videoId);
	};

	//set the curr video to be the videoid
	function setCurrVideo(videoId){
		var index = findVideo(videoId, getListLength());

		if(index < 0){
			return loadVideo(channel, videoId);
		}else{
			channel_vidindex[channel] = index;
		}
	};

	this.removeCurrVideo = function(){
		removeCurrVideo();
	};
	//on curr error remove the video
	function removeCurrVideo(){
		vidlists[channel].splice(channel_vidindex[channel],1);
	};

	this.removeNextVideo = function(){
		removeNextVideo();
	};

	//on error remove the video
	function removeNextVideo(){
		vidlists[channel].splice(channel_vidindex[channel]+1,1);
	};

	//find video and return the index if within maxindex
	function findVideo(videoId, maxIndex){
		for(var i = 0; i < vidlists[channel].length && i < maxIndex; i++){
			if(vidlists[channel][i][0]==videoId){
				//console.log(i);
				return i;
			}
		}
		return -1;
	};

	function insertVideo(channel, index, vidinfo){
		vidlists[channel].unshift(vidinfo);
	};

	//set the video list for the channels
	function putList(channel,queue){
		vidlists[channel] = queue;
	};

	function getList(channel){
		return vidlists[channel];
	};

	this.next = function(){
		next();
	}
	function next(){
		channel_vidindex[channel] = channel_vidindex[channel]+1;
		if(channel_vidindex[channel] >= vidlists[channel].length)
			channel_vidindex[channel] = 0;
	};

	this.prev = function(){
		prev();
	}
	function prev(){
		channel_vidindex[channel] = channel_vidindex[channel]-1;
	};
};





