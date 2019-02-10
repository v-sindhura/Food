var express = require("express");
var bodyParser = require("body-Parser");
var foodapp = express();

foodapp.use(bodyParser.urlencoded({extended:fales}));
foodapp.use(bodyParser.json());
foodapp.use(express.static(__dirname+""));
foodapp.set('view engine','ejs');



//data bases 
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost:27017",{useNewURLParser:true});

//user schema
var userschema = new mongoose.Schema({
	name:String,
	uname:String,
	email:String,
	mobno:Number,
	pwd:String,
	loc:String
})
const user= mongoose.model("user",userschema);




//chef schema
var chefschema = new mongoose.Schema({
	c_name:String,
	c_uname:String,
	c_pwd:String
})
const chef= mongoose.model("chef",chefschema);




//delivery schema
var deliveryschema = new mongoose.Schema({
	d_name:String,
	d_uname:String,
	d_mobno:Number,
	d_pwd:String,
	loc:String
})
const delivery= mongoose.model("delivery",deliveryschema);





//menu schema
var menuschema = new mongoose.Schema({
	item_id:String,
	item_name:String,
	item_cost:Number,
	item_desc:String,
	item_url:String
})
const menu= mongoose.model("menu",menuschema);





//orders schema
var ordersschema = new mongoose.Schema({
	uname:String,
	d_id:String,
	d_date:String,
	item_id[]:String,
	status[]:String,
	quantity[]:Number,
	remarks:String,
	c_name[]:String
})
const orders= mongoose.model("orders",ordersschema);



//first page- p_homepage
app.get('/',function(req,res){
	res.sendFile(__dirname+'home.html');
});


//signup page for customer
app.post('/signup',function(req,res){
	res.render(__dirname+'signup.html');
})















