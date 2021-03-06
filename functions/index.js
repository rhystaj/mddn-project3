const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var usersSnap;

/*
    Fires when a user send a request to the database.
*/
 exports.requestRecieved = functions.database.ref('/requests/{pushId}').onCreate((newRequestSnap, cont) => {
    
    const dbroot = newRequestSnap.ref.parent.parent;

    //Get a snapshot of the users.
    return dbroot.child('users').once('value', usersSnap => {

        //Add the request's id to the lists of the user's sent requests.
        usersSnap.ref.child(newRequestSnap.val().senderId).child("sentRequests").child(newRequestSnap.key).set(true);

        //Filter out irrelevant users and give the others a copy of the request id.
        const possibleHelpers = getPossibleHelpers(newRequestSnap.val(), usersSnap.val());
        possibleHelpers.forEach(helper => {
            usersSnap.ref.child(helper).child('assignedRequests').child(newRequestSnap.key).set(true);
        });

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

//Add an entry to the database representing a newly signed-in user.
exports.enterNewUserInDatabase = functions.auth.user().onCreate(user => {

    admin.database().ref("/users").child(user.uid).child("email").set(user.email);
    return admin.database().ref("/users").child(user.uid).child("assignedRequests").set("empty");

});