myApp.controller('MyGamesController', ['$http', '$firebaseAuth', 'DataFactory', '$scope', function ($http, $firebaseAuth, DataFactory, $scope) {
  console.log('mygamescontroller running');
  var self = this;
  self.newGame = {}
  self.games = [];

  getGames();

  function getGames() {
        DataFactory.getGames().then(function (response) { //was updateGames
          console.log('returned to controller from factory', response); // logs
          self.games = response;
          $scope.$apply();
        });
  } //end getgames function


  self.addGame = function () {
    DataFactory.addGame(self.newGame).then(getGames);
  }

}]); //end controller
