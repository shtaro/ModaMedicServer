var express = require('express');
var router = express.Router();
var User = require('../modules/User');
var common = require('./common');
var jwt = require('jsonwebtoken');
var tempToken = "password";


router.post('/getUser', function(req, res, next) {
  let userid = req.body.UserID;
  User.getUserByUserID(userid, function (err, user) {
    common(res, err, err, user);
  });
});

router.get('/getUserQuestionnaire', function(req, res, next) {
  let userid = req.UserID;
  User.getUserByUserID(userid, function (err, user) {
    common(res, err, err, user.Questionnaires);
  });
});

router.get('/getDateOfSurgery', function(req, res, next) {
  let userid = req.body.UserID;
  User.getUserByUserID(userid, function (err, user) {
    common(res, err, err, user.DateOfSurgery);
  });
});


router.post('/askChangePassword', async function (req, res) {
  await User.getUserByUserID(req.UserID, function (err, user) {
    if (user) {
      var payload = {
        UserID: user.UserID, Type: user.Type
      };
      var options = {expiresIn: "300000ms"};
      var token = jwt.sign(payload, tempToken, options);
      common(res, err, err, token);
    } else {
      var error = {'message': 'User not exists'};
      common(res, error, error, null);
    }
  });
});


module.exports = router;
