
var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose")

var chefschema = new mongoose.Schema({
    c_uname:String,
    c_pwd:String
});


module.exports = mongoose.model("chef",chefschema);
