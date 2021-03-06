'use strict';

var toaster = document.getElementsByClassName('toaster')[0];
var form = document.querySelector('form');

GentleForm(form, function (event) {
  event.preventDefault();


  if (this.isValid()) {
    addToast('success', 'Yay, the form is valid!');
   setTimeout(function redirect() {
      window.location.href = "send.html";
    }, 3000)
  }
  else addToast('error', 'Oops, the form is invalid.');
});



function addToast(type, message) {
  var toast = document.createElement('div');

  toast.classList.add('toast');
  toast.classList.add('toast--' + type);
  toast.innerHTML = message;

  toaster.appendChild(toast);

  toast.addEventListener('transitionend', function (event) {
    if (event.propertyName !== 'transform') return;

    if (toast.classList.contains('toast--show')) {
      setTimeout(function () {
        toast.classList.remove('toast--show');
      }, 3000);
    } else {
      toaster.removeChild(toast);
    }
  }, false);

  setTimeout(function () {
    return toast.classList.add('toast--show');
  }, 100);
}





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
var txtEmail = document.getElementById('useremail');
var usernumber = document.getElementById('usernumber');
var userpass = document.getElementById('userpass');
var btnSignUp = document.getElementById('btnSignUp');
var btnLogIn = document.getElementById('btnLogIn');


  //Add signup event
  btnSignUp.addEventListener('click', e => {
    // Get email and pass
    // TODO:0 CATCH ALL ERRORS


      var email = txtEmail.value;
      var pass = userpass.value;
      var name = username.value;
      var number = usernumber.value;

      firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(user) {
       var root = firebase.database().ref();
       var uid = user.uid;

       firebase.database().ref('users/' + uid).set({
        name: name,
        number: number
       });

     }).catch(e => console.log(e.message));

  })




/*********************  THAT'S ALL FOLKS *********************/
