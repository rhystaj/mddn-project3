const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var usersSnap;

/*
    Fires when a user send a request to the database.
*/
 exports.requestRecieved = functions.database.ref('/requests/{pushId}').onCreate((snap, cont) => {
    
    //Set up the database, so that when it receievs the request, it will distibute it to the users.
    snap.ref.parent.parent.on('value', s => {

        if(s.val().pendingRequest.localeCompare(snap.key) !== 0) {
            return 
        }
        
        console.log("I'm here.");

        const requestID = s.val().pendingRequest;
        const request = s.val().requests[requestID];

        const usersRef = s.ref.child('users');
        const users = s.val().users;

        usersRef.child(request.senderId).child("sentRequests").child(requestID).set(request);

        //Find all the people who can help and give them a copy of the request.
        const helpers = getPossibleHelpers(request, users);
        helpers.forEach(element => {
            console.log(requestID);
            usersRef.child(element).child("assignedRequests").child(requestID).set(request);
        });

        //Detatch the listener once the relevant operation has been performed.
        snap.ref.parent.parent.off('value');
    
    });

    //Update the database with a new pending request.
    return snap.ref.parent.parent.child('pendingRequest').set(snap.key);

 });

/**
 * Get a collections of users that could help with the given request.
 * @param {The request to search for help for.} request 
 */
function getPossibleHelpers(request, usersObj){

    users = Object.keys(usersObj);

    return users.filter(user => user.localeCompare(request.senderId) !== 0);

}

//Add an entry to the database representing a newly signed-in user.
exports.enterNewUserInDatabase = functions.auth.user().onCreate(user => {

    admin.database().ref("/users").child(user.uid).child("email").set(user.email);
    return admin.database().ref("/users").child(user.uid).child("assignedRequests").set("empty");

});