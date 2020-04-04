const express = require('express');
const router = express.Router();
const common = require('../common');
const StepsMetric = require('../../modules/Metrics').StepsMetric;
const DistanceMetric = require('../../modules/Metrics').DistanceMetric;
const CaloriesMetric = require('../../modules/Metrics').CaloriesMetric;
const SleepMetric = require('../../modules/Metrics').SleepMetric;
const AccelerometerMetric = require('../../modules/Metrics').AccelerometerMetric;
const WeatherMetric = require('../../modules/Metrics').WeatherMetric;
const ActivityMetric = require('../../modules/Metrics').ActivityMetric;


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


router.get('/getMissingDates', async function (req, res, next){
    var userID = req.UserID;
    var days = req.query.days;
    var now = new Date();
    var realNow = now.getTime();
    var start = now.setHours(-(24*days),0,0,0);
    var ans = [];
    var docs = [];
    var dates= [];
    docs = await getRecordsBetweenDates(userID, start, realNow, "Steps");
    dates = await findDates(start, realNow, docs);
    ans.push({Steps: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Calories");
    dates = await findDates(start, realNow, docs);
    ans.push({Calories: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Distance");
    dates = await findDates(start, realNow, docs);
    ans.push({Distance: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Sleep");
    dates = await findDates(start, realNow, docs);
    ans.push({Sleep: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Accelerometer");
    dates = await findDates(start, realNow, docs);
    ans.push({Accelerometer: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Weather");
    dates = await findDates(start, realNow, docs);
    ans.push({Weather: dates});
    docs = await getRecordsBetweenDates(userID, start, realNow, "Activity");
    dates = await findDates(start, realNow, docs);
    ans.push({Activity: dates});
    common(res,null,null,ans);
});

var getRecordsBetweenDates = function(userID, start, realNow, metric){
    var docs = [];
    switch(metric){
        case "Steps":
            docs = StepsMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lte: realNow }
            }).exec();
            break;
        case "Calories":
            docs = CaloriesMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lte: realNow }
            }).exec();
            break;
        case "Distance":
            docs = DistanceMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lte: realNow }
            }).exec();
            break;
        case "Sleep":
            docs = SleepMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lte: realNow }
            }).exec();
            break;
        case "Accelerometer":
            docs = AccelerometerMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lte: realNow }
            }).exec();
            break;
        case "Weather":
            docs = WeatherMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lte: realNow }
            }).exec();
            break;
        case "Activity":
            docs = ActivityMetric.find({
                UserID: userID,
                ValidTime: { $gte: start, $lte: realNow }
            }).exec();
            break;
    }
    return docs;
};

var findDates = function(start, realNow, docs){
    var temp;
    var dates = [];
    for(temp = start; temp <= realNow; temp+=(24*3600*1000)) {
        var hasfound = false;
        var i;
        for(i=0; i<docs.length; i++) {
            if (docs[i]._doc.ValidTime < temp + (24 * 3600 * 1000) && docs[i]._doc.ValidTime >= temp) {
                hasfound = true;
                break;
            }
        }
        if (!hasfound)
            dates.push(temp);
    }
    return dates;
};

module.exports = router;