var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var MetricSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    ValidTime: Number,
    Data: Number
});

var SleepSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    ValidTime: Number,
    Data: [{
        StartTime: Number,
        EndTime: Number,
        State: String
    }]
});

var AccelerometerSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    ValidTime: Number,
    Data: [{
        Timestamp: Number,
        x : Number,
        y : Number,
        z : Number
    }]
});

var WeatherSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    ValidTime: Number,
    Data: {
        High: Number,
        Low: Number,
        Humidity: Number
    }
});

var ActivitySchema = new Schema({
    UserID: String,
    Timestamp: Number,
    ValidTime: Number,
    Data: [{
        StartTime: Number,
        EndTime: Number,
        State: String
    }]
});


//create models
module.exports.StepsMetric = mongoose.model('StepsMetric', MetricSchema, 'StepsMetric');
module.exports.DistanceMetric = mongoose.model('DistanceMetric', MetricSchema, 'DistanceMetric');
module.exports.CaloriesMetric = mongoose.model('CaloriesMetric', MetricSchema, 'CaloriesMetric');

module.exports.SleepMetric = mongoose.model('SleepMetric', SleepSchema, 'SleepMetric');
module.exports.AccelerometerMetric = mongoose.model('AccelerometerMetric', AccelerometerSchema, 'AccelerometerMetric');
module.exports.WeatherMetric = mongoose.model('WeatherMetric', WeatherSchema, 'WeatherMetric');
module.exports.ActivityMetric = mongoose.model('ActivityMetric', ActivitySchema, 'ActivityMetric');