var express = require('express');
var router = express.Router();
var common = require('./common');
var StepsMetric = require('../modules/Metrics').StepsMetric;
var DistanceMetric = require('../modules/Metrics').DistanceMetric;
var CaloriesMetric = require('../modules/Metrics').CaloriesMetric;


router.post('/steps', function (req, res, next) {
    let newMetric = new StepsMetric({
        UserID: req.body.UserID,
        Timestamp: (new Date).getTime(),
        Steps: req.body.Steps
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/distance', function (req, res, next) {
    let newMetric = new DistanceMetric({
        UserID: req.body.UserID,
        Timestamp: (new Date).getTime(),
        Distance: req.body.Distance
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});

router.post('/steps', function (req, res, next) {
    let newMetric = new CaloriesMetric({
        UserID: req.body.UserID,
        Timestamp: (new Date).getTime(),
        Calories: req.body.Calories
    });
    newMetric.save(function (error) {
        common(res, error, error, newMetric);
    });
});


router.get('/steps', function (req, res, next) {

    //if dates were not specified - query for all dates
    if (typeof(req.query.start_time) == 'undefined') {
        req.query.start_time = 0;
        req.query.end_time = (new Date).getTime();
    }

    users = req.query.Username;
    if (!(req.query.Username instanceof Array))
        users = [req.query.Username];

    StepsMetric.find({
            'UserID': { $in: users },
            'Timestamp': { $gte: req.query.start_time, $lte: req.query.end_time }
        }
        , (function (err, docs) {
            common(res, err, err, docs);
        }));
});

module.exports = router;