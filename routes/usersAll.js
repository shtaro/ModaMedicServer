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

router.get('/getUserQuestionnaire', function(req, res, next) {
  let userid = req.body.UserID;
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


module.exports = router;
