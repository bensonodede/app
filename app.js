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
        language: 'en'
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

app.get('/sitemap', function(req, res){
  res.sendFile(__dirname + '/public/sitemap.xml');
});

app.get('/robots.txt', function(req, res){
  res.sendFile(__dirname + '/public/robots.txt');
});

app.get('/google5789020687f2746e', function(req, res){
  res.sendFile(__dirname + 'public/google5789020687f2746e.html');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.status(404).send('what??');
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
          body: "PICKUP requested at " + "\n" + response + "\n" + "Name: " + data.name + "\n" + "Contact: " + data.number,
      }, function(err, message) {
         console.log(err);
      });
      socket.emit('complete', {
        status: "Done."
      });
    });
  });



  socket.on('recipient', function (data) {
    console.log(data.name);
    console.log(data.address);
    console.log(data.number);
    client.messages.create({
    to: "+254724645546",
    //to: "+254716305157",
    from: "+16466797502",
    body: "DROPOFF at " + "\n" + data.address + "\n" + "Name: " + data.name + "\n" + "Contact: " + data.number,
  }, function(err, message) {
  console.log(err);
});


/*
app.post('/', function(req, res) {
  var twiml = new twilio.TwimlResponse();
  var rec = String(Number);
  if (req.body.Body == rec ) {
    client.messages.create({
      to: rec,
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
*/
  });

});






//Launch Server
http.listen(process.env.PORT || 4000);
