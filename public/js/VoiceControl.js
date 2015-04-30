var ENABLE_VC = false;

//setupVC();

function setupVC(){
  if(!ENABLE_VC || !annyang) return;
  var r = confirm("Do you want to enable voice commands?");
  if (r == false) return;

  if (annyang) {
    annyang.debug();
    var nextCommand = {
      '(*term1) show me next (*term2)': function(term1, term2) { //show me next
        nextVideo();
        animateTitle();
      }
    };
    var prevCommand = {
      '(*term1) show me previous (*term2)': function(term1, term2) { //show me previous
        previousVideo();
        animateTitle();
      }
    };
    var playCommand = {
      '(*term1) pause video (*term2)': function(term1, term2) { //pause
        togglePlayPause();
        animateTitle();
      }
    };
    var pauseCommand = {
      '(*term1) play video (*term2)': function(term1, term2) { //play
        togglePlayPause();
        animateTitle();
      }
    };
    // Add our commands to annyang
    annyang.addCommands(nextCommand);
    annyang.addCommands(prevCommand);
    annyang.addCommands(playCommand);
    annyang.addCommands(pauseCommand);

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start();
  }else{
    alert('Voice not supported on your browser :(');
  }
}