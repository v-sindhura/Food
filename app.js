var express = require("express");
var bodyParser = require("body-parser");
var foodapp = express();
var is11=false;
var before11=false;
var path = require("path");
//Here we are configuring express to use body-parser as middle-ware.
foodapp.use(bodyParser.urlencoded({ extended: true }));
foodapp.use(bodyParser.json());
foodapp.use(express.static(__dirname+''))
foodapp.set('view engine','ejs');

//data bases 
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost:27017/foodApp",{useNewURLParser:true});
///////////////////////////////////////////////////////////////////////////////////vijaya
// //to get current time////////
// var now = new Date();
//   var hour = now.getHours();
//   var min=now.getMinutes();
//   if(hour>5||hour==5&&min>=30)
//     is11=true;
//////////////////////////////////////////////////////////////////////////////////////////

//user schema
var userschema = new mongoose.Schema({
	name:String,
	uname:String,
	email:String,
	mobno:Number,
	pwd:String,
	loc:Number
});
const user= mongoose.model("user",userschema);




//chef schema
var chefschema = new mongoose.Schema({
	c_name:String,
	c_uname:String,
	c_pwd:String
});
const chef= mongoose.model("chef",chefschema);




//delivery schema
var deliveryschema = new mongoose.Schema({
	d_name:String,
	d_uname:String,
	d_mobno:Number,
	d_pwd:String,
	loc:String
});
const delivery= mongoose.model("delivery",deliveryschema);





//menu schema
var menuschema = new mongoose.Schema({
	item_id:Number,
	item_name:String,
	item_cost:Number,
	item_desc:String,
	item_url:String
});
const menu= mongoose.model("menu",menuschema);





//orders schema
var orderschema = new mongoose.Schema({
	uname:String,
	o_id:Number,
	o_date:String,
	status:String,
	remarks:String,
	tot_cost:Number
});
const order= mongoose.model("order",orderschema);




//check schema
var checkschema = new mongoose.Schema({
    o_id:Number,
    item:Number,
    status:Number,
    chef:String,
    quantity:String
})
const check= mongoose.model("check",checkschema);

var cartschema = new mongoose.Schema({
    username:String,
    item_id:Number,
    quantity:Number
})
const cart= mongoose.model("cart",cartschema);


//first page- p_homepage
foodapp.get('/',function(req,res){
	res.render("p_home.ejs");
});

/*var myobj = [
    { item_id:1,item_name: 'Burger', item_cost: 400,item_desc:'Yummy Burgers',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShgw4oL21_1VEKvC9EpkLOoTAfCC75iKLvT1zyU7ch8lgpMGf8'},
    {item_id:2,item_name: 'North Indian Thali', item_cost: 200,item_desc:'Yummy food',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8zA8sv1JraxJr8UCyBm8miu9E2vkpTAL5eVHjEtSwxsY23_IX'},
    { item_name: 'South Indian Thali', item_cost: 200,item_desc:'Yummy Thali',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuoBW5wsCRhK4dUQmoM2aa9r82IpSGPJ-4buAAbEckFlj0dO7K',item_id:3},
    { item_name: 'Pizza', item_cost: 300,item_desc:'Yummy Pizzass',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSnqLShVHdHIWTPCMI80qfp8_Pl1Np-uHUnkWASq09QiM3lphn',item_id:4},
    { item_name: 'Rolls', item_cost: 100,item_desc:'Yummy!!',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf9C6yeg31pkT8StwFH4INMXp6tG4RlJIngq9dCiUHSAxFk055',item_id:5},
  ];
   
  menu.insertMany(myobj, function(err, res) {
    if (err) throw err;
    //console.log("Number of documents inserted: " + res.insertedCount);
  });
*/
//signup page for customer
foodapp.post('/signup',function(req,res){
    //validation code
    //if valid
	res.render(__dirname+'p_signup');
})

//login page for customer
foodapp.get('/custlogin',function(req,res){
	res.render(__dirname+'p_login');
})

//customer homepage
foodapp.get('/customer/:username',function(req, res) {
	var username=req.params.username;
	var no = new Date();
    var hours = no.getHours();
    var mins=no.getMinutes();
    if(hours<24)
      before11=true;
    else
      before11=false;
    
    menu.find({},function(err, menur) {
        console.log(menur);
         
            res.render("v_mainpage",{u:username,menur:menur,before11:before11});  
           }).distinct('item_name');
    
    
})

foodapp.post('/cart/:u/:itemid',function(req, res) {
    var u=req.params.u;
    var qty=req.body.qty;
    var itemid=req.params.itemid;
    if(qty>=1){
        var c=new cart({
            username: u, 
            item_id:itemid,
            quantity:qty
        });
    c.save(function(err,result){
        res.redirect('/cart/'+u); 
    });
    }
    else{
        res.redirect('/customer/'+u);
    }
})

foodapp.get('/cart/:u',function(req,res){
    var u=req.params.u;
    cart.find({username:u},function(err, cartr) {
            res.render("v_cart",{u:u, cartr:cartr});  
            }).distinct('item_id');
    
})


foodapp.get('/deliveredorders/:dname',function(req,res){
    var dname=req.params.dname;
    res.render("s_orders",{dname:dname});
})
foodapp.get('/delivery/:dname',function(req,res){
    var dname=req.params.dname;
    var c=0;
    order.find({},function(err,result){
        console.log(result);
        for(var i=0;i<result.length;i++){
            if(result[i].status=='0'){
            }
            else{
                c=c+1;
            }
            
        }
        if(c==result.length){
                    res.render("s_list",{dname:dname});
                }
        else{
                res.render("s_main",{dname:dname});
            
        }        
    })
    
})

//////////////////////////////////////////////////////////////vijaya
//chef home page
foodapp.get('/chef/:u',function(req, res) {
    var user=req.params.u;
var now = new Date();
  var hour = now.getHours();
  var min=now.getMinutes();
  if(hour>5||hour==5&&min>=30)
    is11=true;
  else
    is11=false;
    check.find({'status':0},function(err,checkres){
        menu.find({},function(err, menures) {
            res.render("chef_home",{u:user,menures:menures,checkres:checkres,is11:is11});  
            })
    })
})

//chef myorders page
foodapp.get('/chef/myorders/:u',function(req, res) {
    
    var user=req.params.u;
    var now = new Date();
    var hour = now.getHours();
    var min=now.getMinutes();
    if(hour>5||hour==5&&min>=30)
        is11=true;
    else
        is11=false;
    check.find({'status':1,'chef':user},function(err,myres){
        menu.find({},function(err, menures) {
            res.render("chef_myorders",{u:user,menures:menures,myres:myres,is11:is11});  
            })
    })
})

//when chef chooses them item to cook
foodapp.get('/cheforder/:a/:b',function(req, res) {
    var u=req.params.a,id=req.params.b;
    check.find({'_id':id},function(err, r) {
        if(r[0].status=="0"){
        check.updateOne({_id:id},{$set:{status:1}},{},function(){});
        check.updateOne({_id:id},{$set:{chef:u}},{},function(){});
        res.redirect('/chef/'+u);
        }
        else{
            res.send("This order is already taken");
        }
    })
    
})
//when chef chooses them cooks the particular item
foodapp.get('/chefconfirm/:a/:b',function(req, res) {
    var u=req.params.a,id=req.params.b,f=1;
    check.update({_id:id},{$set:{status:2}},{},function(){});
    check.find({'_id':id},function(err, rese) {
        console.log(rese);
        var p=rese[0];
        check.find({'o_id':p.o_id},function(err, q) {
            for(var i=0;i<q.length;i++){
                if(q[i].status!=2){
                    f=0;
                }
            }
            if(f==1){
                order.update({'o_id':p.o_id},{$set:{status:1}},{},function(){});
            }
            res.redirect('/chef/myorders'+u);
    
        });
    });
})

/////////////////////////////////////////////////////////////////////////--finish
//listen
foodapp.set('port',process.env.PORT||8080)
foodapp.listen(foodapp.get('port'),function(){
    console.log(8080);
})













