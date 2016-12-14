myApp.factory('DataFactory', ['$firebaseAuth', '$http', function($firebaseAuth, $http) {
  console.log("factory running");

  var currentUser = null;
  var auth = $firebaseAuth();
  // var gameData = undefined;

  function logIn() {
    return auth.$signInWithPopup("google").then(function(firebaseUser) {
      // currentUser = firebaseUser;
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

  // Get all the games from the server
  function getGames() {
    console.log('getting games');
    return currentUser.getToken().then(function(idToken){
      return $http({
        method: 'GET',
        url: '/myGames',
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        return response.data;
      });
    });
  };
//Add a Game
  function addGame(newGame) {
    console.log("Adding game: ", newGame)
    if(currentUser) {
      return currentUser.getToken().then(function(idToken){
        $http({
          method: 'POST',
          url: '/myGames',
          data: newGame,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          return response.data;
        });
      });
    } else {
      console.log('Not logged in or authorized');
      gameData = undefined;
    }
  };

// // Get all the games from the server again after a new one has been added
//   function updateGames() {
//     console.log('factory getting games again');
//     console.log('The current user is:', currentUser);
//     if(currentUser) {
//       return currentUser.getToken().then(function(idToken){
//         $http({
//           method: 'GET',
//           url: '/myGames',
//           headers: {
//             id_token: idToken
//           }
//         }).then(function(response){
//           gameData = response.data;
//           console.log(response.data);
//           return gameData;
//         });
//       });
//     } else {
//       console.log('Not logged in or authorized');
//       gameData = undefined;
//       return;
//     }
//   };

  function logOut() {
    return auth.$signOut().then(function(){
      console.log('logged out');

    });
  };

//This is the only function that works
  auth.$onAuthStateChanged(function(firebaseUser){
    currentUser = firebaseUser;
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/myGames',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          gameData = response.data;
        });
      });
    } else {
      console.log('Not logged in or authorized');
      gameData = undefined;
    }
  });

  var api = {
    logIn: function() {
      return logIn();
    },
    // gameData: function() {
    //   // return our array to the Controller!
    //   return gameData;
    // },
    // updateGames: function() {
    //   // return our Promise to the Controller!
    //   return  updateGames();
    // },
    addGame: function(newGame) {
      // return our Promise to the Controller!
      return addGame(newGame)
    },
    getGames: function() {
      // return our Promise to the Controller!
      return getGames();
    },
    stateChanged: function() {
      return stateChanged();
    },

    logOut: function() {
      return logOut();
    }
  };

  return api;


}]);
