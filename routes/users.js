var express = require('express');
var router = express.Router();
var User = require('../modules/User');
var common = require('./common');


router.post('/getUser', function(req, res, next) {
  let userid = req.body.UserID;
  User.getUserByUserID(userid, function (err, user) {
    common(res, err, err, user);
  });
});

router.get('/getUserQuestionnaire/:userID', function(req, res, next) {
  let userid = req.params.userID;
  User.findOne({UserID: userid}, function (err, user) {
    common(res, err, err, user.Questionnaires);
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

  let newUser = new User({
    UserID: req.body.UserID,
    Password: req.body.Password,
    First_Name: req.body.First_Name,
    Last_Name: req.body.Last_Name,
    BirthDate: new Date(req.body.BirthDate, ),
    Email: req.body.Email,
    Type: req.body.Type,
    Questionnaires: req.body.Questionnaires
  });

  User.createUser(newUser, function (error, user) {
      common(res, error, error, newUser);
  });
});


router.post('/about', function (req, res) {
  res.send('About this wiki');
});

module.exports = router;
