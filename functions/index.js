const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var usersSnap;

/*
    Fires when a user send a request to the database.
*/
 exports.requestRecieved = functions.database.ref('/requests/{pushId}').onCreate((snap, cont) => {
    
    snap.ref.parent.parent.on('value', s => {

        if(s.val().pendingRequest.localeCompare(snap.key) !== 0) {
            return 
        }
        
        console.log("I'm here.");

        const requestID = s.val().pendingRequest;
        const request = s.val().requests[requestID];

        const usersRef = s.ref.child('users');
        const users = s.val().users;

        console.log(users);

        const helpers = getPossibleHelpers(request, users);
        helpers.forEach(element => {
            console.log(requestID);
            usersRef.child(element).child("requests").child(requestID).set(request);
        });

        snap.ref.parent.parent.off('value');
    
    });

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

exports.enterNewUserInDatabase = functions.auth.user().onCreate(user => {

    admin.database().ref("/users").child(user.uid).child("loggedIn").set(true);
    return admin.database().ref("/users").child(user.uid).child("requests").set("empty");

});