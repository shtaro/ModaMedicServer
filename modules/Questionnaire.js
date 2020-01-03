var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var QuestionnaireSchema = new Schema({
    QuestionnaireID: Number,
    QuestionnaireText: String,
    Questions: [
        {
            QuestionID: Number,
            QuestionText: String,
            Type: String,
            Answers: [
                {
                    answerID: Number,
                    answerText: String
                }
            ]
        }
    ]
});



//create models
var Questionnaire = module.exports = mongoose.model('Questionnaire', QuestionnaireSchema, 'Questionnaire');


module.exports.getDaily = function( callback){
    var query = {QuestionnaireText: "Daily"};
    Questionnaire.find(query, callback);
};



