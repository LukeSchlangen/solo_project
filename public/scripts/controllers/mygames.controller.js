myApp.controller('MyGamesController', ['$http', '$firebaseAuth', 'DataFactory', function ($http, $firebaseAuth, DataFactory) {
  console.log('mygamescontroller running');
  var self = this;
  self.newGame = {}
  self.games = [];

  getGames();

  function getGames() {
    return function(){
        DataFactory.getGames().then(function (response) { //was updateGames
          console.log('returned to controller from factory', response);
          self.games = response;
        });
      }
  } //end getgames function


  self.addGame = function () {
    // Give our new object to the factory to store on the server
    DataFactory.addGame(self.newGame).then(getGames());
  }

}]); //end controller





//     $http.get('/myGames')
//     .then(function(response) {
//       console.log('response.data: ', response.data);
//       self.games = response.data;
//     });
//   }
// }]);
