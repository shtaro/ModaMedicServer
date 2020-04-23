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

router.get('/all', async function (req, res) {
    await Questionnaire.find({}, async function (err, questionnaires) {
        if(questionnaires) {
            if (err)
                common(res, true, err, null);
            else {
                let data = [];
                questionnaires.forEach(function (q) {
                    var obj = {QuestionnaireID: q.QuestionnaireID, QuestionnaireText: q.QuestionnaireText};
                    data.push(obj);
                });
                common(res, false, null, data);
            }
        }
        else{
            common(res, false, "Not Found", null);
        }
    });
});


module.exports = router;