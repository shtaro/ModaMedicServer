var express = require('express');
var router = express.Router();
var common = require('../common');
var DailyAnswer = require('../../modules/Answer').DailyAnswer;
var PeriodicAnswer = require('../../modules/Answer').PeriodicAnswer;


var getScore = function (QuestionnaireID, Answers) {
    var score=0;
    switch(QuestionnaireID){
        case "1":
            Answers.forEach(function(answer){
                if(answer.AnswerID.length>0)
                    score = score + answer.AnswerID[0];
            });
            score = score*2;
            break;
        case "2":
            Answers.forEach(function(answer){
                if(answer.AnswerID.length>0)
                    score = score + answer.AnswerID[0];
            });
            break;
        case "3":
            Answers.forEach(function(answer){
                if(answer.AnswerID.length>0)
                    score = score + answer.AnswerID[0];
            });
            break;
    }
    return score;
};

router.get('/getLastDaily', function(req, res, next){
    let userid = req.UserID;
    DailyAnswer.findOne({UserID:  userid}).sort({ ValidDate: -1 }).exec(function (err, docs) {
            common(res, err, err, docs.ValidDate);
    });
});


/* POST answers to daily */
router.post('/sendAnswers/:QuestionnaireID', function (req, res, next) {
    if(req.params.QuestionnaireID===0) {
        var newAnswer = new DailyAnswer({
            UserID: req.UserID,
            Timestamp: (new Date).getTime(),
            ValidDate: req.body.ValidDate,
            QuestionnaireID: req.params.QuestionnaireID,
            Answers: req.body.Answers
        });
    }
    else{
        var newAnswer = new PeriodicAnswer({
            UserID: req.UserID,
            Timestamp: (new Date).getTime(),
            ValidDate: req.body.ValidDate,
            QuestionnaireID: req.params.QuestionnaireID,
            Answers: req.body.Answers,
            Score: getScore(req.params.QuestionnaireID, req.body.Answers)
        });
    }
    newAnswer.save(function (error) {
        common(res, error, error, newAnswer);
    });
});


router.get('/answeredQuestionnaire', function (req, res) {
    var userID = req.UserID;
    var days = req.query.days;
    var questionnaireID = req.query.questionnaireID;
    var now = new Date();
    var realNow = now.getTime();
    var start = now.setHours(-(24*days),0,0,0);
    PeriodicAnswer.find({
        UserID:  userID,
        QuestionnaireID: questionnaireID,
        ValidDate: { $gte: start, $lte: realNow }
    }, function (err, docs) {
        common(res, err, err, docs.length>0);
    });
});


module.exports = router;