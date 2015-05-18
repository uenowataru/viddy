var moved = false;
var aboutOpen = false;

var ClickTime = 0;
var HorizontalArrowPressed = 0;
var ArrowPressedDown = 0;
var DOUBLE_CLICK_THRESHOLD = 300;
var TOUCH_DRAG_THRESHOLD = 100;

var canScroll = true;
var scrollThreshold = 250;
var arrowrholdtimeout = 0;
var arrowlholdtimeout = 0;
var wheeldelta = 0;
var isTouchDevice = 'ontouchstart' in document.documentElement;
var isMobile = (function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

if (isMobile) {
  alert('This site is not mobile friendly yet. Mobile apps are on its way!');
}

//when we lose focus
$(window).blur(function() {
  moved = false;
});

if(isTouchDevice){
  window.addEventListener('load', function(){
    var glass = document.getElementById('glass');
    var startx = 0;
    var dist = 0;
 
    glass.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
        startx = parseInt(touchobj.clientX);// get x position of touch point relative to left edge of browser
        //statusdiv.innerHTML = 'Status: touchstart<br> ClientX: ' + startx + 'px';
        e.preventDefault();
    }, false);
 
    glass.addEventListener('touchmove', function(e){
        var touchobj = e.changedTouches[0]; // reference first touch point for this event
        dist = parseInt(touchobj.clientX) - startx;
        //statusdiv.innerHTML = 'Status: touchmove<br> Horizontal distance traveled: ' + dist + 'px';
        e.preventDefault();
    }, false);
 
    glass.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]; // reference first touch point for this even
        dist = parseInt(touchobj.clientX) - startx;
        
        if(dist > TOUCH_DRAG_THRESHOLD){
          previousVideo();
          animateTitle();
        }
        else if(dist < -TOUCH_DRAG_THRESHOLD){
          nextVideo();
          animateTitle();
        }else {
          togglePlayPause();
          animateAll();
        }
        //statusdiv.innerHTML = 'Status: touchend<br> Resting x coordinate: ' + touchobj.clientX + 'px';
        e.preventDefault();
    }, false);

  }, false);
}

$(document.activeElement).keydown(function(e) {
  if(!initialized) return;
  //e.preventDefault(); // prevent the default action (scroll / move caret)
  if (e.which == 13) {
    toggleFullScreen();
  } //enter
  if(e.which == 32){
    togglePlayPause();
    animateAll();
  } //space bar
  if(e.which== 37){
    if(++HorizontalArrowPressed == 1) return;
    animateTimeBar();
    skipVideoTo(-3);
    //skipVideoTime(-HorizontalArrowPressed/2);
  } //left
  if(e.which== 39){
    if(++HorizontalArrowPressed == 1) return;
    animateTimeBar();
    skipVideoTo(-4);
    //skipVideoTime(HorizontalArrowPressed/2);
  } // right
  if(e.which== 38){
    animateTimeBar();
    skipVideoTo(-2);
  } //up  //fastforward
  if(e.which== 40){
    animateTimeBar();
    skipVideoTo(-1);
  } //down   //downward
  if(e.which >= 48 && e.which <= 57){
    animateTimeBar();
    skipVideoTo(e.which - 48);
  }
  if(e.which == 74){
    prevChannel();
  } //j
  if(e.which == 75){
    nextChannel();
  } //k
  if(e.which == 76){
    likeCurrVideo();
  } //l
  if(e.which == 82){
    replayVideo();
  } //r
});

$(document.activeElement).keyup(function(e) {
  if(!initialized) return;
  //e.preventDefault(); // prevent the default action (scroll / move caret)
  if(e.which== 37){
    if(HorizontalArrowPressed < 2){
      previousVideo();
      animateTitle();
    }
    HorizontalArrowPressed = 0;
  } //left  //rewind
  if(e.which== 39){
    if(HorizontalArrowPressed < 2){
      nextVideo();
      animateTitle();
    }
    HorizontalArrowPressed = 0;
  } //right   //fastforward
});

function mouseClick(){
  if(isTouchDevice) return;
  var currtime = new Date().getTime();
  if(currtime < ClickTime + DOUBLE_CLICK_THRESHOLD){
    toggleFullScreen();
  }
  ClickTime = currtime;
  togglePlayPause();
}

$('#arrowL').mousedown(function(e) {
  //e.stopPropagation();
  arrowLeftMouseDown();
  arrowlholdtimeout = setInterval(arrowLeftMouseDown, 200);
}).bind('mouseup mouseleave', function() {
    clearInterval(arrowlholdtimeout);
});

$('#arrowR').mousedown(function(e) {
  //e.stopPropagation();
  arrowRightMouseDown();
  arrowrholdtimeout = setInterval(arrowRightMouseDown, 200);
}).bind('mouseup mouseleave', function() {
    clearInterval(arrowrholdtimeout);
});

$('#arrowL').mouseup(function(e) {
  //e.stopPropagation();
  arrowLeftMouseUp();
});

$('#arrowR').mouseup(function(e) {
  //e.stopPropagation();
  arrowRightMouseUp();
});

$('#arrowL').click(function(e) {
  e.stopPropagation();
});

$('#arrowR').click(function(e) {
  e.stopPropagation();
});

$('#home-icon').click(function() {
  setNewChannel('all');
});

$('#heart-icon').click(function() {
  loadLikedVideos();
});

$('#info-icon').click(function() {
  if (aboutOpen) {
    $('#glass').animate({backgroundColor: "rgba(0,0,0,0)"}, 'fast');
    $('#about').fadeOut('fast');
    $('#about').css("display", "none");
    aboutOpen = false;
  }
  else {
    $('#glass').animate({backgroundColor: "rgba(0,0,0,0.75)"}, 'fast');
    $('#about').fadeIn('fast');
    $('#about').css("display", "block");
    aboutOpen = true;
  }
});

$('#about-modal-close').click(function() {
  $('#glass').animate({backgroundColor: "rgba(0,0,0,0)"}, 'fast');
  $('#about').fadeOut('fast');
  $('#about').css("display", "none");
  aboutOpen = false;
});

function arrowLeftMouseDown(){
  if(++ArrowPressedDown == 1) return;
  animateAll();
  skipVideoTo(-3);
   //down   //downward
}

function arrowRightMouseDown(){
  if(++ArrowPressedDown == 1) return;
  animateAll();
  skipVideoTo(-4);
   //up  //fastforward
}
function arrowLeftMouseUp(){
  if(isTouchDevice) return;
  if(ArrowPressedDown < 2){
    previousVideo();
    animateTitle();
  }
  ArrowPressedDown = 0;
}
function arrowRightMouseUp(){
  if(isTouchDevice) return;
  if(ArrowPressedDown <2){
    nextVideo();
    animateTitle();
  }
  ArrowPressedDown = 0;
}

function titleClick(){
  if(!initialized) return;
  pauseVideo();
  window.open("https://www.youtube.com/watch?v=" + video_list.getCurrVideo()[0] + "&t=" + Math.floor(getYTCurrentTime(curr)) + "s");
}

$('body').on ('mousewheel', function (e) {
  if(!initialized || !canScroll) return;
  wheeldelta += e.originalEvent.wheelDelta;

  if (wheeldelta < -scrollThreshold) {
    canScroll = false;
    //nextChannel();

    //nextVideo();
    //animateTitle();
    setTimeout(function() {
      canScroll = true;
      wheeldelta = 0;
    }, 1000);
  } else if (wheeldelta > scrollThreshold) {    //scrolled down
    canScroll = false;
    //prevChannel();

    //previousVideo();
    //animateTitle();
    setTimeout(function() {
      canScroll = true;
      wheeldelta = 0;
    }, 1000);
  }
});

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


// slide out menu

$('#channel-icon').click(function() {
  $('body').toggleClass('channel-menu-push-toright');
  $('#channel-menu').toggleClass('channel-menu-open');
});

$('.channel').click(function() {
  setNewChannel($(this).attr('channel'));
});




