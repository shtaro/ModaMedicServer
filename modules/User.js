

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_id : {
        type:String,
        index:true,
        unique: true
    },
    Password: {
        type:String
    },
    First_Name: {
        type:String
    },
    Last_Name: {
        type:String
    },
    BirthDate: {
        type:Date
    },
    Email: {
        type:String
    },
    Type:{
        type:String
    }

});

//create models
var User = module.exports = mongoose.model('User', UserSchema, 'User');



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
module.exports.getUserByUserID = function(username, callback){
    var query = {user_id: username};
    User.findOne(query, callback);
};



//gets user from db by id
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
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

//changes password saved in db
module.exports.changePassword = function(user, newPassword, callback){
    user.Password = service.hashElement(newPassword);
    user.save(callback);
};

//get all users id
// module.exports.getAllUsersIds = function(){
//     User.
// };
**/


