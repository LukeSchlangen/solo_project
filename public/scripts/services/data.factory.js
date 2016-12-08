myApp.factory('DataFactory', [function() {
  console.log("factory running");

function logIn() {
  return auth.$signInWithPopup("google").then(function(firebaseUser) {
    console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
  }).catch(function(error) {
    console.log("Authentication failed: ", error);
    });
  };

function logOut() {
  return auth.$signOut().then(function(){
    console.log('logged out');

  });
};


var gameData = {
logIn: function() {
  return logIn();
},

logOut: function() {
  return logOut();
  }
};

return gameData;


}]);

// auth.$onAuthStateChanged(function(firebaseUser){
//   // self.currentUser = firebaseUser;
//   if(firebaseUser) {
//     firebaseUser.getToken().then(function(idToken){
//       $http({
//         method: 'GET',
//         url: '/privateData',
//         headers: {
//           id_token: idToken
//         }
//       }).then(function(response){
//         self.secretData = response.data;
//       });
//     });
//   } else {
//     console.log('Not logged in or authorized');
//     self.secretData = [];
//   }
// });
//
// self.logOut = function()
//   });
// };
//
//