var express = require('express');
var router = express.Router();
var User = require('../modules/User');
var common = require('./common');
var jwt = require('jsonwebtoken');
var service = require('../service');
var secret="secret";
var tempToken="password";
var Verification = require('../modules/Verification');
const StepsMetric = require('../modules/Metrics').StepsMetric;
const DistanceMetric = require('../modules/Metrics').DistanceMetric;
const CaloriesMetric = require('../modules/Metrics').CaloriesMetric;
const SleepMetric = require('../modules/Metrics').SleepMetric;
const AccelerometerMetric = require('../modules/Metrics').AccelerometerMetric;
const WeatherMetric = require('../modules/Metrics').WeatherMetric;
const ActivityMetric = require('../modules/Metrics').ActivityMetric;
var DailyAnswer = require('../modules/Answer').DailyAnswer;
var PeriodicAnswer = require('../modules/Answer').PeriodicAnswer;
var PermissionRequest = require('../modules/PermissionRequest');
var Permission = require('../modules/Permission');


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


router.post('/patientRegister', async function (req, res) {
  if(req.body.Code=="soroka372abc") {
    await User.getUserByUserID(service.hashElement(req.body.UserID), function (err, user) {
      if (!user) {
        let daily = {QuestionnaireID: 0, QuestionnaireText: "יומי"};
        let questionnairesArr = [daily];
        let Questionnaires = req.body.Questionnaires;
        if(Questionnaires.length>0){
          for(const q of Questionnaires){
            questionnairesArr.push(q);
          }
        }
        let newUser = new User({
          UserID: service.hashElement(req.body.UserID),
          Password: service.hashElement(req.body.Password),
          First_Name: req.body.First_Name,
          Last_Name: req.body.Last_Name,
          Phone_Number: req.body.Phone_Number,
          Gender: req.body.Gender,
          Smoke: req.body.Smoke,
          SurgeryType: req.body.SurgeryType,
          Education: req.body.Education,
          Height: req.body.Height,
          Weight: req.body.Weight,
          BMI: req.body.BMI,
          BirthDate: (new Date(req.body.BirthDate)).setHours(0, 0, 0, 0),
          Type: ["patient"],
          DateOfSurgery: req.body.DateOfSurgery,
          Questionnaires: questionnairesArr,
          VerificationQuestion: req.body.VerificationQuestion,
          VerificationAnswer: req.body.VerificationAnswer,
          ValidTime: req.body.ValidTime,
          Timestamp: new Date().getTime()
        });
        User.createUser(newUser, function (error, user) {
          if(error)
            common(res, error, error, null);
          else
            common(res,false,null,newUser);
        });
      } else {
        var error = {'message': 'Taken Email'};
        common(res, error, error, null);
      }
    });
  }
  else{
    var error = {'message': 'Wrong Code'};
    common(res, error, error, null);
  }
});

router.post('/doctorRegister', async function(req, res){
  if(req.body.Code=="soroka93xyz"){
    await User.getUserByUserID(service.hashElement(req.body.UserID), function (err, user) {
      if (!user) {
        let newUser = new User({
          UserID: service.hashElement(req.body.UserID),
          Password: service.hashElement(req.body.Password),
          First_Name: req.body.First_Name,
          Last_Name: req.body.Last_Name,
          Phone_Number: req.body.Phone_Number,
          BirthDate: (new Date(req.body.BirthDate)).setHours(0, 0, 0, 0),
          Type: ["doctor"],
          VerificationQuestion: req.body.VerificationQuestion,
          VerificationAnswer: req.body.VerificationAnswer,
          ValidTime: req.body.ValidTime,
          Timestamp: new Date().getTime()
        });
        User.createUser(newUser, function (error, user) {
          if(error)
            common(res, error, error, null);
          else
            common(res,false,null,newUser);
        });
      } else {
        var error = {'message': 'Taken Email'};
        common(res, error, error, null);
      }
    });
  }
  else{
    var error = {'message': 'Wrong Code'};
    common(res, error, error, null);
  }
});

router.post('/login', async function(req, res) {
  await User.getUserByUserID(service.hashElement(req.body.UserID), function (err,user) {
    if(user){
      if(user.Password === service.hashElement(req.body.Password)){
        var payload = {
          UserID: user.UserID, Type: user.Type
        };
        var options = {expiresIn: "365d"};
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
  await User.getUserByUserID(service.hashElement(req.body.UserID), function (err, user) {
    if (user)
      common(res, err, null, user.VerificationQuestion);
    else {
      var error = {'message': 'User not exists'};
      common(res, error, error, null);
    }
  });
});

router.post('/checkVerification', async function(req, res){
  await User.getUserByUserID(service.hashElement(req.body.UserID), function (err,user) {
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
        error = {'message': 'Error has occured. Please try again.'};
        common(res, error, 'Error has occured. Please try again.', null);
      } else {
        common(res, false, "Password Changed", null);
      }
    })
  });
});

router.get('/changeDB', async function (req, res) {
/**
  await User.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await User.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });

  await DailyAnswer.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await DailyAnswer.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });

  await PeriodicAnswer.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await PeriodicAnswer.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });

  await StepsMetric.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await StepsMetric.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });
  await DistanceMetric.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await DistanceMetric.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });
  await CaloriesMetric.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await CaloriesMetric.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });
  await SleepMetric.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await SleepMetric.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });
  await ActivityMetric.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await ActivityMetric.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });
  await AccelerometerMetric.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await AccelerometerMetric.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });
  **/
  await PermissionRequest.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await PermissionRequest.updateOne({DoctorID: user.DoctorID, PatientID:user.PatientID}, {DoctorID: service.hashElement(user.DoctorID), PatientID: service.hashElement(user.PatientID)}, function (err) {
        if(err) throw err;
      });
    }
  });
  await Permission.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await Permission.updateOne({DoctorID: user.DoctorID, PatientID:user.PatientID}, {DoctorID: service.hashElement(user.DoctorID), PatientID: service.hashElement(user.PatientID)}, function (err) {
        if(err) throw err;
      });
    }
  });
  /**
  await WeatherMetric.find({}, async function(err, users){
    if(err) throw err;
    for(const user of users){
      await WeatherMetric.updateOne({UserID: user.UserID}, {UserID: service.hashElement(user.UserID)}, function (err) {
        if(err) throw err;
      });
    }
  });
**/
  common(res, null, null, "done");
});

var RandomString = function () {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};


module.exports = router;
