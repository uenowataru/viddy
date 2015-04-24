


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var currindex;
var curr;
var prev;
var next;
var temp;
var currdisp = "#curr";
var nextdisp = "#next";
var prevdisp = "#prev";
var currready = false;
var prevready = false;
var nextready = false;
var initialized = false;
var YTCache;
var lastPlayTime = 0;
var lastVisit = 0;
var MAX_REWIND_INDEX = 50;
var MAX_TIME_PAST = 60*60;
var TIME_PAST_PICKUP = 15*60;
var InitialPlay = true;

function initIFrames(){
  loadTitle();
  animateTitle();
  curr = newYTPlayer('curr', queue[currindex][0]);
  prev = newYTPlayer('prev', queue[currindex > 0 ? currindex-1 : currindex][0]);
  next = newYTPlayer('next', queue[currindex < queue.length-1 ? currindex+1 : currindex][0]);
  initialized = true;
}

function onYouTubeIframeAPIReady() {
  loadVideos().always(function() { //is returned as deffered object
    YTCache = new CacheProvider();
    currindex = getLastIndex();
    try {
      initIFrames();
    }catch(err) {
      alert('Server Error:\n' + err);
    }
    var currtime = new Date().getTime() / 1000;
    if(currtime > lastVisit + TIME_PAST_PICKUP){
      lastPlayTime = 0;
    }
    setInterval(function(){
      try{
        YTCache.set('lastTime', Math.floor(getYTCurrentTime(curr)) + '', true);
        if(getYTDuration(curr) > 0 && getYTDuration(curr) - getYTCurrentTime(curr) < 0.7){
          nextVideo();
        }
      }catch(err){
        console.log(err);
      }
    }, 500);
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  if(!initialized || curr===undefined) return;
  if(curr == event.target){
    currready = true;
    if(InitialPlay){
    setTimeout(function(){
      $( currdisp ).css( "display", "block" );
      seekYT(curr, lastPlayTime);
      InitialPlay = false;
      if(isTouchDevice){
        nextVideo();
        previousVideo();
      }
    }, 1000);
  }
  }
  if(prev == event.target){
    prevready = true;
  }
  if(next == event.target){
    nextready = true;
  }
  

}


function onPlayerError(event) {
  if(!initialized || curr===undefined) return;
  if(event.target == curr){
    queue.splice(currindex,1);
    loadYTVideo(curr, queue[currindex][0]);
    loadYTVideo(next, queue[currindex+1][0]);
  }
  if(event.target == next){
    queue.splice(currindex+1,1);
    loadYTVideo(next, queue[currindex+1][0]);
  }
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
//
var done = false;
function onPlayerStateChange(event) {
  if(!initialized || curr===undefined) return;
  if(event.data == YT.PlayerState.UNSTARTED){
    playYTVideo(event.target);
  }
  if (event.data == YT.PlayerState.PLAYING) {
    pauseYTVideo(prev);
    pauseYTVideo(next);
    document.activeElement.blur();
    //alert(document.activeElement);
  }
  if (event.data == YT.PlayerState.ENDED)
    nextVideo();
}
function stopVideo() {
  player.stopVideo();
}

function nextVideo() {
  if(!initialized || curr===undefined) return;
  if(currindex == queue.length-1){
    currindex = 0;
    loadYTVideo(curr, queue[currindex][0]);
    loadYTVideo(next, queue[currindex+1][0]);
    return;
  }
  pauseYTVideo(curr);

  temp = prev;
  prev = curr;
  curr = next;
  next = temp;
  
  playYTVideo(curr);

  currindex++;
  if( currindex < queue.length - 1)
    loadYTVideo(next, queue[currindex+1][0]);

  seekYT(prev, 0);
  seekYT(next, 0);

  temp = prevdisp;
  prevdisp = currdisp;
  currdisp = nextdisp;
  nextdisp = temp;
  $( currdisp ).css( "display", "block" );
  $( nextdisp ).css( "display", "none" );
  $( prevdisp ).css( "display", "none" );

  if(currindex > queue.length - 15)
    loadVideos();

  loadTitle();
  animateTimeBar();
  YTCache.set('lastVideo',queue[currindex][0], true);
  YTCache.set('lastVisit',Math.round(new Date().getTime() / 1000) + '', true);
}

function previousVideo() {
  if(!initialized || curr===undefined) return;
  if (currindex == 0) return;
  pauseYTVideo(curr);

  temp = next;
  next = curr;
  curr = prev;
  prev = temp;

  playYTVideo(curr);

  currindex--;
  if( currindex > 0)
    loadYTVideo(prev, queue[currindex-1][0]);

  seekYT(prev,0);
  seekYT(next, 0);

  temp = nextdisp;
  nextdisp = currdisp;
  currdisp = prevdisp;
  prevdisp = temp;

  $( currdisp ).css( "display", "block" );
  $( nextdisp ).css( "display", "none" );
  $( prevdisp ).css( "display", "none" );

  loadTitle();
  animateTimeBar();
  YTCache.set('lastVideo',queue[currindex][0], true);
  YTCache.set('lastVisit', Math.round(new Date().getTime() / 1000) + '', true);
}

function togglePlayPause(){
  if(curr===undefined || !initialized) return;
  if(getYTPlayerState(curr)==2)
    playYTVideo(curr);
  else
    pauseYTVideo(curr);
}

function pauseVideo(){
  if(!initialized || curr===undefined) return;
  pauseYTVideo(curr);
}

function getVideoProgress(){
  if(!initialized || curr===undefined || curr===null) return 0;
  var totaltime = getYTDuration(curr);
  var nowtime = getYTCurrentTime(curr);
  return totaltime > 0 ? 100 * nowtime / totaltime : 0;
}

function skipVideoTo(index){
  if(!initialized || curr===undefined) return 0;
  var totaltime = getYTDuration(curr);
  var nowtime = getYTCurrentTime(curr);
  if(index == -1){    //rewind
    index = Math.round(10*nowtime/totaltime - 1) ;
  }
  if(index == -2){    //fastforward
    index = Math.round(10*nowtime/totaltime + 1) ;
  }
  if(index == -1){
    if(currindex == 0){
      seekYT(curr,0);
    }
    previousVideo();
    animateTitle();
    return;
  }
  if(index == 10){
    nextVideo();
    animateTitle();
    return;
  }
  seekYT(curr,index * totaltime / 10);
}

function getYTDuration(ytplayer){
  try{
    return ytplayer.getDuration();
  }catch (err){
    YTError(ytplayer);
    return 0;
  }
}

function getYTCurrentTime(ytplayer){
  try{
    return ytplayer.getCurrentTime();
  }catch (err){
    YTError(ytplayer);
    return 0;
  }
}

function pauseYTVideo(ytplayer){
  try{
    ytplayer.pauseVideo();
  }catch (err){
    YTError(ytplayer);
  }
}

function playYTVideo(ytplayer){
  try{
    ytplayer.playVideo();
  }catch (err){
    YTError(ytplayer);
  }
}

function getYTPlayerState(ytplayer){
  try{
    return ytplayer.getPlayerState();
  }catch (err){
    YTError(ytplayer);
    return -1;
  }
}

function loadYTVideo(ytplayer, videoId){
  try{
    ytplayer.loadVideoById({'videoId': videoId, 'startSeconds': 0, 'suggestedQuality': 'large'});
  }catch (err){
    YTError(ytplayer);
  }
}

function seekYT(ytplayer, position){
  try{
    ytplayer.seekTo(position);
  }catch (err){
    YTError(ytplayer);
  }
}

function YTError(ytplayer){
  var tag;
  var videoId;
  if(ytplayer == curr){
    //alert('error curr');
    tag = currdisp.substring(1);
    videoId = queue[currindex];
    if(currready){
      //curr.getIframe().setAttribute("src", "https://www.youtube.com/embed/WsksFbFZeeU");
      curr.destroy();
      document.body.innerHTML += '<div id="' + tag +'"></div>';
      curr = newYTPlayer(tag,videoId);
      currready = false;
    }
    //curr = newYTPlayer(tag,videoId);
  }
  if(ytplayer == next){
    //alert('error next');
    tag = nextdisp.substring(1,nextdisp.length);
    videoId = queue[currindex+1];
    if(nextready){
      //next.destroy();
      nextready = false;
    }
    //next = newYTPlayer(tag,videoId);
  }
  if(ytplayer == prev){
    //alert('error prev');
    tag = prevdisp.substring(1,prevdisp.length);
    videoId = queue[currindex-1];
    if(prevready){
      //prev.destroy();
      prevready = false;
    }
    //prev = newYTPlayer(tag,videoId);
  }
}


function newYTPlayer(tag, videoId){
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
}

function getLastIndex(){
  var videoId = YTCache.get('lastVideo', true, false);
  lastVisit = parseInt(YTCache.get('lastVisit',true, false));
  lastPlayTime = parseInt(YTCache.get('lastTime',true, false));
  var currtime = new Date().getTime() / 1000;
  if(currtime > lastVisit + MAX_TIME_PAST) return 0;
  for(var i = 0; i < queue.length && i < MAX_REWIND_INDEX; i++){
    if(queue[i][0]==videoId){
      return i;
    }
  }
  return 0;
}


