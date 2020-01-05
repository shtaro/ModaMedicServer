var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var DailyAnswerSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    ValidDate: Number,
    QuestionnaireID: Number,
    Answers: [{
        QuestionID: Number,
        AnswerID: [
            {
                type: Number
            }
        ]
    }]
});

//create models
module.exports.DailyAnswer = mongoose.model('DailyAnswer', DailyAnswerSchema, 'DailyAnswer');


