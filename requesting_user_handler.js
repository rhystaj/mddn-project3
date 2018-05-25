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
  const responseField = document.getElementById("response_text");
  const respondButton = document.getElementById("respond_button");
  const requestSelector = document.getElementById("request_select");
  const logoutButton = document.getElementById("logout_button");
  
  submitButton.addEventListener('click', e => {
    sendRequest(requestField.value, currentUser);
    requestField.value = "";
  });

  respondButton.addEventListener('click', e => {
    
    selectionValues = requestSelector.options[requestSelector.selectedIndex].value.split(":::");
    sendResponse(selectionValues[0], selectionValues[1], responseField.value, currentUser);
    responseField.value = "";

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
  db.child("users").child(currentUser.uid).child("assignedRequests").on('value', (assignedRequestsSnap, cont) => {
    
    //If the requets branch is empty, its value would just be a string.
    if((typeof assignedRequestsSnap.val()).localeCompare('string') === 0) return;
    
    const requestIds = Object.keys(assignedRequestsSnap.val());
      
    const requestsDiv = document.getElementById('requests');
    const requestSelect = document.getElementById('request_select');
    const requestsRef = assignedRequestsSnap.ref.parent.parent.parent.child("requests");

    requestsDiv.innerHTML = "";
    requestSelect.innerHTML = "";
    requestIds.forEach(id => {

        requestsRef.child(id).once('value', requestSnap => {
          
          const request = requestSnap.val();
          requestsDiv.innerHTML += `<p><b>${request.senderName}:</b> ${request.message}</p>`;
          requestSelect.innerHTML += `<option value="${request.senderId}:::${requestSnap.key}">${request.message}</option>`;
          
        });

      });


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

function sendResponse(recipient, requestId, msg, user){

  response = {
    message: msg,
    responderName: user.email,
    responderId: user.uid
  };

  db.child("users").child(recipient).child("responses").child(requestId).push(response);

}