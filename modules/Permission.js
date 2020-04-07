var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;

var PermissionSchema = new Schema({
    DoctorID: String,
    PatientID: String
});



//create models
var Permission = module.exports = mongoose.model('Permission', PermissionSchema, 'Permission');


module.exports.getOnePermission = function(doctorID, patientID, callback){
    var query = {DoctorID: doctorID, PatientID: patientID};
    Permission.findOne(query, callback);
};

module.exports.getAllDoctorPermission= function(doctorID, callback){
    Permission.find({DoctorID: doctorID}, callback);
};