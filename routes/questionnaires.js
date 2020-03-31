var express = require('express');
var router = express.Router();
var common = require('./common');
var Questionnaire = require('../modules/Questionnaire');


router.get('/getQuestionnaire/:QuestionnaireID', function (req, res, next) {
    Questionnaire.getQuestionnaire(req.params.QuestionnaireID,function (err, questionnaire) {
        common(res, err, err, questionnaire);
    });
});

router.get('/all', function (req, res, next) {
    Questionnaire.find({},function (err, questionnaires) {
        common(res, err, err, questionnaires);
    });
});


module.exports = router;