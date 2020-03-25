var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var service = require('../service.js');

var Questionnaires = require('../modules/Questionnaire');
//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    UserID : {
        type:String,
        index:true,
        unique: true
    },
    Password: String,
    First_Name: String,
    Last_Name: String,
    BirthDate: Date,
    Email: String,
    Type: String,
    DateOfSurgery: Date,
    Questionnaires: [
        {
        QuestionnaireID: Number,
        QuestionnaireText: String
        }
    ]

});

//create models
var User = module.exports = mongoose.model('User', UserSchema,'User');



//creates user in db
module.exports.createUser = function(newUser, callback){
    console.log(newUser);
    // TODO: add this code after fix. Retuens an error.
    // counter.getNextSequenceValue("users",(id)=>{
    //     newUser.user_id = id;
    //     newUser.save(callback);
    // });
    newUser.save(callback);
};

//gets user from db by username
module.exports.getUserByUserID = function(userid, callback){
    var query = {UserID: userid};
    User.findOne(query, callback);
};

/**
//returns if entered password matches saved password (using hash)
module.exports.comparePassword = function(candidatePassword, hash, callback){
    var hasedPassword=service.hashElement(candidatePassword);
    var isMatch=false;
    if (hasedPassword==hash)
        isMatch=true;
    callback(null, isMatch);
};
**/
//changes password saved in db
module.exports.changePassword = function(user, newPassword, callback){
    user.Password = service.hashElement(newPassword);
    user.save(callback);
};

//get all users id
// module.exports.getAllUsersIds = function(){
//     User.
// };



