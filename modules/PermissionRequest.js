var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PermissionRequestSchema = new Schema({
    DoctorID: String,
    PatientID: String,
    Status: String
});


//create models
var PermissionRequest = module.exports = mongoose.model('PermissionRequest', PermissionRequestSchema, 'PermissionRequest');





