var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


//Define a schema
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    UserID: String,
    Timestamp: Number,
    Questionnaire_ID: Number,
    Answers: [{
        QuestionID: Number,
        AnswerID: Number
    }]
});

//create models
var Answer = module.exports = mongoose.model('Answer', AnswerSchema, 'Answer');


