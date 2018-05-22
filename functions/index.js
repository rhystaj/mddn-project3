const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var usersSnap;

/*
    Fires when a user send a request to the database.
*/
 exports.requestRecieved = functions.database.ref('/requests/{pushId}').onCreate((snap, cont) => {
    
    return snap.ref.parent.parent.child('pendingRequest').set(snap.key);

 });

 /*
    Fires whan anywhere is the database is edited, but is only concernced with when the pending request is changed.
 */
exports.processPendingRequest = functions.database.ref("/").onUpdate((change, cont) => {

    if(change.before.val().pendingRequest.localeCompare(change.after.val().pendingRequest) === 0) {
        return new Promise((resolve, reject) => {});
    }

    return new Promise((resolve, reject) => {

        const requestID = change.after.val().pendingRequest;
        const request = change.after.val().requests[requestID];

        const usersRef = change.after.ref.child('users');
        const users = change.after.val().users;

        console.log(users);

        const helpers = getPossibleHelpers(request, users);
        helpers.forEach(element => {
            console.log(requestID);
            usersRef.child(element).child("requests").child(requestID).set(request);
        });

        return resolve("Users assigned requests");

    });

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