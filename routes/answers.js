var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var common = require('./common');
var DailyAnswer = require('../modules/Answer').DailyAnswer;


var getDate = function (timestamp) {
    date = new Date(timestamp).toISOString();
    date_string = date.slice(0, 10) + ' ' + date.slice(-13, -8)
    return date_string;
};

router.get('/getLastDaily', function(req, res, next){
    /*TODO: change userid to token*/
    let userid = "111111111";
    DailyAnswer.findOne({UserID:  userid}).sort({ ValidDate: -1 }).exec(function (err, docs) {
            common(res, err, err, docs.ValidDate);
    });
});

router.get('/getDailyAnswers', function (req, res, next) {
    let userid = req.body.UserID;
    let date = req.body.Date;

    DailyAnswer.find({
            UserID:  userid ,
            ValidDate: date
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});


/* POST answers to daily */
router.post('/daily_answers', function (req, res, next) {
    let newAnswer = new DailyAnswer({
        /*TODO: change UserID to token*/
        UserID: "111111111",
        Timestamp: (new Date).getTime(),
        ValidDate: req.body.ValidDate,
        QuestionnaireID : req.body.QuestionnaireID,
        Answers: req.body.Answers
    });
    newAnswer.save(function (error) {
        common(res, error, error, newAnswer);
    });
});


module.exports = router;