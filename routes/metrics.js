var express = require('express');
var router = express.Router();
var common = require('./common');
var StepsMetric = require('../modules/Metrics').StepsMetric;
var DistanceMetric = require('../modules/Metrics').DistanceMetric;
var CaloriesMetric = require('../modules/Metrics').CaloriesMetric;
var SleepMetric = require('../modules/Metrics').SleepMetric;
var AccelerometerMetric = require('../modules/Metrics').AccelerometerMetric;
var WeatherMetric = require('../modules/Metrics').WeatherMetric;
var ActivityMetric = require('../modules/Metrics').ActivityMetric;



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
        UserID: "111111111",
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

router.get('/getSteps', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    StepsMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.get('/getDistance', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    DistanceMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.get('/getCalories', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    CaloriesMetric.find({
            UserID: req.query.UserID,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

module.exports = router;