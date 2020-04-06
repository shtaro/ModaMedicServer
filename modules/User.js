var mongoose = require('mongoose');
var service = require('../service.js');
var jwt = require('jsonwebtoken');
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
    BirthDate: Number,
    Type: [String],
    DateOfSurgery: Number,
    VerificationQuestion: Number,
    VerificationAnswer: String,
    Questionnaires: [
        {
        QuestionnaireID: Number,
        QuestionnaireText: String
        }
    ]

});

//create models
var User = module.exports = mongoose.model('User', UserSchema,'User');

var secret = "secret";
var tempToken = "password";

//creates user in db
module.exports.createUser = function(newUser, callback){
    //console.log(newUser);
    newUser.save(callback);
};

//gets user from db by username
module.exports.getUserByUserID = async function(userid, callback){
    var query = {UserID: userid};
    await User.findOne(query, callback);
};

module.exports.getUserByName = async function(firstName, lastName, type, callback){
    var query = {First_Name: firstName, Last_Name: lastName, Type:type};
    await User.find(query, callback);
};

module.exports.privateCheck = function(req, res, next) {
    console.log("private check");
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        var userId = decoded.UserID;
        req.UserID = userId;
        req.decoded = decoded;
        console.log("checked");
        next(); //move on to the actual function
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
};

module.exports.patientCheck = function(req, res, next){
    const token = req.header("x-auth-token");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        var userType = decoded.Type;
        if(userType.includes("patient")) {
            req.Type = userType;
            next(); //move on to the actual function
        }
        else{
            res.status(400).send("permission denied, required patient");
        }
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
};

module.exports.doctorCheck = function(req, res, next){
    const token = req.header("x-auth-token");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        var userType = decoded.Type;
        if(userType.includes("doctor")) {
            req.Type = userType;
            next(); //move on to the actual function
        }
        else{
            res.status(400).send("permission denied, required doctor");
        }
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
};

module.exports.adminCheck = function(req, res, next){
    const token = req.header("x-auth-token");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        var userType = decoded.Type;
        if(userType.includes("admin")) {
            req.Type = userType;
            next(); //move on to the actual function
        }
        else{
            res.status(400).send("permission denied, required admin");
        }
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
};

module.exports.passwordCheck = function(req, res, next) {
    console.log("password check");
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, tempToken);
        var userId = decoded.UserID;
        req.UserID = userId;
        req.decoded = decoded;
        console.log("checked");
        next(); //move on to the actual function
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
};

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




