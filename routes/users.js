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
    await User.getUserByUserID(service.hashElement(req.body.UserID), async function (err, user) {
      if (!user) {
        let daily = {QuestionnaireID: 0, QuestionnaireText: "יומי"};
        let questionnairesArr = [daily];
        let eq5 = {QuestionnaireID: 5, QuestionnaireText: "איכות חיים"};
        let eq6 = {QuestionnaireID: 6, QuestionnaireText: "דירוג איכות חיים"};
        questionnairesArr.push(eq5);
        questionnairesArr.push(eq6);
        let Questionnaires = req.body.Questionnaires;
        if(Questionnaires.length>0){
          for await (const q of Questionnaires){
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
        await User.createUser(newUser, function (error, user) {
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
    await User.getUserByUserID(service.hashElement(req.body.UserID), async function (err, user) {
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
        await User.createUser(newUser, function (error, user) {
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
      var zeroBirth = new Date(req.body.BirthDate).setHours(0,0,0,0);
      if(user.VerificationAnswer == req.body.VerificationAnswer && user.BirthDate == zeroBirth){
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
      await User.getUserByUserID(req.UserID, async function (err, user) {
        if (err) {
          var error = {'message': 'Error has occurred. Please try again.'};
          common(res, error, 'Error has occurred. Please try again.', null);
        }
        else {
          await User.changePassword(user, req.body.NewPassword, function (err) {
            if (err) {
              var error = {'message': 'Error has occurred. Please try again.'};
              common(res, error, 'Error has occurred. Please try again.', null);
            } else {
              common(res, false, "Password Changed", null);
            }
          });
        }
  });
});


module.exports = router;
