function PlayerManager(ytHandler, videoManager, uiController) {
  var playerManager = this;
  var curr = null;
  var prev = null;
  var next = null;
  var temp = null;
  var currdisp = "#curr";
  var nextdisp = "#next";
  var prevdisp = "#prev";
  var initialPlay = true;

  this.setUp = function(){
    setUp();
  }

  function setUp(){
    setChannelFromURL();
    var channel = videoManager.getCurrChannel();
    var asyncstatus = videoManager.loadVideos(channel);
    if(asyncstatus){
      asyncstatus.always(function() { //is returned as deffered object
        setVideoFromURL();
        initIFrames();
        ytHandler.initSetUp();
      });
    }else{
      setVideoFromURL();
      initIFrames();
      ytHandler.initSetUp();
    }
  };

  this.setNewChannel = function(channel){
    setNewChannel(channel);
  }

  function setNewChannel(channel){
    var asyncstatus = videoManager.loadVideos(channel);
    if(asyncstatus){
      asyncstatus.always(function(){
        videoManager.setCurrChannel(channel);
        setNewVideos(videoManager.getCurrVideo()[0], videoManager.getPrevVideo()[0], videoManager.getNextVideo()[0]);
      });
    }else{
      videoManager.setCurrChannel(channel);
      setNewVideos(videoManager.getCurrVideo()[0], videoManager.getPrevVideo()[0], videoManager.getNextVideo()[0]);
    }
  };

  function initSearchedVideos(){
    var channel = 'searched';
    var searchedvideos = search.getSearchedVideos();
    if(searchedvideos.length > 0){
      videoManager.setCurrChannel(channel);
      videoManager.putList(channel, searchedvideos);
      setNewVideos(videoManager.getCurrVideo()[0], videoManager.getPrevVideo()[0], videoManager.getNextVideo()[0]);
    }
  };

  function initIFrames(){
    curr = ytHandler.newYTPlayer('curr', videoManager.getCurrVideo()[0], onPlayerReady, onPlayerError, onPlayerStateChange);
    prev = ytHandler.newYTPlayer('prev', videoManager.getPrevVideo()[0], onPlayerReady, onPlayerError, onPlayerStateChange);
    next = ytHandler.newYTPlayer('next', videoManager.getNextVideo()[0], onPlayerReady, onPlayerError, onPlayerStateChange);
    setInterval(function(){
    try{
      $( "#timebar").width(ytHandler.getVideoProgress(curr) + '%');
    } catch(err){
      //err
    }
    },50);
  };

  this.loadSearchedVideos = function(){
    loadSearchedVideos();
  }

  function loadSearchedVideos(){
    var asyncstatus = search.loadVideos(search.search_str);
    if(asyncstatus){
      asyncstatus.always(function(){
        initSearchedVideos();
      });
    }else{
      initSearchedVideos();
    }
  };

  function onPlayerError(event) {
    if(event.target == curr){
      videoManager.removeCurrVideo();
      ytHandler.loadYTVideo(curr, videoManager.getCurrVideo()[0]);
      ytHandler.loadYTVideo(next, videoManager.getNextVideo()[0]);
    }
    if(event.target == next){
      videoManager.removeNextVideo();
      ytHandler.loadYTVideo(next, videoManager.getNextVideo()[0]);
    }
  };

  function setNewVideos(currVid, prevVid, nextVid){
    ytHandler.loadYTVideo(curr, currVid);
    ytHandler.loadYTVideo(prev, prevVid);
    ytHandler.loadYTVideo(next, nextVid);
  };


  this.nextVideo = function(){
    nextVideo();
  }

  function nextVideo() {
    if(videoManager.getCurrIndex() == videoManager.getListLength()-1){
      videoManager.next();
      ytHandler.loadYTVideo(curr, videoManager.getCurrVideo()[0]);
      ytHandler.loadYTVideo(next, videoManager.getNextVideo()[0]);
      return;
    }

    //pause the curr video before moving onto the next one
    ytHandler.pauseYTVideo(curr);

    temp = prev;
    prev = curr;
    curr = next;
    next = temp;
    
    //start the curr video.
    ytHandler.playYTVideo(curr);

    videoManager.next();
    if( videoManager.getCurrIndex() < videoManager.getListLength() - 1)
      ytHandler.loadYTVideo(next, videoManager.getNextVideo()[0]);

    ytHandler.seekYT(prev, 0);
    ytHandler.seekYT(next, 0);

    temp = prevdisp;
    prevdisp = currdisp;
    currdisp = nextdisp;
    nextdisp = temp;
    $( currdisp ).css( "display", "block" );
    $( nextdisp ).css( "display", "none" );
    $( prevdisp ).css( "display", "none" );

    // if(videoManager.getCurrIndex() > videoManager.getListLength() - 10)
    //   loadVideos();

    uiController.loadTitle(videoManager.getCurrVideo()[1]);
    uiController.animateTimeBar();

    // if(userControl.mouseOnR == true){
    uiController.setThumbnailImageR(videoManager.getNextVideo()[0]);
    // }
    // if(userControl.mouseOnL == true){
    uiController.setThumbnailImageL(videoManager.getPrevVideo()[0]);
    // }
  };

  this.previousVideo = function(){
    previousVideo();
  }

  function previousVideo() {
    if (videoManager.getCurrIndex() == 0){
      seekYT(curr,0);
      return;
    } 
    ytHandler.pauseYTVideo(curr);

    temp = next;
    next = curr;
    curr = prev;
    prev = temp;

    ytHandler.playYTVideo(curr);

    videoManager.prev();
    if( videoManager.getCurrIndex() > 0)
      ytHandler.loadYTVideo(prev, videoManager.getPrevVideo()[0]);

    ytHandler.seekYT(prev,0);
    ytHandler.seekYT(next, 0);

    temp = nextdisp;
    nextdisp = currdisp;
    currdisp = prevdisp;
    prevdisp = temp;

    $( currdisp ).css( "display", "block" );
    $( nextdisp ).css( "display", "none" );
    $( prevdisp ).css( "display", "none" );

    uiController.loadTitle(videoManager.getCurrVideo()[1]);
    uiController.animateTimeBar();

    // if(userControl.mouseOnR == true){
    uiController.setThumbnailImageR(videoManager.getNextVideo()[0]);
    // }
    // if(userControl.mouseOnL == true){
    uiController.setThumbnailImageL(videoManager.getPrevVideo()[0]);
    // }
  };

  function changeURL(videoId){
    window.history.replaceState("object", "Trendeo: Trending Videos of Now", "/ch/" + videoManager.getCurrChannel() + "/" + videoId);
  };

  function setVideoFromURL(){
    if (window.location.hash == '#_=_') {
      window.location.hash = ''; // for older browsers, leaves a # behind
      history.replaceState('', document.title, window.location.pathname); // nice and clean
      //e.preventDefault(); // no page reload
    }
    var videoId = parseInfoFromURL()[1];
    return videoManager.setCurrVideo(videoId);
  };

  function setChannelFromURL(){
    var channel = parseInfoFromURL()[0];
    if(channel == 'liked'){
      videoManager.setCurrChannel('all');
    }else if(channel == 'searched'){
      videoManager.setCurrChannel('all');
    }else if(channel.length > 0){
      videoManager.setCurrChannel(channel);
    }else
      videoManager.setCurrChannel('all');
  }

  function initLikedVideos(user){
    var channel = 'liked';
    var likedvideos = user.getLikedVideos();
    if(likedvideos.length > 0){
      videoManager.setCurrChannel(channel);
      videoManager.putList(channel, likedvideos);
      setNewVideos(videoManager.getCurrVideo()[0], videoManager.getPrevVideo()[0], videoManager.getNextVideo()[0]);
    }
  };

  this.skipVideoTo = function(index){
    skipVideoTo(index);
  }

  function skipVideoTo(index){
    var totaltime = ytHandler.getYTDuration(curr);
    var nowtime = ytHandler.getYTCurrentTime(curr);
    if(index == -1){    //rewind
      index = (10*nowtime/totaltime - 1) * totaltime / 10;
    }
    if(index == -2){    //fastforward
      index = (10*nowtime/totaltime + 1) * totaltime / 10;
    }
    if(index == -3){    //rewind little
      index = ytHandler.getYTCurrentTime(curr) - 3.5;
    }
    if(index == -4){    //fastforward little
      index = ytHandler.getYTCurrentTime(curr) + 3;
    }
    if(index < 0){
      if(videoManager.getCurrIndex() == 0){
        ytHandler.seekYT(curr,0);
      }
      previousVideo();
      uiController.animateTitle();
      return;
    }
    if(index >= totaltime){
      nextVideo();
      uiController.animateTitle();
      return;
    }
    ytHandler.seekYT(curr,index);
  };

  function loadLikedVideos(user){
    var asyncstatus = user.loadVideos();
    if(asyncstatus){
      asyncstatus.always(function(){
        playerManager.initLikedVideos(user);
      });
    }else{
      initLikedVideos(user);
    }
  };

  function parseInfoFromURL(){
    var currurl = window.location.href;
    if(currurl.indexOf("/ch/") > 0){
      var churl = currurl.substring(currurl.indexOf("/ch/") + 4);
      var channel = churl.substring(0, churl.indexOf("/"));
      var videoId = churl.substring(churl.indexOf("/") + 1);
      if(channel.length == 0){
        channel = churl;
        videoId = "";
      }

      return [channel, videoId];
    }else{
      return ["",""];
    }
  }

  function onPlayerReady(event) {
    if(curr == event.target){
      currready = true;
      if(initialPlay){
        setTimeout(function(){
          $( currdisp ).css( "display", "block" );
          ytHandler.seekYT(curr, 0);
          initialPlay = false;
        }, 1000);
      }
    }
    if(prev == event.target){
      prevready = true;
    }
    if(next == event.target){
      nextready = true;
    }
  };

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  //

  function onPlayerStateChange(event) {
    if(event.data == YT.PlayerState.UNSTARTED){
      ytHandler.playYTVideo(event.target);
      if(event.target == curr){
        $( "#bowlG" ).remove();
      }
    }
    if (event.data == YT.PlayerState.PLAYING) {
      changeURL(videoManager.getCurrVideo()[0]);
      ytHandler.pauseYTVideo(prev);
      ytHandler.pauseYTVideo(next);
      document.activeElement.blur();

      uiController.loadTitle(videoManager.getCurrVideo()[1]);
      uiController.animateTitle();
      uiController.setChannelName(videoManager.getCurrChannel());
      uiController.animateChannels();
    }

    if (event.data == YT.PlayerState.ENDED) {
      nextVideo();
      uiController.animateTitle();
    }
  };

  function skipVideoTime(sec){
    var nowtime = ytHandler.getYTCurrentTime(curr);
    if(nowtime+sec < ytHandler.getYTDuration(curr)){
      ytHandler.seekYT(curr,nowtime+sec);
    }else{
      nextVideo();
      uiController.animateTitle();
    }
  };

  this.getYTCurrentTime = function(ytPlayer){
    return ytHandler.getYTCurrentTime(ytPlayer);
  };

  this.pauseVideo = function(){
    ytHandler.pauseYTVideo(curr);
  };

  this.getCurrentTime = function(){
    return ytHandler.getYTCurrentTime(curr);
  };

  this.togglePlayPause = function(){
    togglePlayPause();
  };
  function togglePlayPause(){
    if(ytHandler.getYTPlayerState(curr)==2)
      ytHandler.playYTVideo(curr);
    else
      ytHandler.pauseYTVideo(curr);
  };

}
