const functions = require('firebase-functions');

var usersSnap;

/*
    Fires when a user send a request to the database.
*/
 exports.requestRecieved = functions.database.ref('/requests/{pushId}').onCreate((snap, cont) => {
    
    const usersRef = snap.ref.parent.parent.child('users');

    return new Promise((resolve, reject) => {
        

        const possibleHelpers = getPossibleHelpers(snap.val(), usersSnap.val());
        possibleHelpers.array.forEach(element => {
             usersRef.child(element).set(true);
        });

    });

 });

 exports.changeInUsers = functions.database.ref("/users").onUpdate((change, cont) => {
     usersSnap = change.after;
 })

/**
 * Get a collections of users that could help with the given request.
 * @param {The request to search for help for.} request 
 */
function getPossibleHelpers(request, usersRef){

    users = Object.keys(usersObj);
    return users.array.filter(user => true);

}