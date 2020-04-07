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


var findMostRecent = function(docs, start, end){
    var ans = [];
    var realStart;
    if(start!==0)
        realStart = (new Date(start)).setHours(-(24),0,0,0);
    else{
        var oldest= docs[0];
        docs.forEach(function(doc){
            if(doc.ValidTime<oldest.ValidTime)
                oldest=doc;
        });
        realStart = (new Date(oldest.ValidTime)).setHours(0,0,0,0);
    }
    var realEnd = (new Date(end)).setHours(24, 0, 0, 0);
    for(var temp = realStart; temp <= realEnd; temp += (24 * 3600 * 1000)){
        var docsPerDay = [];
        docs.forEach(function(doc){
            if(doc.ValidTime>= temp && doc.ValidTime< (temp + (24 * 3600 * 1000)))
                docsPerDay.push(doc);
        });
        if(docsPerDay.length>0) {
            var recent = docsPerDay[0];
            docsPerDay.forEach(function (doc2) {
                if (doc2.ValidTime > recent.ValidTime)
                    recent = doc2;
            });
            ans.push(recent);
        }
    }
    return ans;
};

var findUsers = async function(firstName, lastName, doctorID){
    var usersID = [];
    const leanDoc = await User.find({First_Name: firstName, Last_Name: lastName, Type:'patient'}).lean().exec();
    leanDoc.forEach( function(user){
        Permission.getOnePermission(doctorID, user.UserID, function (err, permission) {
            if(permission)
                usersID.push({UserID: user.UserID, Permission: "yes"});
            else
                usersID.push({UserID: user.UserID, Permission: "no"});
        });

    });
    return usersID;
};

var checkTimes = function(start, end){
    if (typeof(start) == 'undefined') {
        start = 0;
    }
    if (typeof(end) == 'undefined') {
        end = (new Date).getTime();
    }
};

router.get('/getSteps', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await StepsMetric.find({
                    UserID: user,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user, docs: onePerDay});
                } else
                    ans.push({UserID: user, docs: docs});
            }
            else
                ans.push({UserID: user, docs: "No Permission"});
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
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await DistanceMetric.find({
                    UserID: user,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user, docs: onePerDay});
                } else
                    ans.push({UserID: user, docs: docs});
            }
            else
                ans.push({UserID: user, docs: "No Permission"});
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
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await CaloriesMetric.find({
                    UserID: user,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user, docs: onePerDay});
                } else
                    ans.push({UserID: user, docs: docs});
            }
            else
                ans.push({UserID: user, docs: "No Permission"});
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
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await SleepMetric.find({
                    UserID: user,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user, docs: onePerDay});
                } else
                    ans.push({UserID: user, docs: docs});
            }
            else
                ans.push({UserID: user, docs: "No Permission"});
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
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await AccelerometerMetric.find({
                    UserID: user,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user, docs: onePerDay});
                } else
                    ans.push({UserID: user, docs: docs});
            }
            else
                ans.push({UserID: user, docs: "No Permission"});
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
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await WeatherMetric.find({
                    UserID: user,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user, docs: onePerDay});
                } else
                    ans.push({UserID: user, docs: docs});
            }
            else
                ans.push({UserID: user, docs: "No Permission"});
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
    var usersID = await findUsers(req.query.FirstName, req.query.LastName, req.UserID);
    if(usersID.length>0) {
        var ans = [];
        for (const user of usersID) {
            if(user.Permission==="yes") {
                var docs = await ActivityMetric.find({
                    UserID: user,
                    ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
                }).lean().exec();
                if (docs.length > 0) {
                    var onePerDay = findMostRecent(docs, req.query.start_time, req.query.end_time);
                    ans.push({UserID: user, docs: onePerDay});
                } else
                    ans.push({UserID: user, docs: docs});
            }
            else
                ans.push({UserID: user, docs: "No Permission"});
        }
        common(res, null, null, ans);
    }
    else
        common(res, null, "Not Found", null);
});


module.exports = router;