var mongoose=require("mongoose");

var menuschema = new mongoose.Schema({
	item_id:Number,
	item_name:String,
	item_cost:Number,
	item_desc:String,
	item_url:String,
	time_prepare:Number
});

module.exports = mongoose.model("menu",menuschema);

