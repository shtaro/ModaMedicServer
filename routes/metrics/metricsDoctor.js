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


router.post('/getSteps', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    StepsMetric.find({
            UserID: req.body.UserID,
            ValidDate: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.post('/getDistance', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    DistanceMetric.find({
            UserID: req.body.UserID,
            ValidDate: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.post('/getCalories', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    CaloriesMetric.find({
            UserID: req.body.UserID,
            ValidDate: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.post('/getSleep', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    SleepMetric.find({
            UserID: req.body.UserID,
            ValidDate: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.post('/getAccelerometer', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    AccelerometerMetric.find({
            UserID: req.body.UserID,
            ValidDate: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.post('/getWeather', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    WeatherMetric.find({
            UserID: req.body.UserID,
            ValidDate: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

router.post('/getActivity', function (req, res, next) {
    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }
    ActivityMetric.find({
            UserID: req.body.UserID,
            ValidDate: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});


module.exports = router;