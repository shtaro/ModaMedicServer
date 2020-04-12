var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var QuestionnaireSchema = new Schema({
    QuestionnaireID: Number,
    QuestionnaireText: String,
    QuestionnaireEnglishText: String,
    Questions: [
        {
            QuestionID: Number,
            QuestionText: String,
            Type: String,
            Alone: [
                {
                type: Number
                }
            ],
            Best: String,
            Worst: String,
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


module.exports.getQuestionnaire = function(qid, callback){
    var query = {QuestionnaireID: qid};
    Questionnaire.findOne(query, callback);
};



