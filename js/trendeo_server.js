var queue = [];
var randomize = false;
var called = 0;

function loadVideos() {
	if(called++ > 0) return;
	
	var resourceUrl = "trendeo.herokuapp.com/all";
	return $.getJSON(resourceUrl, procVideos);
}

function procVideos(data){
	$.each(data, function(i, item){
		var vidurl = item[0];
		var vidtitle = item[1];
		queue.push([vidurl, vidtitle]);
	});
	shuffle(queue);
}

function shuffle(o){
	if(randomize) for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
}

