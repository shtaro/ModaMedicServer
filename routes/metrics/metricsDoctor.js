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

router.post('/getSteps', async function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    var firstName=req.query.FirstName;
    var lastName=req.query.LastName;
    var usersID = [];
    await User.getUserByName(firstName, lastName, 'patient', function (err, users) {

        users.forEach(function(user){
            usersID.push(user.UserID);
        });
    });
    if(usersID.length>0) {
        await StepsMetric.find({
                UserID: usersID[0],
                ValidTime: {$gte: req.query.start_time, $lte: req.query.end_time}
            }
            , (function (err, docs) {
                if (docs.length > 0) {
                    var ans = findMostRecent(docs, req.query.start_time, req.query.end_time);
                    common(res, err, err, ans);
                } else
                    common(res, err, err, docs);
            }));
    }
    else
        common(res, null, "Not Found", null);
});

router.post('/getDistance', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    DistanceMetric.find({
            UserID: req.body.UserID,
            ValidTime: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            if(docs.length>0) {
                var ans = findMostRecent(docs, req.query.start_time, req.query.end_time);
                common(res, err, err, ans);
            }
            else
                common(res, err, err, docs);
        }));
});

router.post('/getCalories', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    CaloriesMetric.find({
            UserID: req.body.UserID,
            ValidTime: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            if(docs.length>0) {
                var ans = findMostRecent(docs, req.query.start_time, req.query.end_time);
                common(res, err, err, ans);
            }
            else
                common(res, err, err, docs);
        }));
});

router.post('/getSleep', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    SleepMetric.find({
            UserID: req.body.UserID,
            ValidTime: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            if(docs.length>0) {
                var ans = findMostRecent(docs, req.query.start_time, req.query.end_time);
                common(res, err, err, ans);
            }
            else
                common(res, err, err, docs);
        }));
});

router.post('/getAccelerometer', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    AccelerometerMetric.find({
            UserID: req.body.UserID,
            ValidTime: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            if(docs.length>0) {
                var ans = findMostRecent(docs, req.query.start_time, req.query.end_time);
                common(res, err, err, ans);
            }
            else
                common(res, err, err, docs);
        }));
});

router.post('/getWeather', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    WeatherMetric.find({
            UserID: req.body.UserID,
            ValidTime: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            if(docs.length>0) {
                var ans = findMostRecent(docs, req.query.start_time, req.query.end_time);
                common(res, err, err, ans);
            }
            else
                common(res, err, err, docs);
        }));
});

router.post('/getActivity', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
    }
    if (typeof(req.query.end_time) == 'undefined') {
        req.query.end_time = (new Date).getTime();
    }
    ActivityMetric.find({
            UserID: req.body.UserID,
            ValidTime: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            if(docs.length>0) {
                var ans = findMostRecent(docs, req.query.start_time, req.query.end_time);
                common(res, err, err, ans);
            }
            else
                common(res, err, err, docs);
        }));
});


module.exports = router;