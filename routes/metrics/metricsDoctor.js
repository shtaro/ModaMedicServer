var express = require('express');
var router = express.Router();
var common = require('../common');
var StepsMetric = require('../../modules/Metrics').StepsMetric;
var DistanceMetric = require('../../modules/Metrics').DistanceMetric;
var CaloriesMetric = require('../../modules/Metrics').CaloriesMetric;
var SleepMetric = require('../../modules/Metrics').SleepMetric;
var AccelerometerMetric = require('../../modules/Metrics').AccelerometerMetric;
var WeatherMetric = require('../../modules/Metrics').WeatherMetric;
var ActivityMetric = require('../../modules/Metrics').ActivityMetric;
var User = require('../../modules/User');
var Permission = require('../../modules/Permission');
var service = require('../../service');

var checkTimes = function(start, end){
    if (typeof(start) == 'undefined') {
        start = 0;
    }
    if (typeof(end) == 'undefined') {
        end = (new Date).getTime();
    }
};

var findUsers = async function(firstName, lastName, doctorID){
    var usersID = [];
    const leanDoc = await User.find({First_Name: firstName, Last_Name: lastName, Type:'patient'}).lean().exec();
    for(const user of leanDoc){
        var permission = await Permission.findOne({DoctorID: doctorID, PatientID: user.UserID}).lean().exec();
        if(permission)
            usersID.push({UserID: user.UserID, BirthDate: user.BirthDate, Permission: "yes"});
        else
            usersID.push({UserID: user.UserID, BirthDate: user.BirthDate, Permission: "no"});
    }
    return usersID;
};

router.get('/getSteps', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await StepsMetric.find({
                    UserID: user.UserID,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user.BirthDate, docs: onePerDay});
                } else
                    ans.push({UserID: user.BirthDate, docs: docs});
            }
            else
                ans.push({UserID: user.BirthDate, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getDistance', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await DistanceMetric.find({
                    UserID: user.UserID,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user.BirthDate, docs: onePerDay});
                } else
                    ans.push({UserID: user.BirthDate, docs: docs});
            }
            else
                ans.push({UserID: user.BirthDate, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getCalories', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await CaloriesMetric.find({
                    UserID: user.UserID,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user.BirthDate, docs: onePerDay});
                } else
                    ans.push({UserID: user.BirthDate, docs: docs});
            }
            else
                ans.push({UserID: user.BirthDate, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getSleep', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await SleepMetric.find({
                    UserID: user.UserID,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user.BirthDate, docs: onePerDay});
                } else
                    ans.push({UserID: user.BirthDate, docs: docs});
            }
            else
                ans.push({UserID: user.BirthDate, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getAccelerometer', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await AccelerometerMetric.find({
                    UserID: user.UserID,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user.BirthDate, docs: onePerDay});
                } else
                    ans.push({UserID: user.BirthDate, docs: docs});
            }
            else
                ans.push({UserID: user.BirthDate, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getWeather', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await WeatherMetric.find({
                    UserID: user.UserID,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user.BirthDate, docs: onePerDay});
                } else
                    ans.push({UserID: user.BirthDate, docs: docs});
            }
            else
                ans.push({UserID: user.BirthDate, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});

router.get('/getActivity', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    req.query.start_time = parseFloat(req.query.start_time);
    req.query.end_time = parseFloat(req.query.end_time);
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await ActivityMetric.find({
                    UserID: user.UserID,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = await service.findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user.BirthDate, docs: onePerDay});
                } else
                    ans.push({UserID: user.BirthDate, docs: docs});
            }
            else
                ans.push({UserID: user.BirthDate, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});


module.exports = router;