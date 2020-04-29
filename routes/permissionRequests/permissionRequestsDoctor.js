var express = require('express');
var router = express.Router();
var common = require('../common');
var PermissionRequest = require('../../modules/PermissionRequest');
var service = require('../../service');

router.post('/requestPermission', async function(req, res){
    let request = await PermissionRequest.findOne({DoctorID: req.UserID, PatientID: service.hashElement(req.body.PatientID)}).lean().exec();
    if(!request) {
        let newRequest = new PermissionRequest({
            DoctorID: req.UserID,
            PatientID: service.hashElement(req.body.PatientID),
            Status: "New"
        });
        await newRequest.save(function (error) {
            common(res, error, error, newRequest);
        });
    }
    else
        common(res, null, "Request already exists", null);
});

router.get('/allRequests', async function (req, res) {
    let requests = await PermissionRequest.find({DoctorID: req.UserID}).lean().exec();
    common(res, null, null, requests);
});

module.exports = router;