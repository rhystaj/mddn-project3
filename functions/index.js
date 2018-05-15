const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
//  });

 exports.realtimeTest = functions.database.ref('requests').onWrite((snap, cont) => {
  console.log("hi");
  return;
 });