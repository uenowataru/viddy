function UIController(){
  var ALL_ANIMATION_TIME = 500;
  var ALL_FADE_TIME = 1000;
  var arrowtimeout = null;
  var titletimeout= null;
  var timebartimeout= null;
  var cursortimeout= null;
  var channelstimeout= null;
  var iconstimeout= null;
  var fbtimeout= null;
  var imagetimeout= null;
  var timebarprog = 1;
  var moved = false;

  this.setUp = function(){
    setUp();
  };

  function setUp(){
    window.onmousemove = function(e){
      animateAll();
    };
  };

  function animateFB(){
    animateElementById("#fbdiv", 1.0);
    clearTimeout(iconstimeout);
    iconstimeout = setTimeout(function(){
      fadeElementById("#fbdiv");
    }, 2000);
  };

  function animateIcons(){
    animateElementById(".top-icon", 1.0);
    clearTimeout(iconstimeout);
    iconstimeout = setTimeout(function(){
      fadeElementById(".top-icon");
    }, 2000);
  };

  this.animateTitle = function(){
    animateTitle();
  };
  function animateTitle(){
    animateElementById("#title", 1.0);
    clearTimeout(titletimeout);
    titletimeout = setTimeout(function(){
      fadeElementById("#title");
    }, 2000);
  };

  function animateArrow(){
    animateElementById("#arrowL",0.75);
    animateElementById("#arrowR",0.75);
    clearTimeout(arrowtimeout);
    arrowtimeout = setTimeout(function(){
      fadeElementById("#arrowL");
      fadeElementById("#arrowR");
    }, 2000);
  };

  this.animateTimeBar = function(){
    animateTimeBar();
  };
  function animateTimeBar(){
    animateElementById("#timebar", 0.75);
    clearTimeout(timebartimeout);
    timebartimeout = setTimeout(function(){
      fadeElementById("#timebar");
    }, 2000);
  };

  this.animateChannels = function(){
    animateChannels();
  };
  function animateChannels(){
    animateElementById("#channels", 0.75);
    clearTimeout(channelstimeout);
    channelstimeout = setTimeout(function(){
      fadeElementById("#channels");
    }, 2000);
  };

  function animateElementById(ElementID, TargetOpacity){
    $( ElementID ).animate({
      opacity: TargetOpacity,
    }, {
      queue: false,
      duration: ALL_ANIMATION_TIME
    });
  };

  function fadeElementById(ElementID){
    $( ElementID ).animate({
      opacity: 0,
    }, {
      queue: false,
      duration: ALL_FADE_TIME
    });
  };

  this.loadTitle = function(vidtitle){
    loadTitle(vidtitle);
  };

  function loadTitle(vidtitle){
    // if(videoManager.getCurrChannel() == "searched"){
    //   vidtitle = "[" + search.searched + "]: " + ythandler.getCurrVideo()[1];
    // }
    // if(search.search_str.length > 0){
    //     vidtitle = "SEARCH: [ " + search.search_str + " ]"; 
    // }
    $( "#title" ).text(vidtitle.replace('&amp;','&'));
  };

  this.setChannelName = function(channel){
    setChannelName(channel);
  };

  function setChannelName(channel){
    $( "#currchannel" ).text(channel);
  };

  this.animateAll = function(){
    animateAll();
  };
   function animateAll(){
    if(!moved){
      moved = true;
      animateTitle();
      animateArrow();
      animateTimeBar();
      animateChannels();
      animateIcons();
      animateFB();
      setTimeout(function(){
        moved = false;
      }, ALL_ANIMATION_TIME);
      document.body.style.cursor = 'default';
    }else{
      clearTimeout(arrowtimeout);
      clearTimeout(titletimeout);
      clearTimeout(timebartimeout);
      clearTimeout(cursortimeout);
      clearTimeout(channelstimeout);
      clearTimeout(iconstimeout);
      clearTimeout(fbtimeout);
      arrowtimeout = setTimeout(function(){
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
      fbtimeout = setTimeout(function(){
        fadeElementById("#fbdiv");
      }, 2000);
      cursortimeout = setTimeout(function(){
        document.body.style.cursor = 'none';
      }, 2500);
    }
  };
  //,

  // animateImageL: function(){
  //   this.animateElementById("#imgL",1.0);
  //   clearTimeout(this.imagetimeout);
  //   this.imagetimeout = setTimeout(function(){
  //     uiController.fadeElementById("#imgL");
  //   }, 2000);
  // },

  // animateImageR: function(){
  //   this.animateElementById("#imgR",1.0);
  //   clearTimeout(this.imagetimeout);
  //   this.imagetimeout = setTimeout(function(){
  //     uiController.fadeElementById("#imgR");
  //   }, 2000);
  // }

  this.setThumbnailImageL = function(prevId){
    setThumbnailImageL(prevId);
  };

  function setThumbnailImageL(prevId){
      if( $('#arrowL').attr("src") != 'http://img.youtube.com/vi/' + prevId +  '/0.jpg'){
        $('#arrowL').attr("src", 'http://img.youtube.com/vi/' + prevId +  '/0.jpg');
      }
  };

  this.setThumbnailImageR = function(nextId){
    setThumbnailImageR(nextId);
  };
  function setThumbnailImageR(nextId){
      if( $('#arrowR').attr("src") != 'http://img.youtube.com/vi/' + nextId +  '/0.jpg'){
        $('#arrowR').attr("src", 'http://img.youtube.com/vi/' + nextId +  '/0.jpg');
      }
  };

}





