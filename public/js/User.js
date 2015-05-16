var user;

function User(userId, accessToken) {
	this.userId = userId;
	this.accessToken = accessToken;
	this.likedVideos = [];
	this.updated = false;
}

User.prototype = {
	getUserId: function(){
		return this.userId;
	},

	setUserId: function(userId){
		this.userId = userId;
	},

	getAccessToken: function(){
		return this.accessToken;
	},

	setAccessToken: function(accessToken){
		this.accessToken = accessToken;
	},

	loadVideos: function(){
		if(this.userId==undefined || this.updated) return;
		var resourceUrl = "/api/user/" + this.userId;
		var user = this;
		return $.getJSON(resourceUrl, function(data){
			user.setLikedVideos(data);
			user.updated = true;
		});
	},

	getLikedVideos: function(){
		return this.likedVideos;
	},

	setLikedVideos: function(videos){
		this.likedVideos = videos;
	},

	likeVideo: function(video){
		var resourceUrl = "/api/user/" + this.accessToken;
		var data = {'updown':'up','video':video};
		var user = this;
		return $.post(resourceUrl, data, function(resp){
			console.log(resp);
			user.updated = false;
		}, 'json');
	}
};







