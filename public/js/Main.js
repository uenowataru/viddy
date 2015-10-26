var animation;
var video_list;
var ythandler;
var usercontrol;
var fb;

// $( document ).ready(function()
//   {
//     setup();    
//   }
// );

setup();
function setup(){
  animation = new AnimationHandler();
  video_list = new VideoList();
  ythandler = new YTHandler();
  usercontrol = new UserControl();
  fbhandler = new FacebookHandler();

  ythandler.setup();
  animation.setup();
  usercontrol.setup();
  fbhandler.setup();
}

