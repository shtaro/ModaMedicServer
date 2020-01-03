var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var common = require('./common');
var Questionnaire = require('../modules/Questionnaire');


router.get('/daily_questionnaire', function (req, res, next) {
    Questionnaire.getDaily(function (err, questionnaire) {
        common(res, err, err, questionnaire);
    });
});

router.get('/all', function (req, res, next) {
    Questionnaire.find({},function (err, questionnaires) {
        common(res, err, err, questionnaires);
    });
});


module.exports = router;