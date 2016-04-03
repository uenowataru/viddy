function setUp(){
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
function onYouTubeIframeAPIReady() {
  setUpAll();
}
function setUpAll(){
  var uiController = new UIController();
  var videoManager = new VideoManager();
  var ytHandler = new YTHandler();
  var playerManager = new PlayerManager(ytHandler, videoManager, uiController);
  var fbHandler = new FacebookHandler(playerManager);
  var userControl = new UserControl(playerManager, uiController, videoManager);
  uiController.setUp();
  userControl.setUp();
  fbHandler.setUp();
  playerManager.setUp();
}

setUp();