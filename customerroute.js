var express = require("express");
var bodyParser = require("body-parser");
var foodap = express.Router();
var is11=false;
var before11=false;
var path = require("path");

var check=require("../models/check.js");
var menu=require("../models/menu.js");
var order=require("../models/order.js");
var cart=require("../models/cart.js");
var middleware = require("../middleware");
var {isLoggedIn} = middleware;

var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost:27017/foodApp",{useNewURLParser:true});



//Checks the time constraints on the user page and redirects the user to the homepage
//Homepage displays an assortment of menu items
foodap.get('/:username',isLoggedIn,function(req, res) {
	var username=req.params.username;
    //To get the current date coordinates
	var no = new Date();
    var hours = no.getHours();
    var mins=no.getMinutes();
    //To check if it is before 11 so that the customers can view the homepage
    if(hours<24)
      before11=true;
    else
      before11=false;
    cart.find({},function(err,cartr){
    menu.find({},function(err, menur) {
        console.log(menur);
         
            res.render("v_mainpage",{u:username,menur:menur,before11:before11,cartr:cartr});  
           }).distinct('item_name');
    
    })
})


// adds an item selected by the customer into the cart database 
foodap.post('/cart/:u/:itemid',function(req, res) {
    var u=req.params.u;
    var qty=req.body.qty;
    var itemid=req.params.itemid;
    //Item added to cart only if quantity is greater than or equal to 1
    if(qty>=1){
        var c=new cart({
            username: u, 
            item_id:itemid,
            quantity:qty
        });
    c.save(function(err,result){
        res.redirect('/customer/'+u); 
    });
    }
    else{
        res.redirect('/customer/'+u);
    }
})

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect("/home");
// }

//Allows a user to remove an item feom the cart,i.e, the cart database
foodap.post('/cartremove/:u/:cartid',function(req, res) {
    var u=req.params.u;
    var cartid=req.params.cartid;
    //Find the cart item selected by the customer and removing it
    cart.remove({username:u,item_id:cartid},function(err,cartr){
    	res.redirect('/customer/cart/'+u);
    });
})

/**Redirects the customer to his/her cart and provides them with various options to fiddle with the cart such as remove items, update quantity,check out, etc.*/
foodap.get('/cart/:u',isLoggedIn,function(req,res){
    var u=req.params.u;
    
    //Displaying the cart items
    cart.find({username:u},function(err, cartr) {
        menu.find({},function(err,menur){
            res.render("v_cart",{u:u, cartr:cartr, menur:menur});  
            }).distinct('item_id');
    
})
})

//Allows the customer to update the quantity of an item in the cart database
foodap.post('/cartqtyupdate/:u/:cartid',function(req,res){
    var u=req.params.u;
    var cartid=req.params.cartid;
    
    var qty=req.body.qty;
    //Check if Quantity of item is greater than or equal to 1
    if(qty>=1){
        cart.updateOne({"item_id":cartid},{$set:{quantity:qty}},function(){});
        res.redirect('/customer/cart/'+u);
                                          }
});

/*Allows the user to place an order and does the insertion into the order databse and the check database */
foodap.post('/cartcheckout/:u/:totcost',function(req,res){
    console.log("hello");
    var u=req.params.u;
    var tot=req.params.totcost;
    var oid;
    if(tot>0){
    order.find({},function(err,orderr){
        oid=orderr.length+1;
        console.log(oid);
    //Creating an order object   
    var o=new order({
        uname:u,
        o_id:oid,
        o_date:new Date(),
        status:0,
        tot_cost:tot
        
    });
        //Saving the order object into the orders schema
    o.save(function(err,result){
        console.log("Result is:");
        console.log(result);
    });
    });
        
        //Inserting order items into the check schema
        cart.find({username:u},function(err,cartr){
            console.log("The cart is:");
            console.log(cartr);
            for(var m=0;m<cartr.length;m++){
                console.log(cartr[m]);
                    var chk=new check({
                        o_id:oid,
                        item:cartr[m].item_id,
                        status:0,
                        chef:"Null",
                        quantity:cartr[m].quantity
                    });
                    chk.save(function(err,checksresult){
                        console.log("check inseted:");
                        console.log(checksresult);
                    });
            }
            
            //Removing ordered items from the cart
            cart.remove({username:u},function(err,cartres){
            res.redirect('/customer/cart/'+u);
        });
            
    });
        
        
    }
});
module.exports = foodap;

