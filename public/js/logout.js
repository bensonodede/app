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
var username = document.getElementById('username');
var txtEmail = document.getElementById('usernumber');
var userpass = document.getElementById('userpass');
var btnSignUp = document.getElementById('btnSignUp');
var btnLogIn = document.getElementById('btnLogIn');
var btnLogOut = document.getElementById('btnLogOut');

// Add login event
btnLogIn.addEventListener('click', e => {
  // Get email and pass
  var email = txtEmail.value;
  var pass = userpass.value;
  var auth = firebase.auth();
  // Sign in
  var promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(e => console.log(e.message));
});


  //Add signup event
/*  btnSignUp.addEventListener('click', e => {
    // Get email and pass
    // TODO:10 CHECK FOR REAL EMAIL OR PHONE NUMERS IN THIS CASE
    var email = txtEmail.value;
    var pass = userpass.value;
    var auth = firebase.auth();
    // Sign in
    var promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  })*/

  //Add logout event
  btnLogOut.addEventListener('click', e => {
    firebase.auth().signOut();
  });


//Add a real time authentication listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    console.log(firebaseUser);
    console.log('Logged in');
    //Display button if user is logged in
    btnLogOut.classList.remove('hide');
  } else {
    console.log('Not logged in');
    btnLogOut.classList.add('hide');
  }
});
