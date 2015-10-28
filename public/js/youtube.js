//TODO: change the on youtube iframe api ready call to be a internal call??



/*
  called when youtube iframe is ready
*/
function onYouTubeIframeAPIReady() {
  ythandler.setChannelFromURL();
  var channel = video_list.getCurrChannel();
  var asyncstatus = video_list.loadVideos(channel);
  if(asyncstatus){
    asyncstatus.always(function() { //is returned as deffered object
      ythandler.initSetUp();
    });
  }else{
    ythandler.initSetUp();
  }
}

function YTHandler() {
  this.curr = null;
  this.prev = null;
  this.next = null;
  this.temp = null;
  this.currdisp = "#curr";
  this.nextdisp = "#next";
  this.prevdisp = "#prev";
  this.currready = false;
  this.prevready = false;
  this.nextready = false;
  this.initialized = false;
  this.YTCache;
  this.lastPlayTime = 0;
  this.lastVisit = 0;
  this.MAX_REWIND_INDEX = 50;
  this.MAX_TIME_PAST = 60*60;
  this.TIME_PAST_PICKUP = 15*60;
  this.InitialPlay = true;
  this.playerReadyInterval;
  this.disablePlayerReadyInterval;
}

YTHandler.prototype = {
  /*
    Youtube iframe initialization
  */
  setup: function(){
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },

  /*
    initializes yt cache provider
    initializes the videos from url
    intializes the frames
    */ 

  initSetUp: function(){
    this.YTCache = new CacheProvider();
    this.initVideos();
    var currtime = new Date().getTime() / 1000;
    if(currtime > this.lastVisit + this.TIME_PAST_PICKUP){
      this.lastPlayTime = 0;
    }

    // setInterval(function(){
    //   try{
    //     YTCache.set('lastTime', Math.floor(getYTCurrentTime(curr)) + '', true);
    //     if(getYTDuration(curr) > 0 && getYTDuration(curr) - getYTCurrentTime(curr) < 0.7){
    //       nextVideo();
    //       animateTitle();
    //     }
    //   }catch(err){
    //     console.log(err);
    //   }
    // }, 500);
  },

  /*
    sets the video from url 
    */
  initVideos: function(){
    var asyncstatus = this.setVideoFromURL();
    if(asyncstatus){
      asyncstatus.always(function(){
        //video_list.setCurrVideo(videoId);
        ythandler.initIFrames();
      });
    }else{
      ythandler.initIFrames();
    }
  },

  initIFrames: function(){
    this.curr = this.newYTPlayer('curr', video_list.getCurrVideo()[0]);
    this.prev = this.newYTPlayer('prev', video_list.getPrevVideo()[0]);
    this.next = this.newYTPlayer('next', video_list.getNextVideo()[0]);
  },

  // 4. The API will call this function when the video player is ready.
  onPlayerReady: function(event) {
    if(ythandler.curr == event.target){
      ythandler.currready = true;
      if(ythandler.InitialPlay){
        setTimeout(function(){
          $( ythandler.currdisp ).css( "display", "block" );
          ythandler.seekYT(ythandler.curr, ythandler.lastPlayTime);
          ythandler.InitialPlay = false;
        }, 1000);
      }
    }
    if(ythandler.prev == event.target){
      ythandler.prevready = true;
    }
    if(ythandler.next == event.target){
      ythandler.nextready = true;
    }
  },


  onPlayerError: function(event) {
    if(event.target == ythandler.curr){
      video_list.removeCurrVideo();
      ythandler.loadYTVideo(ythandler.curr, video_list.getCurrVideo()[0]);
      ythandler.loadYTVideo(ythandler.next, video_list.getNextVideo()[0]);
    }
    if(event.target == ythandler.next){
      video_list.removeNextVideo();
      ythandler.loadYTVideo(ythandler.next, video_list.getNextVideo()[0]);
    }
  },

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  //

  onPlayerStateChange: function(event) {
    if(curr===undefined) return;
    if(event.data == YT.PlayerState.UNSTARTED){
      ythandler.playYTVideo(event.target);
      if(event.target == ythandler.curr){
        ythandler.initialized = true;
        $( "#bowlG" ).remove();
      }
    }
    if (event.data == YT.PlayerState.PLAYING) {
      ythandler.changeURL(video_list.getCurrVideo()[0]);
      ythandler.pauseYTVideo(ythandler.prev);
      ythandler.pauseYTVideo(ythandler.next);
      document.activeElement.blur();

      animation.loadTitle();
      animation.animateTitle();
      animation.loadChannels();
      animation.animateChannels();
      if(usercontrol.isMobile){
        
        //$('#glass').show();
      }
    }
    if (event.data == YT.PlayerState.ENDED)
      ythandler.nextVideo();
      animation.animateTitle();
  },

  stopVideo: function() {
    this.player.stopVideo();
  },

  nextVideo: function() {
    if(!this.initialized || this.curr===undefined) return;
    if(video_list.getCurrIndex() == video_list.getListLength()-1){
      video_list.next();
      this.loadYTVideo(this.curr, video_list.getCurrVideo()[0]);
      this.loadYTVideo(this.next, video_list.getNextVideo()[0]);
      return;
    }
    this.pauseYTVideo(this.curr);

    this.temp = this.prev;
    this.prev = this.curr;
    this.curr = this.next;
    this.next = this.temp;
    
    this.playYTVideo(this.curr);

    video_list.next();
    if( video_list.getCurrIndex() < video_list.getListLength() - 1)
      this.loadYTVideo(this.next, video_list.getNextVideo()[0]);

    this.seekYT(this.prev, 0);
    this.seekYT(this.next, 0);

    this.temp = this.prevdisp;
    this.prevdisp = this.currdisp;
    this.currdisp = this.nextdisp;
    this.nextdisp = this.temp;
    $( this.currdisp ).css( "display", "block" );
    $( this.nextdisp ).css( "display", "none" );
    $( this.prevdisp ).css( "display", "none" );

    // if(video_list.getCurrIndex() > video_list.getListLength() - 10)
    //   loadVideos();

    animation.loadTitle();
    animation.animateTimeBar();
    this.YTCache.set('lastVideo',video_list.getCurrVideo()[0], true);
    this.YTCache.set('lastVisit',Math.round(new Date().getTime() / 1000) + '', true);

    if(usercontrol.mouseOnR == true){
      usercontrol.setThumbnailImageR();
    }
    if(usercontrol.mouseOnL == true){
      usercontrol.setThumbnailImageL();
    }
  },

  previousVideo: function() {
    if(!this.initialized || this.curr===undefined) return;
    if (video_list.getCurrIndex() == 0){
      this.seekYT(this.curr,0);
      return;
    } 
    this.pauseYTVideo(this.curr);

    this.temp = this.next;
    this.next = this.curr;
    this.curr = this.prev;
    this.prev = this.temp;

    this.playYTVideo(this.curr);

    video_list.prev();
    if( video_list.getCurrIndex() > 0)
      this.loadYTVideo(this.prev, video_list.getPrevVideo()[0]);

    this.seekYT(this.prev,0);
    this.seekYT(this.next, 0);

    this.temp = this.nextdisp;
    this.nextdisp = this.currdisp;
    this.currdisp = this.prevdisp;
    this.prevdisp = this.temp;

    $( this.currdisp ).css( "display", "block" );
    $( this.nextdisp ).css( "display", "none" );
    $( this.prevdisp ).css( "display", "none" );

    animation.loadTitle();
    animation.animateTimeBar();
    this.YTCache.set('lastVideo', video_list.getCurrVideo()[0], true);
    this.YTCache.set('lastVisit', Math.round(new Date().getTime() / 1000) + '', true);

    if(usercontrol.mouseOnR == true){
      usercontrol.setThumbnailImageR();
    }
    if(usercontrol.mouseOnL == true){
      usercontrol.setThumbnailImageL();
    }
  },

  togglePlayPause: function(){
    if(this.curr===undefined || !this.initialized) return;
    if(this.getYTPlayerState(this.curr)==2)
      this.playYTVideo(this.curr);
    else
      this.pauseYTVideo(this.curr);
  },

  pauseVideo: function(){
    if(!this.initialized || this.curr===undefined) return;
    this.pauseYTVideo(this.curr);
  },

  getVideoProgress: function(){
    if(!this.initialized || this.curr===undefined || this.curr===null) return 0;
    var totaltime = this.getYTDuration(this.curr);
    var nowtime = this.getYTCurrentTime(this.curr);
    return totaltime > 0 ? 100 * nowtime / totaltime : 0;
  },

  skipVideoTo: function(index){
    if(!this.initialized || this.curr===undefined) return 0;
    var totaltime = this.getYTDuration(this.curr);
    var nowtime = this.getYTCurrentTime(this.curr);
    if(index == -1){    //rewind
      index = (10*nowtime/totaltime - 1) * totaltime / 10;
    }
    if(index == -2){    //fastforward
      index = (10*nowtime/totaltime + 1) * totaltime / 10;
    }
    if(index == -3){    //rewind little
      index = this.getYTCurrentTime(this.curr) - 3.5;
    }
    if(index == -4){    //fastforward little
      index = this.getYTCurrentTime(this.curr) + 3;
    }
    if(index < 0){
      if(video_list.getCurrIndex() == 0){
        this.seekYT(this.curr,0);
      }
      this.previousVideo();
      animation.animateTitle();
      return;
    }
    if(index >= totaltime){
      this.nextVideo();
      animation.animateTitle();
      return;
    }
    this.seekYT(this.curr,index);
  },

  skipVideoTime: function(sec){
    if(!this.initialized || this.curr===undefined) return 0;
    var nowtime = this.getYTCurrentTime(this.curr);
    if(nowtime+sec < this.getYTDuration(this.curr)){
      this.seekYT(this.curr,nowtime+sec);
    }else{
      this.nextVideo();
      animation.animateTitle();
    }
  },

  getYTDuration: function(ytplayer){
    try{
      return ytplayer.getDuration();
    }catch (err){
      this.YTError(ytplayer, err);
      return 0;
    }
  },

  getYTCurrentTime: function(ytplayer){
    try{
      return ytplayer.getCurrentTime();
    }catch (err){
      this.YTError(ytplayer, err);
      return 0;
    }
  },

  pauseYTVideo: function(ytplayer){
    try{
      ytplayer.pauseVideo();
    }catch (err){
      this.YTError(ytplayer, err);
    }
  },

  playYTVideo: function(ytplayer){
    try{
      ytplayer.playVideo();
      if(usercontrol.isMobile){
        console.log("Mobile:" + usercontrol.isMobile);
        //$('#glass').hide();
      }

    }catch (err){
      this.YTError(ytplayer, err);
    }
  },

  getYTPlayerState: function(ytplayer){
    try{
      return ytplayer.getPlayerState();
    }catch (err){
      this.YTError(ytplayer, err);
      return -1;
    }
  },

  loadYTVideo: function(ytplayer, videoId){
    try{
      ytplayer.loadVideoById({'videoId': videoId, 'startSeconds': 0, 'suggestedQuality': 'large'});
    }catch (err){
      this.YTError(ytplayer, err);
    }
  },

  seekYT: function(ytplayer, position){
    try{
      ytplayer.seekTo(position);
    }catch (err){
      this.YTError(ytplayer, err);
    }
  },

  replayVideo: function() {
    this.seekYT(curr, 0);
    this.playYTVideo(curr);
  },

  YTError: function(ytplayer, err){
    var tag;
    var videoId;
    if(ytplayer == this.curr){
      //alert('error curr');
      tag = this.currdisp.substring(1);
      videoId = video_list.getCurrVideo()[0];
      if(this.currready){
        //curr.getIframe().setAttribute("src", "https://www.youtube.com/embed/WsksFbFZeeU");
        this.curr.destroy();
        document.body.innerHTML += '<div id="' + tag +'"></div>';
        this.curr = this.newYTPlayer(tag,videoId);
        this.currready = false;
      }
      //curr = newYTPlayer(tag,videoId);
    }
    if(ytplayer == this.next){
      //alert('error next');
      tag = this.nextdisp.substring(1,this.nextdisp.length);
      videoId = video_list.getNextVideo()[0];
      if(this.nextready){
        //next.destroy();
        this.nextready = false;
      }
      //next = newYTPlayer(tag,videoId);
    }
    if(ytplayer == this.prev){
      //alert('error prev');
      tag = this.prevdisp.substring(1,this.prevdisp.length);
      videoId = video_list.getPrevVideo()[0];
      if(this.prevready){
        //prev.destroy();
        this.prevready = false;
      }
      //prev = newYTPlayer(tag,videoId);
    }
  },

  newYTPlayer: function(tag, videoId){
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
        'onReady': this.onPlayerReady,
        'onError': this.onPlayerError,
        'onStateChange': this.onPlayerStateChange
      }
    });
  },

  parseInfoFromURL: function(){
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
  },

  setVideoFromURL: function(){
    if (window.location.hash == '#_=_') {
      window.location.hash = ''; // for older browsers, leaves a # behind
      history.replaceState('', document.title, window.location.pathname); // nice and clean
      //e.preventDefault(); // no page reload
    }
    var videoId = this.parseInfoFromURL()[1];
    return video_list.setCurrVideo(videoId);
  },

  setChannelFromURL: function(){
    var channel = this.parseInfoFromURL()[0];
    if(channel == 'liked'){
      video_list.setCurrChannel('all');
    }else if(channel == 'searched'){
      video_list.setCurrChannel('all');
    }else if(channel.length > 0){
      video_list.setCurrChannel(channel);
    }else
      video_list.setCurrChannel('all');
  },

  setNewVideos: function(curr, prev, next){
    this.loadYTVideo(this.curr, curr);
    this.loadYTVideo(this.prev, prev);
    this.loadYTVideo(this.next, next);
  },

  initLikedVideos: function(){
    var channel = 'liked';
    var likedvideos = fbhandler.getUser().getLikedVideos();
    if(likedvideos.length > 0){
      video_list.setCurrChannel(channel);
      video_list.putList(channel, likedvideos);
      this.setNewVideos(video_list.getCurrVideo()[0], video_list.getPrevVideo()[0], video_list.getNextVideo()[0]);
    }

  },

  changeURL: function(videoId){
    window.history.replaceState("object", "Trendeo: Trending Videos of Now", "/ch/" + video_list.getCurrChannel() + "/" + videoId);
  },

  getCurrVideo: function(){
    return video_list.getCurrVideo();
  },

  getLastIndex: function(){
    var videoId = this.YTCache.get('lastVideo', true, false);
    this.lastVisit = parseInt(this.YTCache.get('lastVisit',true, false));
    this.lastPlayTime = parseInt(this.YTCache.get('lastTime',true, false));
    var currtime = new Date().getTime() / 1000;
    if(currtime > this.lastVisit + this.MAX_TIME_PAST) return 0;
    var indexofvideo = video_list.findVideo(videoId, this.MAX_REWIND_INDEX);
    //add some stuff
  },

  setNewChannel: function(channel){
    video_list.setCurrChannel(channel);
    var asyncstatus = video_list.loadVideos(channel);
    if(asyncstatus){
      asyncstatus.always(function(){
        ythandler.setNewVideos(video_list.getCurrVideo()[0], video_list.getPrevVideo()[0], video_list.getNextVideo()[0]);
      });
    }else{
      ythandler.setNewVideos(video_list.getCurrVideo()[0], video_list.getPrevVideo()[0], video_list.getNextVideo()[0]);
    }
  },
  
  loadLikedVideos: function(){
    var asyncstatus = fbhandler.getUser().loadVideos();
    if(asyncstatus){
      asyncstatus.always(function(){
        ythandler.initLikedVideos();
      });
    }else{
      ythandler.initLikedVideos();
    }
  },

  loadSearchedVideos: function(){
    var asyncstatus = search.loadVideos(search.search_str);
    if(asyncstatus){
      asyncstatus.always(function(){
        ythandler.initSearchedVideos();
      });
    }else{
      ythandler.initSearchedVideos();
    }
  },

  initSearchedVideos: function(){
    var channel = 'searched';
    var searchedvideos = search.getSearchedVideos();
    if(searchedvideos.length > 0){
      video_list.setCurrChannel(channel);
      video_list.putList(channel, searchedvideos);
      this.setNewVideos(video_list.getCurrVideo()[0], video_list.getPrevVideo()[0], video_list.getNextVideo()[0]);
    }

  }
}






