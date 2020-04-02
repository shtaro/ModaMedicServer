var express = require('express');
var router = express.Router();
var User = require('../modules/User');
var common = require('./common');
var jwt = require('jsonwebtoken');

var secret="secret";


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
          UserID: user.UserID, Email: user.Email, Type: user.Type
        };
        options = {expiresIn: "30d"};
        var token = jwt.sign(payload, secret, options);
        var userName = user.First_Name + " " + user.Last_Name;
        return common(res,error,error,{"token":token,"name":userName,"type":user.Type});
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
