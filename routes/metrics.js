var express = require('express');
var router = express.Router();
var common = require('./common');
var StepsMetric = require('../modules/Metrics').StepsMetric;
var DistanceMetric = require('../modules/Metrics').DistanceMetric;
var CaloriesMetric = require('../modules/Metrics').CaloriesMetric;


router.post('/steps', function (req, res, next) {
    let newMetric = new StepsMetric({
        /*TODO: change UserID to token*/
        UserID: "111111111",
        Timestamp: (new Date).getTime(),
        Steps: req.body.Steps
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
        Distance: req.body.Distance
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
        Calories: req.body.Calories
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
    /*TODO: change UserID to token*/
    let userid = "111111111";
    StepsMetric.find({
            UserID: userid,
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
    /*TODO: change UserID to token*/
    let user = "111111111";
    DistanceMetric.find({
            UserID: user,
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
    /*TODO: change UserID to token*/
    let user = "111111111";
    CaloriesMetric.find({
            UserID: user,
            Timestamp: { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

module.exports = router;