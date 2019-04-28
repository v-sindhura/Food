var mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose")

var deliveryschema = new mongoose.Schema({

    d_uname:String,
    d_mobno:Number,
    d_pwd:String

});



module.exports = mongoose.model("delivery",deliveryschema);


