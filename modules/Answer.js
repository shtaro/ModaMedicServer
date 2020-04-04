var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var DailyAnswerSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    ValidTime: Number,
    QuestionnaireID: Number,
    Answers: [
        {
        QuestionID: Number,
        AnswerID: [
            {
                type: Number
            }
        ]
        }
    ]
});

var PeriodicAnswerSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    ValidTime: Number,
    QuestionnaireID: Number,
    Answers: [
        {
            QuestionID: Number,
            AnswerID: [
                {
                    type: Number
                }
            ]
        }
    ],
    Score: Number
});

//create models
module.exports.DailyAnswer = mongoose.model('DailyAnswer', DailyAnswerSchema, 'DailyAnswer');
module.exports.PeriodicAnswer = mongoose.model('PeriodicAnswer', PeriodicAnswerSchema, 'PeriodicAnswer');


