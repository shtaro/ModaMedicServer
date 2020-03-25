var express = require('express');
var router = express.Router();
var common = require('./common');
var User = require('../modules/User');
var jwt = require("jsonwebtoken");


var secret="secret";

router.post('/register', function (req, res, next) {
    User.getUserByUserID(req.body.UserID, function (err,user) {
        if(!user){
            let newUser = new User({
                UserID: req.body.UserID,
                Password: req.body.Password,
                First_Name: req.body.First_Name,
                Last_Name: req.body.Last_Name,
                BirthDate: new Date(req.body.BirthDate),
                Email: req.body.Email,
                Type: req.body.Type,
                DateOfSurgery: new Date(req.body.DateOfSurgery),
                Questionnaires: req.body.Questionnaires
            });
            User.createUser(newUser, function (error, user) {
                common(res, error, error, newUser);
            });
        }
        else {
            var error = { 'message': 'User already exists' };
            return common(res, error, error, null);
        }
    });
});

router.post('/login', function(req, res, next) {
    User.getUserByUserID(req.body.UserID, function (err,user) {
        if(user){
            if(user.Password === req.body.Password){
                payload = {
                    UserID: user.UserID, First_Name: user.First_Name, Last_Name: user.Last_Name,
                    BirthDate: user.BirthDate, Email: user.Email, Type: user.Type,
                    DateOfSurgery: user.DateOfSurgery, Questionnaires: user.Questionnaires
                };
                options = {expiresIn: "2h"};
                var token = jwt.sign(payload, secret, options);
                return common(res,error,error,token);
            }
            else {
                var error = { 'message': 'Password incorrect' };
                return common(res, error, error, null);
            }
        }
        else {
            var error = { 'message': 'User not exists' };
            return common(res, error, error, null);
        }
    });
});