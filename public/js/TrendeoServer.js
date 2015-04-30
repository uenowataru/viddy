var queue = [];
var called = 0;

function loadVideos() {
	if(called++ > 0) return;
	
	var resourceUrl = "/api/all";
	return $.getJSON(resourceUrl, procVideos);
}

function procVideos(data){
	$.each(data, function(i, item){
		var vidurl = item[0];
		var vidtitle = item[1];
		queue.push([vidurl, vidtitle]);
	});
}
