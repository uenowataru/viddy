var reddit = require("./RedditVideos.js");
var yttrends = require("./YTTrendsVideos.js");

module.exports = {
  getRedditJSON: function () {
	return reddit.getRedditJSON();
  },

  getYTTrendsJSON: function () {
	return yttrends.getYTTrendsJSON();
  }
};