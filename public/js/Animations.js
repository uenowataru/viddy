function AnimationHandler(){
  this.ALL_ANIMATION_TIME = 500;
  this.ALL_FADE_TIME = 1000;
  this.arrowtimeout;
  this.titletimeout;
  this.timebartimeout;
  this.cursortimeout;
  this.channelstimeout;
  this.iconstimeout;
  this.fbtimeout;
  this.timebarprog = 1;
  this.moved = false;
}

AnimationHandler.prototype = {
  setup: function(){
    window.onmousemove = function(e){
      animation.animateAll();
    };

    setInterval(function(){
      try{
        $( "#timebar").width(ythandler.getVideoProgress() + '%');
      }catch(err){
        //some error handling
      }
    },50);
  },

  animateAll: function(){
    if(!ythandler.initialized) return;
    if(!this.moved){
      this.moved = true;
      this.loadTitle();
      this.animateTitle();
      this.animateArrow();
      this.animateTimeBar();
      this.animateChannels();
      this.animateIcons();
      this.animateFB();
      setTimeout(function(){
        animation.moved = false;
      }, this.ALL_ANIMATION_TIME);
      document.body.style.cursor = 'default';
    }else{
      clearTimeout(this.arrowtimeout);
      clearTimeout(this.titletimeout);
      clearTimeout(this.timebartimeout);
      clearTimeout(this.cursortimeout);
      clearTimeout(this.channelstimeout);
      clearTimeout(this.iconstimeout);
      clearTimeout(this.fbtimeout);
      this.arrowtimeout = setTimeout(function(){
        if(animation.isTouchDevice) return;
        animation.fadeElementById("#arrowL");
        animation.fadeElementById("#arrowR");
      }, 2000);
      this.titletimeout = setTimeout(function(){
        animation.fadeElementById("#title");
      }, 2000);
      this.timebartimeout = setTimeout(function(){
        animation.fadeElementById("#timebar");
      }, 2000);
      this.channelstimeout = setTimeout(function(){
        animation.fadeElementById("#channels");
      }, 2000);
      this.iconstimeout = setTimeout(function(){
        animation.fadeElementById(".top-icon");
      }, 2000);
      this.fbtimeout = setTimeout(function(){
        animation.fadeElementById("#fbdiv");
      }, 2000);
      this.cursortimeout = setTimeout(function(){
        document.body.style.cursor = 'none';
      }, 2500);
    }
  },

  animateFB: function(){
    this.animateElementById("#fbdiv", 1.0);
    clearTimeout(this.iconstimeout);
    this.iconstimeout = setTimeout(function(){
      animation.fadeElementById("#fbdiv");
    }, 2000);
  },

  animateIcons: function(){
    this.animateElementById(".top-icon", 1.0);
    clearTimeout(this.iconstimeout);
    this.iconstimeout = setTimeout(function(){
      animation.fadeElementById(".top-icon");
    }, 2000);
  },

  animateTitle: function(){
    this.animateElementById("#title", 1.0);
    clearTimeout(this.titletimeout);
    this.titletimeout = setTimeout(function(){
      animation.fadeElementById("#title");
    }, 2000);
  },

  animateArrow: function(){
    if(animation.isTouchDevice) return;
    this.animateElementById("#arrowL",0.75);
    this.animateElementById("#arrowR",0.75);
    clearTimeout(this.arrowtimeout);
    this.arrowtimeout = setTimeout(function(){
      animation.fadeElementById("#arrowL");
      animation.fadeElementById("#arrowR");
    }, 2000);
  },


  animateTimeBar: function(){
    this.animateElementById("#timebar", 0.75);
    clearTimeout(this.timebartimeout);
    this.timebartimeout = setTimeout(function(){
      animation.fadeElementById("#timebar");
    }, 2000);
  },

  animateChannels: function(){
    this.animateElementById("#channels", 0.75);
    clearTimeout(this.channelstimeout);
    this.channelstimeout = setTimeout(function(){
      animation.fadeElementById("#channels");
    }, 2000);
  },

  animateElementById: function(ElementID, TargetOpacity){
    $( ElementID ).animate({
      opacity: TargetOpacity,
    }, {
      queue: false,
      duration: this.ALL_ANIMATION_TIME
    });
  },

  fadeElementById: function(ElementID){
    $( ElementID ).animate({
      opacity: 0,
    }, {
      queue: false,
      duration: this.ALL_FADE_TIME
    });
  },

  loadTitle: function(){
    if(!ythandler.initialized) return;
    var vidtitle = video_list.getCurrVideo()[1];
    if(video_list.getCurrChannel() == "searched"){
      vidtitle = "[" + search.searched + "]: " + ythandler.getCurrVideo()[1];
    }
    if(search.search_str.length > 0){
        vidtitle = "SEARCH: [ " + search.search_str + " ]"; 
    }
    $( "#title" ).text(vidtitle.replace('&amp;','&'));
  },

  loadChannels: function(){
    if(!ythandler.initialized) return;
    var channel = video_list.getCurrChannel();
    $( "#currchannel" ).text(channel);
  }
}





