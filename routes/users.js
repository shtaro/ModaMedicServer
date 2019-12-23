var express = require('express');
var router = express.Router();
var User = require('../modules/User');
var common = require('./common');



router.post('/getUser', function(req, res, next) {
  var userid = req.body.user_id;
  User.getUserByUserID(userid, function (err, user) {
    common(res, err, null, user);
  });
});

router.post('/register', function (req, res, next) {
  var First_Name = req.body.First_Name;
  var Last_Name = req.body.Last_Name;
  var user_id = req.body.user_id;
  var Password = req.body.Password;
  var Type = req.body.Type;
  var birthDate = req.body.BirthDate;
  var email = req.body.Email;

  var newUser = new User({
    user_id: user_id,
    Password: Password,
    First_Name: First_Name,
    Last_Name: Last_Name,
    BirthDate: birthDate,
    Email: email,
    Type: Type
  });

  User.createUser(newUser, function (error, user) {
    if (error) {
      common(res, error, error, null);
    }
    else {
      common(res, error, error, null);
    }
  });
});


router.get('/about', function (req, res) {
  res.send('About this wiki');
});

module.exports = router;
