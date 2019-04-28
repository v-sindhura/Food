var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose")

var sesionschema= new mongoose.Schema({
    username:String,
    password:String,
    role:String
});

sesionschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("sesion",sesionschema);

