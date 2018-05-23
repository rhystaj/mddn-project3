var config = {
  apiKey: "AIzaSyBlqyGWkLQfnzLV3q4qw6YNwLI526WQ5uA",
  authDomain: "tipstop-7153f.firebaseapp.com",
  databaseURL: "https://tipstop-7153f.firebaseio.com",
  projectId: "tipstop-7153f",
  storageBucket: "tipstop-7153f.appspot.com",
  messagingSenderId: "400002968757"
};
firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.database().ref();

var currentUser = null;

let eventsToFire = 2;

window.onload = () => {

  //Hook buttons up to listeners.
  const submitButton = document.getElementById("submit_button");
  const requestField = document.getElementById("request_text");
  const logoutButton = document.getElementById("logout_button");
  
  submitButton.addEventListener('click', e => {
    sendRequest(requestField.value, currentUser);
    requestField.value = "";
  });

  logoutButton.addEventListener('click', e => {
    auth.signOut();
  });

  onUserAndPageLoaded();

};

//When this page is loaded, a user should be logged in, otherwise, go to login page.
auth.onAuthStateChanged(user => {
    
  if(user === null){
      window.location = "login_page.html";
      return;
  }

  currentUser = user;

  onUserAndPageLoaded();

});


//We want to wait until both the page and user have been loaded before we add something to the page based on the logged in user.
function onUserAndPageLoaded(){

  if(--eventsToFire > 0) return;

  const requestsDiv = document.getElementById("requests");
  db.child("users").child(currentUser.uid).child("requests").on('value', (snap, cont) => {
    if((typeof snap.val()).localeCompare('string') === 0) return;
    requestsDiv.innerHTML = generateRequestsHTML(snap.val());
  });

}

function generateRequestsHTML(requestsObj){
  
  let html = "";

  Object.keys(requestsObj).forEach(e =>{
    html = html + `<p><b>${requestsObj[e].senderName}:</b> ${requestsObj[e].message}</p>`;
  });

  return html;

}

function sendRequest(msg, user){

  request = {
    message: msg,
    senderId: user.uid,
    senderName: user.email
  }

  db.child("requests").push(request);

}