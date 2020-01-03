var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var StepsSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    Steps: Number
});

var DistanceSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    Distance: Number
});

var CaloriesSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    Calories: Number
});


//create models
module.exports.StepsMetric = mongoose.model('StepsMetric', StepsSchema, 'StepsMetric');
module.exports.DistanceMetric = mongoose.model('DistanceMetric', DistanceSchema, 'DistanceMetric');
module.exports.CaloriesMetric = mongoose.model('CaloriesMetric', CaloriesSchema, 'CaloriesMetric');
