var mongoose=require("mongoose");

var checkschema = new mongoose.Schema({
    o_id:Number,
    item:Number,
    status:String,
    chef:String,
    quantity:String
})

module.exports = mongoose.model("check",checkschema);

