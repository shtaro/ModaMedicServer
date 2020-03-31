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



router.post('/steps', function (req, res, next) {
    let newMetric = new StepsMetric({
        /*TODO: change UserID to token*/
        UserID: "111111111",
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
        /*TODO: change UserID to token*/
        UserID: "111111111",
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
        /*TODO: change UserID to token*/
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
        /*TODO: change UserID to token*/
        UserID: "111111111",
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
        /*TODO: change UserID to token*/
        UserID: "111111111",
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
        /*TODO: change UserID to token*/
        UserID: "111111111",
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
        /*TODO: change UserID to token*/
        UserID: "111111111",
        Timestamp: (new Date).getTime(),
        ValidTime: req.body.ValidTime,
        Data: req.body.Data
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});




router.get('/getMissingDates', function (req, res, next){
    var userID = req.query.UserID;
    var days = req.query.days;
    var metricName = req.query.metricName;
    var now = (new Date).getTime();
    var lastTimestamp = now-(days*1000 * 3600 * 24);
    switch(metricName){
        case "steps":
            StepsMetric.find({
                    UserID: userID,
                    ValidDate: { $gte: lastTimestamp, $lte: now }
                },
                (function (err, docs) {
                    docs.forEach(function(metric){
                        if(metric.ValidDate>lastTimestamp)
                            score = score + answer.AnswerID[0];
                });
            }));
            break;
    }

});

module.exports = router;