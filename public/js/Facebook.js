function FacebookHandler(){
  this.user = new User("","");
}

FacebookHandler.prototype = {
  setup: function(){
    this.loadSDK();
    this.init();
  },

  // Load the SDK asynchronously
   loadSDK: function(){
     (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
   },

   init: function(){
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
          fbhandler.getProfileInfo();
        }
      });
    };
  },

   checkLoginState: function() {
    FB.getLoginStatus(function(response) {
      fbhandler.statusChangeCallback(response);
    });
  },

  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
   statusChangeCallback: function(response) {
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
     
      $( "#fbloginbutton" ).remove();
      this.getProfileInfo();
    
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
  },

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
   getProfileInfo: function() {
    FB.api('/me?fields=age_range,gender,hometown,languages,location,locale,political,relationship_status,religion,sports,books,games,movies,music,television,picture,likes', function(response) {
      if (response && !response.error) {
        console.log(response); //console.log('Successful login for: ' + response.name);
        
        $('#fbdiv').prepend('<img id="fbpropic" src="' + response.picture.data.url + '" />');
        userId = response['id'];
        FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            var accessToken = FB.getAuthResponse()['accessToken'];
            this.user = new User(userId, accessToken);
            this.user.loadVideos();
          }
        });
      }else{
        console.log(response);
      }
    });
  },

   getProfilePic: function(){
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
  },

  getUser: function(){
    return this.user;
  }
}
// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.









