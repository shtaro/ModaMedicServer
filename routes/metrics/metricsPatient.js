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


var getDate = function (timestamp) {
    date = new Date(timestamp).toISOString();
    date_string = date.slice(0, 10) + ' ' + date.slice(-13, -8)
    return date_string;
};

router.post('/steps', function (req, res, next) {
    let newMetric = new StepsMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/distance', function (req, res, next) {
    let newMetric = new DistanceMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/calories', function (req, res, next) {
    let newMetric = new CaloriesMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/sleep', function (req, res, next) {
    let newMetric = new SleepMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/accelerometer', function (req, res, next) {
    let newMetric = new AccelerometerMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/weather', function (req, res, next) {
    let newMetric = new WeatherMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/activity', function (req, res, next) {
    let newMetric = new ActivityMetric({
        UserID: req.UserID,
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});


router.get('/getMissingDates', function (req, res, next){
    var userID = req.UserID;
    var days = req.query.days;
    var now = new Date();
    var realNow = now.getTime();
    var start = now.setHours(-(24*days),0,0,0);
    var temp = 0;
    var ans = [];
    var dates = [];
    StepsMetric.find({
            UserID: userID,
            ValidDate: { $gte: start, $lte: realNow }
        },
        (function (err, docs) {
            for(temp = start; temp <= realNow; temp+=(24*3600*1000)) {
                var hasfound = false;
                docs.forEach(function (doc) {
                    if (doc.ValidDate < temp + (24 * 3600 * 1000) && doc.ValidDate >= temp) {
                        hasfound = true;
                    }
                });
                if (!hasfound)
                    dates.push(temp);
            }
            ans.push({Steps: dates});
        }));


    common(res,null,null,ans);
});

var getStepsBetweenDates = function(userID, start, realNow){
    StepsMetric.find({
            UserID: userID,
            ValidDate: { $gte: start, $lte: realNow }
        },
        (function (err, docs) {
            return docs;
    }));
};

module.exports = router;