var socket = io();



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBaPMtJs4kLq81Csc7ykcI-ZNtvEwBUaUA",
    authDomain: "droptest-9d6f4.firebaseapp.com",
    databaseURL: "https://droptest-9d6f4.firebaseio.com",
    storageBucket: "droptest-9d6f4.appspot.com",
    messagingSenderId: "1032993018707"
  };
  firebase.initializeApp(config);


var recName = document.getElementById('recName');
var recAddress = document.getElementById('recAddress');
var recNumber = document.getElementById('recNumber');
var btnShip = document.getElementById('ship');


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    //Nothing happens
  } else {
    window.location.href = "login.html";
  }
});




btnShip.addEventListener('click', e => {





  var name = recName.value;
  var address = recAddress.value;
  var number = recNumber.value;

  var regExName = new RegExp("([a-zA-Z\\-]+){2,}\\s+([a-zA-Z\\-]+){2,}");
  var regExAddress  = new RegExp("([a-zA-Z\\-]+)[.]+([a-zA-Z\\-]+)[.]([a-zA-Z\\-]+)");
  var regExNumber = new RegExp("\([0-9]{10})");


  if (regExName.test(name) && regExAddress.test(address) && regExNumber.test(number)) {



        $('#loader').toggleClass('visible');
        $('.dark-overlay').show();
        setTimeout(function(){
          $('#loader').toggleClass('visible');
          $('.dark-overlay').hide();
        }, 10000);
        setTimeout(function(){
          window.location.assign("ontheway.html");
        }, 9500);



    socket.emit('recipient', {
      name: name,
      address: address,
      number: number
    });



      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          database = firebase.database();


          function loadsender() {

            function get() {
              var ref = database.ref("users/" + user.uid);
              ref.on("value", gotData, errData);
            }

            function errData(error) {
              console.log("Something went wrong.");
              console.log(error);
            }

            // The data comes back as an object
            function gotData(data) {
              var sender = data.val();

              /********************* GET ADDRESS ******************/
              //Geolocation function
              function lat(callback) {
                  navigator.geolocation.getCurrentPosition(function(position) {
                    {
                      enableHighAccuracy: true;
                    }
                      var lat = position.coords.latitude;
                      var lon = position.coords.longitude;
                      callback.call(null, lat, lon);
                  }, function(error) {
                      alert("Please check your location settings and try again.")
                      console.log("Something went wrong: ", error);
                  });
              }


                function locateme() {
                    lat(function(latitude, longitude) {
                        console.log(latitude);
                        console.log(longitude);
                        var lat = latitude.toString();
                        var lon = longitude.toString();
                        var address = (lat + ', ' + lon);
                        socket.emit('sender', {
                          name: sender.name,
                          number: sender.number,
                          address: address
                        });

                        console.log(sender);
                    });
                }
                  locateme();



            }
            get();
          }

          loadsender();
          console.log('Yay');
          // User is signed in.
        } else {
           window.location.href = "login.html";
        }
      });


  } else {
    alert("Invalid details");
  }

});
