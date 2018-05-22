// Initialize Firebase
var config = {
    apiKey: "AIzaSyBlqyGWkLQfnzLV3q4qw6YNwLI526WQ5uA",
    authDomain: "tipstop-7153f.firebaseapp.com",
    databaseURL: "https://tipstop-7153f.firebaseio.com",
    projectId: "tipstop-7153f",
    storageBucket: "tipstop-7153f.appspot.com",
    messagingSenderId: "400002968757"
  };
  firebase.initializeApp(config);
const auth = firebase.auth(); //The authentification object.


window.onload = () => {
    //The UI elements.
    
    console.log(window.location);

    const emailField = document.getElementById("email_field");
    const passwordField = document.getElementById("password_field");
    const loginButton = document.getElementById("login_button");
    const signUpButton = document.getElementById("signup_button");

    console.log(document.getElementById("logout_button"));

    loginButton.addEventListener('click', e =>{
        
        const email = emailField.value;
        const password = passwordField.value;
        
        console.log("Email: " + email);
        console.log("Password:" + password);

        auth.signInWithEmailAndPassword(email, password).catch(error => {
            alert("There was an error signing in.");
            console.log(error.message);
        });

    });

    signUpButton.addEventListener('click', e =>{
        
        const email = emailField.value;
        const password = passwordField.value;
        
        console.log("Email: " + email);
        console.log("Password:" + password);

        auth.createUserWithEmailAndPassword(email, password).catch(error => {
            alert("There was an error creating the user account.");
            console.log(error.message);
        });

    });

};

//Store information about the use once they have logged in.
var loggedInUser;
auth.onAuthStateChanged(user => {

    alert(user.email + " signed in.");
    
    loggedInUser = user;
    
    window.location = "request_page.html";

});