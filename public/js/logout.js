// Initialize Firebase
var config = {
  apiKey: "AIzaSyBaPMtJs4kLq81Csc7ykcI-ZNtvEwBUaUA",
  authDomain: "droptest-9d6f4.firebaseapp.com",
  databaseURL: "https://droptest-9d6f4.firebaseio.com",
  storageBucket: "droptest-9d6f4.appspot.com",
  messagingSenderId: "1032993018707"
};
firebase.initializeApp(config);


/***************Firebase Auth****************/

// Get elements
var logoutLink = document.getElementById('logoutLink');
var loginLink = document.getElementById('loginLink');
var signupLink = document.getElementById('signupLink');
var senditem = document.getElementById('senditem')


  //Add logout event
  logoutLink.addEventListener('click', e => {
    var auth = firebase.auth();
    firebase.auth().signOut();
  });

  logoutLink1.addEventListener('click', e => {
    var auth = firebase.auth();
    firebase.auth().signOut();
  });


//Add a real time authentication listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    //Display button if user is logged in
    logoutLink.classList.remove('hide');
    senditem.classList.remove('hide');
    loginLink.classList.add('hide');
    signupLink.classList.add('hide');

    logoutLink1.classList.remove('hide');
    senditem1.classList.remove('hide');
    loginLink1.classList.add('hide');
    signupLink1.classList.add('hide');
  } else {
    console.log('Not logged in');
    logoutLink.classList.add('hide');
    senditem.classList.add('hide');
    loginLink.classList.remove('hide');
    signupLink.classList.remove('hide');

    logoutLink1.classList.add('hide');
    senditem1.classList.add('hide');
    loginLink1.classList.remove('hide');
    signupLink1.classList.remove('hide');
  }
});
