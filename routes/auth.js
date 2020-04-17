var express = require('express');
var router = express.Router();
var common = require('./common');
var User = require('../modules/User');


router.use('/', function (req, res, next){
    User.privateCheck(req, res, next);
});

router.use('/patients', function (req, res, next) {
    User.patientCheck(req, res, next);
});

router.use('/doctors', function (req, res, next) {
    User.doctorCheck(req, res, next);
});

router.use('/admins', function (req, res, next) {
    User.adminCheck(req, res, next);
});


router.get('/logout', function (req, res) {
    req.logout();
    if (!req.user)
        common(res, null, "logged out", null);
    else {
        error = { 'message': "could not log out" };
        common(res, error, "", null);
    }
});


router.get('/isLoggedIn', function (req, res) {
    if (req.user)
        common(res, null, "", true);
    else
        common(res, null, "", false);
});

router.get('/loggedInUser', function (req, res) {
    if (req.user)
        common(res, null, "", req.user);

    else
        common(res, null, "", null);
});


module.exports=router;