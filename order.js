var mongoose=require("mongoose");

var orderschema = new mongoose.Schema({
	uname:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"user"
	},
	o_id:Number,
	o_date:String,
	status:String,
	remarks:String,
	tot_cost:Number,
	d_uname:{type:String,default:null}
});

module.exports = mongoose.model("order",orderschema);

