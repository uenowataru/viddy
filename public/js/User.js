var user;

function User(userId, accessToken) {
	this.userId = userId;
	this.accessToken = accessToken;
	this.likedVideos;
}

user = new User('10152922385272087', '');

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
		if(this.userId==undefined) return;
		var resourceUrl = "/api/user/" + userId;
		return $.getJSON(resourceUrl, function(data){
			user.likedVideos = data;
		});
	},

	getLikedVideos: function(){
		return this.likedVideos;
	},

	likeVideo: function(video){
		var resourceUrl = "/api/user/" + this.userId;
		var data = {'updown':'up','video':video};
		return $.post(resourceUrl, data, function(resp){
			console.log(resp);
		}, 'json');
	}
};








