var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var MetricSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    Data: Number
});



//create models
module.exports.StepsMetric = mongoose.model('StepsMetric', MetricSchema, 'StepsMetric');
module.exports.DistanceMetric = mongoose.model('DistanceMetric', MetricSchema, 'DistanceMetric');
module.exports.CaloriesMetric = mongoose.model('CaloriesMetric', MetricSchema, 'CaloriesMetric');
