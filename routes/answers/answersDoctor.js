var express = require('express');
var router = express.Router();
var common = require('../common');
var DailyAnswer = require('../../modules/Answer').DailyAnswer;
var PeriodicAnswer = require('../../modules/Answer').PeriodicAnswer;
var service = require('../../service');
var User = require('../../modules/User');
var Permission = require('../../modules/Permission');

var getDate = function (timestamp) {
    date = new Date(timestamp).toISOString();
    date_string = date.slice(0, 10) + ' ' + date.slice(-13, -8)
    return date_string;
};


var findUsers = async function(firstName, lastName, doctorID){
    var usersID = [];
    const leanDoc = await User.find({First_Name: firstName, Last_Name: lastName, Type:'patient'}).lean().exec();
    for(const user of leanDoc){
        var permission = await Permission.findOne({DoctorID: doctorID, PatientID: user.UserID}).lean().exec();
        if(permission)
            usersID.push({UserID: user.UserID, Permission: "yes"});
        else
            usersID.push({UserID: user.UserID, Permission: "no"});
    }
    return usersID;
};

router.get('/getDailyAnswers', async function (req, res, next) {
    if (typeof (req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof (req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await DailyAnswer.find({
                    UserID: user.UserID,
                    QuestionnaireID: 0,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user.UserID, docs: onePerDay});
                } else
                    ans.push({UserID: user.UserID, docs: docs});
            }
            else
                ans.push({UserID: user.UserID, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getPeriodicAnswers', async function (req, res, next) {
    if (typeof (req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof (req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var questionnaires = [];
                let userObj = await User.findOne({UserID: user.UserID}).lean().exec();
                questionnaires = userObj.Questionnaires;
                for(const quest of questionnaires){
                    var docs = await PeriodicAnswer.find({
                        UserID: user.UserID,
                        QuestionnaireID: quest.QuestionnaireID,
                        ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                    }).lean().exec();
                    if (docs.length > 0) {
                        var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                        let docs2 = {QuestionnaireID: quest.QuestionnaireID, data: onePerDay};
                        ans.push({UserID: user.UserID, docs: docs2});
                    } else {
                        let docs2 = {QuestionnaireID: quest.QuestionnaireID, data: docs};
                        ans.push({UserID: user.UserID, docs: docs2});
                    }
                }
            }
            else
                ans.push({UserID: user.UserID, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});


module.exports = router;