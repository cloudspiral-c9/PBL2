'use strict';

var express = require('express');
var router = express.Router();

var checkLoggedInToRoot = function(req, res, next) {

  if (!req.user) {
    console.log('not logged-in');
    res.redirect('http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com/recipeers/public/');
  } else {
    next();
  }
};

var checkLoggedInToIntro = function(req, res, next) {

  if (!req.user) {
    console.log('not logged-in');
    res.redirect('http://ec2-54-64-199-130.ap-northeast-1.compute.amazonaws.com/recipeers/public/views/what-recipeers.html');
  } else {
    next();
  }
};

//ROOT ログイン不要
router.get('/', function(req, res) {
  console.log('ROOT');
  res.render('index.html');
});

//login不要バージョンのWHATS RECIPEERS
router.get('/introduction', function(req, res) {
  console.log('introduction');
  res.render('views/what-recipeers.html');
});

//ログインが必要なバージョンのWHAT'S RECIPEERS
router.get('/introduction/login', checkLoggedInToIntro, function(req, res) {
  console.log('introduction-loggedin');
  res.render('views/login/what-recipeers-loggedin.html');
});

router.get('/roomselect/login', checkLoggedInToRoot, function(req, res) {
  console.log('select-room');
  res.render('views/login/room-select.html');
});


module.exports = router;
