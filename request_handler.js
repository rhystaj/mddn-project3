const db = firebase.database(); //The root of the database.
const requestsRef = db.child('requests');

function makeRequest(userId, specs){

  specs[userId] = userId;
  requestsRef.push(specs);


}