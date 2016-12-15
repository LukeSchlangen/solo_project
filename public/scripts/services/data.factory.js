myApp.factory('DataFactory', ['$firebaseAuth', '$http', function($firebaseAuth, $http) {
  console.log("factory running");

  var currentUser = null;
  var auth = $firebaseAuth();

  function logIn() {
    return auth.$signInWithPopup("google").then(function(firebaseUser) {
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
        return $http({
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
    }
  };

  function logOut() {
    return auth.$signOut().then(function(){
      console.log('logged out');
    });
  };

  auth.$onAuthStateChanged(function(firebaseUser){
    currentUser = firebaseUser;
    if(!firebaseUser) {
      console.log('Not logged in or authorized');
    }
  });

  var api = {
    logIn: function() {
      return logIn();
    },
    addGame: function(newGame) {
      // return our Promise to the Controller!
      return addGame(newGame)
    },
    getGames: function() {
      // return our Promise to the Controller!
      return getGames();
    },
    logOut: function() {
      return logOut();
    }
  };

  return api;


}]);
