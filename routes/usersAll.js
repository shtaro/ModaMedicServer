var express = require('express');
var router = express.Router();
var User = require('../modules/User');
var common = require('./common');
var jwt = require('jsonwebtoken');
var tempToken = "password";
var service = require('../service');


router.get('/getUserQuestionnaire', function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.query.UserID;
  User.getUserByUserID(userid, function (err, user) {
    if(err)
      common(res, true, err, null);
    else{
      if(user)
        common(res, false, null, user.Questionnaires);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.post('/changeUserQuestionnaire', function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.body.UserID;
  let daily = {QuestionnaireID: 0, QuestionnaireText: "יומי"};
  let questionnairesArr = [daily];
  let Questionnaires = req.body.Questionnaires;
  if(Questionnaires.length>0){
    for(const q of Questionnaires){
      questionnairesArr.push(q);
    }
  }
  User.updateOne({UserID: userid}, {Questionnaires: questionnairesArr}, function (err, user) {
    if(err)
      common(res, err, err.message, null);
    else {
      if(user)
        common(res, false, null, user.Questionnaires);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.get('/getDateOfSurgery', function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.query.UserID;
  User.getUserByUserID(userid, function (err, user) {
    if(err)
      common(res, err, err.message, null);
    else {
      if(user)
        common(res, false, null, user.DateOfSurgery);
      else
        common(res, false, "Not Found", null);
    }
  });
});

router.post('/changeDateOfSurgery', function(req, res) {
  var userid = "";
  if(req.Type.includes("patient"))
    userid = req.UserID;
  else
    userid = req.body.UserID;
  User.updateOne({UserID: userid}, {DateOfSurgery: req.body.DateOfSurgery}, function (err, user) {
    if(err)
      common(res, err, err.message, null);
    else {
      if(user)
        common(res, false, null, user.DateOfSurgery);
      else
        common(res, false, "Not Found", null);
    }
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
