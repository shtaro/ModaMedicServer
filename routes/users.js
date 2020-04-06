var express = require('express');
var router = express.Router();
var User = require('../modules/User');
var common = require('./common');
var jwt = require('jsonwebtoken');
var service = require('../service');
var secret="secret";
var tempToken="password";
var Verification = require('../modules/Verification');


router.get('/getVerifications', async function(req, res){
  await Verification.getAllVerification( function(err, questions){
    common(res, err, err, questions);
  });
});

router.get('/getVerificationQuestion', async function(req, res){
  await Verification.getOneVerification( req.query.QuestionID, function(err, question){
    common(res, err, err, question);
  });
});


router.post('/register', async function (req, res, next) {
  await User.getUserByUserID(req.body.UserID, function (err,user) {
    if(!user){
      let newUser = new User({
        UserID: req.body.UserID,
        Password: service.hashElement(req.body.Password),
        First_Name: req.body.First_Name,
        Last_Name: req.body.Last_Name,
        BirthDate: req.body.BirthDate,
        Type: req.body.Type,
        DateOfSurgery: req.body.DateOfSurgery,
        Questionnaires: req.body.Questionnaires,
        VerificationQuestion: req.body.VerificationQuestion,
        VerificationAnswer: req.body.VerificationAnswer
      });
      User.createUser(newUser, function (error, user) {
        common(res, error, error, newUser);
      });
    }
    else {
      var error = { 'message': 'User already exists' };
      common(res, error, error, null);
    }
  });
});

router.post('/login', async function(req, res, next) {
  await User.getUserByUserID(req.body.UserID, function (err,user) {
    if(user){
      console.log(service.hashElement(req.body.Password));
      if(user.Password === service.hashElement(req.body.Password)){
        var payload = {
          UserID: user.UserID, Type: user.Type
        };
        var options = {expiresIn: "30d"};
        var token = jwt.sign(payload, secret, options);
        var userName = user.First_Name + " " + user.Last_Name;
        common(res,error,error,{"token":token,"name":userName,"type":user.Type});
      }
      else {
        var error = { 'message': 'Password incorrect' };
        common(res, error, error, null);
      }
    }
    else {
      var error = { 'message': 'User not exists' };
      common(res, error, error, null);
    }
  });
});

router.post('/forgotPassword', async function (req, res) {
  await User.getUserByUserID(req.body.UserID, function (err, user) {
    if (user)
      common(res, err, null, user.VerificationQuestion);
    else {
      var error = {'message': 'User not exists'};
      common(res, error, error, null);
    }
  });
});

router.post('/checkVerification', async function(req, res){
  await User.getUserByUserID(req.body.UserID, function (err,user) {
    if(user){
      if(user.VerificationAnswer === req.body.VerificationAnswer && user.BirthDate === req.body.BirthDate){
        var payload = {
          UserID: user.UserID, Type: user.Type
        };
        var options = {expiresIn: "300000ms"};
        var token = jwt.sign(payload, tempToken, options);
        common(res,error,error,token);
      }
      else {
        var error = { 'message': 'Incorrect' };
        common(res, error, error, null);
      }
    }
    else {
      var error = { 'message': 'User not exists' };
      common(res, error, error, null);
    }
  });
});

router.use('/passwordChangeCheck', function (req, res, next) {
  User.passwordCheck(req, res, next);
});

router.post('/passwordChangeCheck/changePassword', async function (req, res) {
  await User.getUserByUserID(req.UserID, function (err, user) {
    if (err) throw err;
    User.changePassword(user, req.body.NewPassword, function (err) {
      if (err) {
        error = {'message': 'Error has occured. Please try again.'}
        common(res, error, 'Error has occured. Please try again.', null);
      } else {
        common(res, false, "Password Changed", null);
      }
    })
  });
});

/***
    User.changePassword(user, New_Password,  async function (err) {
      if (!err) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'modamedic4@gmail.com',
            pass: 'moda1234'
          }
        });

        var mailOptions = {
          from: 'modamedic4@gmail.com',
          to: user.Email,
          subject: 'Password Reset for ModaMedic',
          text: 'Your new password is: ' + New_Password + '\n You can change it after you log in.'
        };

        await transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            common(res, err, err, null);
          } else {
            common(res, err, "Mail Sent", null);
          }
        });
      }
    });
  });
});
**/

var RandomString = function () {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};


module.exports = router;
