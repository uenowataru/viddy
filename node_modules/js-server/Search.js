function Search(){
	this.search_str = "";
	this.searchedVideos = [];
	this.searched = null;
}

Search.prototype = {
	loadVideos: function(query){
		var res = query.split(" ");
		var resourceUrl = "http://www.reddit.com/r/videos/search.json?q=";
		for( s in res){
			resourceUrl += s + ",";
		}
		resourceUrl += "&sort=top&restrict_sr=on";

		return $.getJSON(resourceUrl, function(data){
			search.searchedVideos = [];
			for(child in data["data"]["children"]){
				var title = child["data"]["title"];
				var videoId = search.getURLFromItem(child);

				search.searchedVideos.push([videoId, title]);

				// while( index >= 0 ){
				// 	var count = 24;
				// 	var inp = jsonstr.charAt(index + count);
				// 	while (/[a-zA-Z0-9-_ ]/.test(inp)){
				// 		count++;
				// 		inp = jsonstr.charAt(index + count);
				// 	}
				// 	if(index >= jsonstr.length-1) break;
				// 	if(count > 24){
				// 		search.searchedVideos.push([jsonstr.substring(index + 24, index + count), title]);
				// 		//console.log(jsonstr.substring(index + 24, index + count) + " " + jsonstr.substring(index , index + count));
				// 		break;
				// 	}else{
				// 		//console.log(jsonstr.substring(index + 24, index + count) + " " + jsonstr.substring(index , index + count));
				// 	}

				// 	index = jsonstr.indexOf("www.youtube.com/watch?v=", index+count);
				// }
			}

			search.searched = query;
			search.search_str = "";
		});
	},

	getSearchedVideos: function(){
		return this.searchedVideos;
	},

	getURLFromItem: function(item){
		var vidurl = "";

		if(item.data.domain == "youtube.com" || item.data.domain == "youtu.be"){
			if(item.data.secure_media != null && item.data.secure_media != undefined){
				vidurl = item.data.secure_media.oembed.url;
			}else if(item.data.media != null && item.data.secure_media != undefined){
				vidurl = item.data.media.oembed.url;
			}else if(item.data.url != null && item.data.url != undefined){
				vidurl = item.data.url;
			}

			console.log(item.data);

			var videoId = "";
			var count = 0;

			if(item.data.domain =="youtube.com"){
				count = vidurl.indexOf("v=") + 2;
			}else{
				count = vidurl.indexOf("youtu.be/") + 9;
			}
			
			var inp = vidurl.charAt(count);

			while (/[a-zA-Z0-9-_ ]/.test(inp)){
				videoId += inp;
				inp = vidurl.charAt(++count);
			}

			return videoId;
		}
		return "";
	}
};