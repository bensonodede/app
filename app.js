var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var firebase = require("firebase");
var $ = require('jquery');
var twilio = require('twilio');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


//What3Words package import and options
var What3Words = require('./node_modules/geo.what3words/lib/geo.what3words.js'),
    w3w = new What3Words('F06KL8FA', {
        language: 'sw'
    });

//Css files go here
app.use(express.static('public'));

//Routing goes here
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/send', function(req, res){
  res.sendFile(__dirname + '/public/send.html');
});

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/public/signup.html');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/ontheway', function(req, res){
  res.sendFile(__dirname + '/public/ontheway.html');
});
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBaPMtJs4kLq81Csc7ykcI-ZNtvEwBUaUA",
  authDomain: "droptest-9d6f4.firebaseapp.com",
  databaseURL: "https://droptest-9d6f4.firebaseio.com",
  storageBucket: "droptest-9d6f4.appspot.com",
  messagingSenderId: "1032993018707"
};
firebase.initializeApp(config);

/************************* TWILIO SMS SETUP **************************/

//Twilio Credentials
var accountSid = 'ACfefa7ab7db30fedd3ba418d0838bbe11';
var authToken = '248923d6ebb40fa7a445edfe1e668a42';

// Require  the twiio module and create a REST client
var client = require('twilio')(accountSid, authToken);


// socket to get coords and display on homepage
io.on('connection', function (socket) {
  socket.on('getcoords', function (data) {
    w3w.reverse({
      coords: data.my
    }).then(function(response) {
      console.log(response);
      socket.emit('getw3w', {
        w3w: response
      });
    });
  });
});

//socket to get recipient's form details
io.on('connection', function(socket) {
  socket.on('recipient', function (data) {
    console.log(data.name);
    console.log(data.address);
    console.log(data.number);
    app.post('/', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    if (req.body.Body == 'hello') {
      client.messages.create({
        to: data.number,
        from: "+16466797502",
        body: "Your package has been picked up and is on the way.",
      }, function(err, message) {
        console.log(err);
      })
    } else if(req.body.Body == 'bye') {
        twiml.message('Goodbye');
    } else {
        twiml.message('No Body param match, Twilio sends this in the request to your server.');
    }
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});


  });
  socket.on('sender', function (data) {
    console.log(data.name);
    console.log(data.number);
    w3w.reverse({
      coords: data.address
    }).then(function(response) {
      console.log(response);
      client.messages.create({
          to: "+254724645546",
          from: "+16466797502",
          body: "Pickup requested at " + "\n" + response + "\n" + "by " + data.name + "\n" + "Contact: " + data.number,
      }, function(err, message) {
         console.log(err);
      });

    });

    //TODO: MIGHT HAVE TO SETUP TWILIO API INSIDE SCOKET
    //TODO: DETERMINE WETHER 2 OR 3 TEXT MESSAGES ARE APPROPRIATE


/*
    app.post('/sms', function (req, res) {
      var twilio = require('twilio');
      var twiml = new twilio.TwimlResponse();
      twiml.message('The Robots are coming! Head for the hills!');
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    });
*/




  });

});






//TODO: MIGHT HAVE TO SETUP TWILIO API INSIDE SOCKET
//TODO: DETERMINE WETHER 2 OR 3 TEXT MESSAGES ARE APPROPRIATE
/************************* TWILIO SMS SETUP **************************/
/*
//Twilio Credentials
var accountSid = 'AC34811ee8499db4fbce70aa2a0bb150ec';
var authToken = '75dd14e5a5669d3533652ab3a6d2f445';

// Require  the twiio module and create a REST client
var client = require('twilio')(accountSid, authToken);

client.messages.create({
    to: "+254724645546",
    from: "+15017250604",
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
}, function(err, message) {
//    console.log(message.sid);
});


app.post('/sms', function (req, res) {
  var twilio = require('twilio');
  var twiml = new twilio.TwimlResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


*/






/*
var database = firebase.database();

function loadFirebase(){
  var ref = database.ref("user");
  ref.on("value", gotData, errData);
}

function errData(error) {
  console.log("Something went wrong.");
  console.log(error);
}

// The data comes back as an object
function gotData(data) {
  var user = data.val();
  console.log(user);
  // Grab all the keys to iterate over the object
  var keys = Object.keys(user);
}

loadFirebase();*/




/*/Write data to firebase database
function writeData() {
  var ref = database.ref('sender');

  var data = {
    location: response
  }
  ref.push(data);
}
writeData();*/




//Launch Server
http.listen(4000, function(){
  console.log('listening on *:4000');
});
