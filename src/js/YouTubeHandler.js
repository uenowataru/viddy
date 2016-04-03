//TODO: change the on youtube iframe api ready call to be a internal call??

function YTHandler() {
  var MAX_REWIND_INDEX = 50;
  var MAX_TIME_PAST = 60*60;
  var TIME_PAST_PICKUP = 15*60;
  var playerReadyInterval = null; 
  var disablePlayerReadyInterval = null;
  
  /*
    initializes yt cache provider
    initializes the videos from url
    intializes the frames
    */ 
  this.initSetUp = function(){
    var currtime = new Date().getTime() / 1000;
  };

  this.stopVideo = function(){
    stopVideo();
  };
  function stopVideo() {
    player.stopVideo();
  };

  this.getVideoProgress = function(curr){
    return getVideoProgress(curr);
  }
  function getVideoProgress(curr){
    var totaltime = getYTDuration(curr);
    var nowtime = getYTCurrentTime(curr);
    return totaltime > 0 ? 100 * nowtime / totaltime : 0;
  };

  this.getYTDuration = function(ytplayer){
    return getYTDuration(ytplayer);
  }
  function getYTDuration(ytplayer){
    return ytplayer.getDuration();
  };

  this.getYTCurrentTime = function(ytplayer){
    return getYTCurrentTime(ytplayer);
  };

  function getYTCurrentTime(ytplayer){
      return ytplayer.getCurrentTime();
  };

  this.pauseYTVideo = function(ytplayer){
    pauseYTVideo(ytplayer);
  }

  function pauseYTVideo(ytplayer){
      ytplayer.pauseVideo();
  };

  this.playYTVideo = function(ytplayer){
    playYTVideo(ytplayer);
  };

  function playYTVideo(ytplayer){
      ytplayer.playVideo();
  };

  this.getYTPlayerState = function(ytplayer){
    return getYTPlayerState(ytplayer);
  }
  function getYTPlayerState(ytplayer){
      return ytplayer.getPlayerState();
  };

  this.loadYTVideo = function(ytplayer, videoId){
    loadYTVideo(ytplayer, videoId);
  };
  function loadYTVideo(ytplayer, videoId){
      ytplayer.loadVideoById({'videoId': videoId, 'startSeconds': 0, 'suggestedQuality': 'large'});
  };

  this.seekYT = function(ytplayer, position){
    seekYT(ytplayer, position);
  }
  function seekYT(ytplayer, position){
      ytplayer.seekTo(position);
  };

  this.newYTPlayer = function(tag, videoId, onPlayerReady, onPlayerError, onPlayerStateChange){
    return newYTPlayer(tag, videoId, onPlayerReady, onPlayerError, onPlayerStateChange);
  }

  function newYTPlayer(tag, videoId, onPlayerReady, onPlayerError, onPlayerStateChange){
    return new YT.Player(tag, {
      height: '390',
      width: '640',
      videoId: videoId,
      playerVars: {
        'autoplay': 0,
        'showinfo': 0,
        'controls': 0,
        'iv_load_policy': 3,
        'disablekb': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onError': onPlayerError,
        'onStateChange': onPlayerStateChange
      }
    });
  };
}