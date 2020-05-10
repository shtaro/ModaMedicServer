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


module.exports=router;