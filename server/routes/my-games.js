var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');
var currentUser = {};

//get request
router.get('/', function(req, res){
  //get game and user data from database - need to know what users have which games
  pg.connect(connectionString, function(err, client, done){
    // console.log('req.decodedToken: ', req.decodedToken);
    var userEmail = req.decodedToken.email;
    client.query('SELECT * FROM games ' +
    'JOIN users_games ON games.id = users_games.game_id ' +
    'JOIN users ON users.id = users_games.user_id ' + 'WHERE users.email=$1;', [userEmail], function(err, results){
      done();
      if(err){
        console.log('Error', err);
        res.sendStatus(500);
      } else {
        if(results.rowCount === 0) {
          console.log('No games found for user with that email. Email: ', userEmail);
          res.sendStatus(400);
        } else {
          console.log(results.rows);
          res.send(results.rows);
        }
      }
    });
  }); //end of pg get request
}); //end of get request


//post request starts here
router.post('/', function(req, res) {
  var newGame = req.body;
  var userId = {}
  var gameId = {}
  console.log(newGame);
  //Insert new game into games table
  pg.connect(connectionString, function(err, client, done) {
    var userEmail = req.decodedToken.email;
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
      return;
    }

    client.query(
      'INSERT INTO games (game, number_players, time_to_play, expansion) ' +
      'VALUES ($1, $2, $3, $4) RETURNING id;',
      [newGame.game, newGame.number_players, newGame.time_to_play, newGame.expansion],
      function(err, results) {
        done();
        if(err) {
          console.log('insert query error: ', err);  //want to know if there is an error
          res.sendStatus(500);
          return;
        } else {
          console.log(userEmail);
          //Find the user id that matches the user email that is logged in
          client.query(
            'SELECT id FROM users WHERE email=$1;', [userEmail], function(err, results){
            done();
            if(err){
              console.log('Error', err);
              res.sendStatus(500);
              return;
            } else {
              if(results.rowCount === 0) {
                console.log('No user found with that email. Email: ', userEmail);
                res.sendStatus(403);
                return;
              } else {
                console.log(results.rows);
                userId = results.rows[0].id;
                console.log('This is the userId', userId);
                client.query(
                  'INSERT INTO users_games(game_id, user_id) ' + 'VALUES ($1, $2)',
                  [gameId, userId],
                  function(err, result) {
                    done();
                    console.log('new game game id', gameId);
                    console.log('new game user id', userId);
                    if(err) {
                      console.log('insert query error: ', err);
                      res.sendStatus(500);
                      return;
                    } else {
                      res.sendStatus(201);
                    } //end of else
                  });//end of query
              }
            }  //end of else
          });  //end of query

          console.log('successfully inserted game');
          gameId = results.rows[0].id;
          console.log('This is the gameId', gameId);
        } //end of else
      });//end of query


      //Insert the matching ids into the users_games table



  });  //end of pg post connect

});  //end of post request




module.exports = router;
