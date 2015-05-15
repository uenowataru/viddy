var ALL_ANIMATION_TIME = 500;
var ALL_FADE_TIME = 1000;

var arrowtimeout;
var titletimeout;
var timebartimeout;
var cursortimeout;
var channelstimeout;
var iconstimeout;
var timebarprog = 1;

$(document).ready(function(){
  window.onmousemove = function(e){
    animateAll();
  };
});

function animateAll(){
  if(!initialized) return;
  if(!moved){
    moved = true;
    loadTitle();
    animateTitle();
    animateArrow();
    animateTimeBar();
    animateChannels();
    animateIcons();
    setTimeout(function(){
      moved = false;
    },ALL_ANIMATION_TIME);
    document.body.style.cursor = 'default';
  }else{
    clearTimeout(arrowtimeout);
    clearTimeout(titletimeout);
    clearTimeout(timebartimeout);
    clearTimeout(cursortimeout);
    clearTimeout(channelstimeout);
    clearTimeout(iconstimeout);
    arrowtimeout = setTimeout(function(){
      if(isTouchDevice) return;
      fadeElementById("#arrowL");
      fadeElementById("#arrowR");
    }, 2000);
    titletimeout = setTimeout(function(){
      fadeElementById("#title");
    }, 2000);
    timebartimeout = setTimeout(function(){
      fadeElementById("#timebar");
    }, 2000);
    channelstimeout = setTimeout(function(){
      fadeElementById("#channels");
    }, 2000);
    iconstimeout = setTimeout(function(){
      fadeElementById(".top-icon");
    }, 2000);
    cursortimeout = setTimeout(function(){
      document.body.style.cursor = 'none';
    }, 2500);
  }
}

function animateIcons(){
  animateElementById(".top-icon", 1.0);
  clearTimeout(iconstimeout);
  iconstimeout = setTimeout(function(){
    fadeElementById(".top-icon");
  }, 2000);
}

function animateTitle(){
  animateElementById("#title", 1.0);
  clearTimeout(titletimeout);
  titletimeout = setTimeout(function(){
    fadeElementById("#title");
  }, 2000);
}

function animateArrow(){
  if(isTouchDevice) return;
  animateElementById("#arrowL",0.75);
  animateElementById("#arrowR",0.75);
  clearTimeout(arrowtimeout);
  arrowtimeout = setTimeout(function(){
    fadeElementById("#arrowL");
    fadeElementById("#arrowR");
  }, 2000);
}


function animateTimeBar(){
  animateElementById("#timebar", 0.75);
  clearTimeout(timebartimeout);
  timebartimeout = setTimeout(function(){
    fadeElementById("#timebar");
  }, 2000);
}

function animateChannels(){
  animateElementById("#channels", 0.75);
  clearTimeout(channelstimeout);
  channelstimeout = setTimeout(function(){
    fadeElementById("#channels");
  }, 2000);
}

function animateElementById(ElementID, TargetOpacity){
  $( ElementID ).animate({
    opacity: TargetOpacity,
  }, {
    queue: false,
    duration: ALL_ANIMATION_TIME
  });
}

function fadeElementById(ElementID){
  $( ElementID ).animate({
    opacity: 0,
  }, {
    queue: false,
    duration: ALL_FADE_TIME
  });
}

function loadTitle(){
  if(!initialized) return;
  var vidtitle = video_list.getCurrVideo()[1];
  $( "#title" ).text(vidtitle.replace('&amp;','&'));
}

function loadChannels(){
  if(!initialized) return;
  var channel = video_list.getCurrChannel();
  $( "#currchannel" ).text(channel);
}


setInterval(function(){
  try{
    $( "#timebar").width(getVideoProgress() + '%');
  }catch(err){
    //
  }
},50);
