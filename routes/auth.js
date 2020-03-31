var express = require('express');
var router = express.Router();
var common = require('./common');
var User = require('../modules/User');
var jwt = require("jsonwebtoken");
var service = require('../service.js');


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

router.post('/change_password', function (req, res) {
    if (req.user) {
        User.getUserByUserID(req.user.UserID, function (err, user) {
            if (err) throw err;
            User.comparePassword(req.body.Old_Password, user.Password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    User.changePassword(user, req.body.New_Password, function (err) {
                        if (err) {
                            error = { 'message': 'Error has occured. Please try again.' }
                            common(res, error, 'Error has occured. Please try again.', null);
                        }
                        else {
                            common(res, false, null, null);
                        }
                    })
                }
                else {
                    error = { 'message': 'Wrong Password.' }
                    common(res, error, 'Wrong Password.', null);
                }
            });
        });
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

/**
router.post('/forgotPassword', function (req, res) {
    User.getUserByUserID(service.hashElement(req.body.UserID), function (err, user) {
        var New_Password = RandomString();
        User.changePassword(user, New_Password, function (err) {
            if (!err) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'medicalmystery3@gmail.com',
                        pass: 'Medic@lMystery'
                    }
                });

                var mailOptions = {
                    from: 'medicalmystery3@gmail.com',
                    to: req.body.UserID,
                    subject: 'Password Reset for MedicalMystery',
                    text: 'Your new password is: ' + New_Password + '\n You can change it after you log in.'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        common(res, err, err, null);
                    } else {
                        common(res, err, err, null);
                    }
                });
            }
        });
    });
});
**/


module.exports=router;