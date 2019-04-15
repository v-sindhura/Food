var express = require("express"),
    foodapp = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport  =require("passport"),
    LocalStrategy  = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    session = require("express-session");

var is11=false;
var before11=false;
var path = require("path");

foodapp.use(bodyParser.urlencoded({ extended: true }));
foodapp.use(bodyParser.json());
foodapp.use(express.static(__dirname+''))
foodapp.set('view engine','ejs');



var sesionschema= new mongoose.Schema({
    username:String,
    password:String,
    role:String
});
sesionschema.plugin(passportLocalMongoose);
const sesion=mongoose.model("sesion",sesionschema);


var userschema = new mongoose.Schema({
	name:String,
	uname:String,
	email:String,
	mobno:Number,
	pwd:String,
	location:String
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
	d_pwd:String
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

//=======================================================
//This code is script language for providing the routes and actions to be performed in a page

//data bases 
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost:27017/foodApp",{useNewURLParser:true});

//passport
foodapp.use(require("express-session")({
    secret : "This is pretty good for me. Lets do it.",
    resave : false,
    saveUninitialized : false
}));
foodapp.use(passport.initialize());
foodapp.use(passport.session());
passport.use(new LocalStrategy(sesion.authenticate()));
passport.serializeUser(sesion.serializeUser());
passport.deserializeUser(sesion.deserializeUser());

foodapp.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/register");
}


    //Render the home page to the user 
    foodapp.get('/home',function(req,res){
    	res.render('p_home');
    })

    /*Once the user signsup , his details are entered into the database through this route
    and the next page is then rendered*/
    foodapp.post("/user/signupsubmit",function(req,res){
        sesion.find({'username':req.body.username},function(err,existing_users){
            console.log(existing_users);
            if(existing_users.length!=0){
                res.redirect('/user/signup');
            }
            else{
                console.log("hell");
                var a =new user({
                        'username': req.body.username,
                        'email': req.body.email,
                        'mobno': req.body.mobno,
                        'password':req.body.password,
                        'location':req.body.location
                        });
                                    console.log(req.body.username);

                a.save(function(err,users){
                    console.log(users)
                    sesion.register(new sesion({
                        username: req.body.username,
                        role:"user"
                    }),req.body.password,function(err,sesion_res){
                        if(err){
                             console.log(err);
                        }else{
                        console.log(sesion_res);
                        passport.authenticate("local")(req,res,function(){
                            console.log("authenticated")
                                
                        });  
                    }
                })

            })
                res.redirect('/user/custlogin');
        }

    })
    });


foodapp.get('/customer/:username',function(req, res) {
	var username=req.params.username;
	var no = new Date();
    var hours = no.getHours();
    var mins=no.getMinutes();
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
// this function adds a selected item to the cart database
foodapp.post('/customer/cart/:u/:itemid',function(req, res) {
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
        res.redirect('/customer/'+u); 
    });
    }
    else{
        res.redirect('/customer/'+u);
    }
})

//this function removes an item from the cart database
foodapp.post('/customer/cartremove/:u/:cartid',function(req, res) {
    var u=req.params.u;
    var cartid=req.params.cartid;
    cart.remove({username:u,item_id:cartid},function(err,cartr){
    	res.redirect('/customer/cart/'+u);
    });
})

//this function displays the cart page with all its contents
foodapp.get('/customer/cart/:u',function(req,res){
    var u=req.params.u;
    
    cart.find({username:u},function(err, cartr) {
        menu.find({},function(err,menur){
            res.render("v_cart",{u:u, cartr:cartr, menur:menur});  
            }).distinct('item_id');
    
})
})

//this function allows you to update the quantity of an item in the cart
foodapp.post('/customer/cartqtyupdate/:u/:cartid',function(req,res){
    var u=req.params.u;
    var cartid=req.params.cartid;
    var qty=req.body.qty;
    if(qty>=1){
        cart.updateOne({"item_id":cartid},{$set:{quantity:qty}},function(){});
        res.redirect('/customer/cart/'+u);
                                          }
});

//this function adds all the contents of the cart to the order and check database.
foodapp.post('/customer/cartcheckout/:u/:totcost',function(req,res){
    var totcost=req.params.totcost;
    if(totcost>0){
    var u=req.params.u;
    var tot=req.params.totcost;
    var oid;
    if(tot>0){
    order.find({},function(err,orderr){
        oid=orderr.length+1;
        console.log(oid);
        
    var o=new order({
        uname:u,
        o_id:oid,
        o_date:new Date(),
        status:0,
        tot_cost:tot
        
    });
    o.save(function(err,result){
        console.log("Result is:");
        console.log(result);
    });
    });
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
            cart.remove({username:u},function(err,cartres){
            res.redirect('/customer/cart/'+u);
        });
            
    });
        
        
    }
    }
});



//
//sesion.register(new sesion({
//    username:"Sanjita",
//    role:"chef"
//}),"chef1");
//
//
//sesion.register(new sesion({
//    username:"Swathi",
//    role:"chef"
//}),"chef2");
//
//sesion.register(new sesion({
//    username:"Hema",
//    role:"chef"
//}),"chef3");
//
//
//
//sesion.register(new sesion({
//    username:"sindhura",
//    role:"deliveryman"
//}),"sindhura");
//
//
//sesion.register(new sesion({
//    username:"mounika",
//    role:"deliveryman"
//}),"mounika");
//
//sesion.register(new sesion({
//    username:"pranitha",
//    role:"deliveryman"
//}),"pranitha");

 foodapp.get('/user/signup',function(req,res){
         res.render('p_signup');
})


foodapp.get('/user/custlogin',function(req,res){
    res.render("p_login");
 })
    
    
foodapp.post("/user/loginSubmit",passport.authenticate("local",{
    successRedirect : "/check1",
    failureRedirect : "/error",
}),function(req,res){
    console.log("loggedin");
});

foodapp.post("/delivery/deliverysubmit",passport.authenticate("local",{
    successRedirect : "/check2",
    failureRedirect : "/error",
}),function(req,res){
    console.log("loggedin");
});


foodapp.post("/chef/chefsubmit",passport.authenticate("local",{
    successRedirect : "/check3",
    failureRedirect : "/error",
}),function(req,res){
    console.log("loggedin");
});

foodapp.get("/error",function(req,res){
   res.send("error"); 
});


foodapp.get("/check1",function(req,res){
    res.redirect("/customer/"+req.user.username);
})

foodapp.get("/check2",function(req,res){
    res.redirect("/delivery/"+req.user.username);
})

foodapp.get("/check3",function(req,res){
    res.redirect("/chef/"+req.user.username);
})

    
foodapp.get('/deliverylogin',function(req,res){
    res.render('p_delivery');
})


foodapp.get('/cheflogin',function(req,res){
	res.render('p_chef');
})

foodapp.get('/deliveredorders/:dname',function(req,res){
    var dname=req.params.dname;
    var o=[];
    order.find({},function(err,result){
        if(err)throw err;
        //console.log(res);
        for(var i=0;i<result.length;i++){
            if(result[i].status=='2' && result[i].dname==dname){
                o.push(result[i]);
            }
        }
        console.log(o.length);
         res.render("s_orders",{dname:dname,o:o});
    })
    //console.log(o);
   
   
})


var loc=[];
 foodapp.get('/delivery/:dname',function(req,res){
   var dname=req.params.dname;
     var c=0;
     var a1=[];
     var a2=[];
     var a3=[];
     
     var a=0;
     order.find({},function(err, result) {
         //console.log(result);
	if(err) throw err;
        for(var i=0;i<result.length;i++){
            if(result[i].status=='0'){
            }
            else{
                c=c+1;
            }
            
        }
         
        if(c==result.length){  
            
            order.find({},function(err,ordercust){
                    for(var o=0;o<ordercust.length;o++){
                        var use=ordercust[o].uname;
                        console.log(use);
                        user.findOne({username:use},function(err,people){
                            var loca=people.location;
                            if(loca in loc == false){
                                loc.push(loca);
                                console.log("Loca is:"+loc);
                                
                            }

                        })
                    }
            });

            console.log("Final array is:"+loc);
            
            if(dname=="mounika"){
                //console.log(a);
                res.render("s_list",{dname:dname,a:a1});
            }
            else if(dname=="sindhura"){
                  //console.log(loc);
               res.render("s_list",{dname:dname,a:a2}); 
            }
            else{
                res.render("s_list",{dname:dname,a:a3});
            }                 
                }
        
        else{
                res.render("s_main",{dname:dname});
            
        }   
          console.log("Final array is:"+loc);

	//db.close();
})
})
foodapp.get('/delconfirm/:dname/:id',function(req,res){
    var dname=req.params.dname;
    var id=Number(req.params.id);
    //console.log(dname);
    //console.log(id);
    var query={o_id:id};
    var values={$set:{status:"2"}};
    order.updateOne(query,values,{upsert:true},function(err,res){
        if(err) throw err;
    })
    res.redirect('/delivery/'+dname);
     
})






foodapp.set('port',process.env.PORT||8085)
foodapp.listen(foodapp.get('port'),function(){
    console.log(8085);
});

