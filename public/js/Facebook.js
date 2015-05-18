window.fbAsyncInit = function() {
  FB.init({
    appId      : '1641122906121098',
    cookie     : true,  // enable cookies to allow the server to access the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  });

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      $( "#fbloginbutton" ).remove();
      getProfileInfo();
    }
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

// The response object is returned with a status field that lets the
// app know the current login status of the person.
// Full docs on the response object can be found in the documentation
// for FB.getLoginStatus().
function statusChangeCallback(response) {
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
   
    $( "#fbloginbutton" ).remove();
    getProfileInfo();
  
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    
    //FB.login();
    //$( "#fbloginbutton" ).remove();
    //getProfileInfo();
    //document.getElementById("fbdiv").addEventListener("click", function(){
    FB.login();
    //});
  
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    
    FB.login();

  }
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function getProfileInfo() {
  FB.api('/me?fields=age_range,gender,hometown,languages,location,locale,political,relationship_status,religion,sports,books,games,movies,music,television,picture,likes', function(response) {
    if (response && !response.error) {
      console.log(response); //console.log('Successful login for: ' + response.name);
      
      $('#fbdiv').prepend('<img id="fbpropic" src="' + response.picture.data.url + '" />');
      userId = response['id'];
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          var accessToken = FB.getAuthResponse()['accessToken'];
          user = new User(userId, accessToken);
          user.loadVideos();
        }
      });
    }else{
      console.log(response);
    }
  });
}

function getProfilePic(){
  FB.api('/me?fields=picture', function(response) {
    if (response && !response.error) {
      console.log(response); //console.log('Successful login for: ' + response.name);
      
      $('#fbdiv').prepend('<img id="fbpropic" src="' + response.picture.data.url + '" />');
      //var id = response['id'];
      //getUser(id);
    }else{
      console.log(response);
    }
  });
}








