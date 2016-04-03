
function User(userId, accessToken) {
	var userId = userId;
	var accessToken = accessToken;
	var likedVideos = [];
	var updated = false;
	var user = this;

	this.getUserId = function(){
		return userId;
	};

	this.setUserId = function(userId){
		this.userId = userId;
	};

	this.getAccessToken = function(){
		return accessToken;
	};

	this.setAccessToken = function(accessToken){
		this.accessToken = accessToken;
	};

	this.loadVideos = function(){
		if(accessToken==undefined || updated) return;
		var resourceUrl = "/api/user/" + accessToken;
		return $.getJSON(resourceUrl, function(data){
			user.setLikedVideos(data);
			user.updated = true;
		});
	};

	this.getLikedVideos = function(){
		return likedVideos;
	};

	this.setLikedVideos = function(videos){
		likedVideos = videos;
	};

	this.likeVideo = function(video){
		var resourceUrl = "/api/user/" + this.accessToken;
		var data = {'updown':'up','video':video};
		var user = this;
		return $.post(resourceUrl, data, function(resp){
			console.log(resp);
			user.updated = false;
		}, 'json');
	};
};






