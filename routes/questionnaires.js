var express = require('express');
var router = express.Router();
var common = require('./common');
var Questionnaire = require('../modules/Questionnaire');


router.get('/getQuestionnaire/:QuestionnaireID', function (req, res, next) {
    Questionnaire.getQuestionnaire(req.params.QuestionnaireID,function (err, questionnaire) {
        if(err)
            common(res, true, err, null);
        else
            common(res, false, null, questionnaire);
    });
});

router.get('/all', function (req, res, next) {
    Questionnaire.find({},function (err, questionnaires) {
        if(err)
            common(res, true, err, null);
        else
            common(res, false, null, questionnaires);
    });
});


module.exports = router;