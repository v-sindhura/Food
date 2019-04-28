var mongoose=require("mongoose");

var cartschema = new mongoose.Schema({
    username:String,
    item_id:Number,
    quantity:Number
});

module.exports = mongoose.model("cart",cartschema);
