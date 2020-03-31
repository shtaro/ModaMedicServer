var express = require('express');
var router = express.Router();
var User = require('../modules/User');
var common = require('./common');
var jwt = require('jsonwebtoken');

var secret="secret";

router.post('/getUser', function(req, res, next) {
  let userid = req.body.UserID;
  User.getUserByUserID(userid, function (err, user) {
    common(res, err, err, user);
  });
});

router.get('/getUserQuestionnaire/:userID', function(req, res, next) {
  let userid = req.params.userID;
  User.getUserByUserID(userid, function (err, user) {
    common(res, err, err, user.Questionnaires);
  });
});

router.get('/getDateOfSurgery/:userID', function(req, res, next) {
  let userid = req.params.userID;
  User.getUserByUserID(userid, function (err, user) {
    common(res, err, err, user.DateOfSurgery);
  });
});

router.get('/list', (req,res) => {
  User.find((err, docs) => {
    if(!err){
      res.send({
        list: docs
      });
    }
    else {
      console.log('Failed to retrieve the Course List: '+ err);
    }
  });
});


router.post('/register', function (req, res, next) {
  User.getUserByUserID(req.body.UserID, function (err,user) {
    if(!user){
      let newUser = new User({
        UserID: req.body.UserID,
        Password: req.body.Password,
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        BirthDate: req.body.BirthDate,
        Email: req.body.Email,
        Type: req.body.Type,
        DateOfSurgery: req.body.DateOfSurgery,
        Questionnaires: req.body.Questionnaires
      });
      User.createUser(newUser, function (error, user) {
        common(res, error, error, newUser);
      });
    }
    else {
      var error = { 'message': 'User already exists' };
      return common(res, error, error, null);
    }
  });
});

router.post('/login', function(req, res, next) {
  User.getUserByUserID(req.body.UserID, function (err,user) {
    if(user){
      if(user.Password === req.body.Password){
        var payload = {
          UserID: user.UserID, First_Name: user.First_Name, Last_Name: user.Last_Name,
          BirthDate: user.BirthDate, Email: user.Email, Type: user.Type,
          DateOfSurgery: user.DateOfSurgery, Questionnaires: user.Questionnaires
        };
        options = {expiresIn: "30d"};
        var token = jwt.sign(payload, secret, options);
        return common(res,error,error,token);
      }
      else {
        var error = { 'message': 'Password incorrect' };
        return common(res, error, error, null);
      }
    }
    else {
      var error = { 'message': 'User not exists' };
      return common(res, error, error, null);
    }
  });
});

module.exports = router;
