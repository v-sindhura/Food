var express = require("express"),
    foodapp = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport  =require("passport"),
    LocalStrategy  = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash = require('connect-flash'),
    session = require("express-session"),
    cookieParser = require('cookie-parser'),
    time=require('./constants'),
    MinHeap=require('./heap');
var is11=false;
var before11=false;
var path = require("path");
var schedule = require('node-schedule');

var sesion = require("./models/sesion.js");
var check = require("./models/check.js");

var delivery = require("./models/delivery.js");
var order = require("./models/order.js");
var menu = require("./models/menu.js");
var user= require("./models/user.js");
var chef= require("./models/chef.js");
var cart= require("./models/cart.js");
var helmet = require("helmet");
var multer = require("multer");
var methodOverride = require("method-override");
var customerroute= require("./routes/customerroute.js"); 
var chefroute= require("./routes/chefroute.js"); 
var deliveryroute= require("./routes/deliveryroute.js"); 

foodapp.use(bodyParser.urlencoded({ extended: true }));
foodapp.use(bodyParser.json());
foodapp.use(express.static(__dirname+''))
foodapp.use(helmet());
foodapp.use(methodOverride("_method"));
foodapp.use("/customer",customerroute);
foodapp.use("/delivery",deliveryroute);
foodapp.use("/chef",chefroute);
//foodapp.use(foodapp.router);

foodapp.set('view engine','ejs');




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
//for flash messages
//foodapp.use(cookieParser('secret'));
//foodapp.use(session({cookie: { maxAge: 60000 }}));
//foodapp.use(flash());
//
//req.flash('success', 'Item added!!!');
//res.locals.message = req.flash();
foodapp.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
})

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect("/home");
// }


// var myobj = [
//    { item_id:0,item_name: 'Burger',time_prepare:17, item_cost: 400,item_desc:'Yummy Burgers',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShgw4oL21_1VEKvC9EpkLOoTAfCC75iKLvT1zyU7ch8lgpMGf8'},
//    {item_id:1,item_name: 'North Indian Thali',time_prepare:50, item_cost: 200,item_desc:'Yummy food',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8zA8sv1JraxJr8UCyBm8miu9E2vkpTAL5eVHjEtSwxsY23_IX'},
//    { item_name: 'South Indian Thali',time_prepare:50, item_cost: 200,item_desc:'Yummy Thali',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuoBW5wsCRhK4dUQmoM2aa9r82IpSGPJ-4buAAbEckFlj0dO7K',item_id:2},
//    { item_name: 'Pizza', item_cost: 300,time_prepare:20,item_desc:'Yummy Pizzass',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSnqLShVHdHIWTPCMI80qfp8_Pl1Np-uHUnkWASq09QiM3lphn',item_id:3},
//    { item_name: 'Rolls', item_cost: 100,time_prepare:25,item_desc:'Yummy!!',item_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf9C6yeg31pkT8StwFH4INMXp6tG4RlJIngq9dCiUHSAxFk055',item_id:4},
//  ];
  
//  menu.insertMany(myobj, function(err, res) {
//    if (err) throw err;
//    //console.log("Number of documents inserted: " + res.insertedCount);
//  });
 

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
                window.alert("This username already exists!");
            }
            else
            {
                console.log("hell");
                var a =new user({
                        'uname': req.body.username,
                        'email': req.body.email,
                        'mobno': req.body.mobno,
                        'pwd':req.body.password,
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






// sesion.register(new sesion({
//    username:"Sanjita",
//    role:"chef"
// }),"chef1");


// sesion.register(new sesion({
//    username:"Swathi",
//    role:"chef"
// }),"chef2");

// sesion.register(new sesion({
//    username:"Hema",
//    role:"chef"
// }),"chef3");



// sesion.register(new sesion({
//    username:"sindhura",
//    role:"deliveryman"
// }),"sindhura");


// sesion.register(new sesion({
//    username:"mounika",
//    role:"deliveryman"
// }),"mounika");

// sesion.register(new sesion({
//    username:"pranitha",
//    role:"deliveryman"
// }),"pranitha");

 foodapp.get('/user/signup',function(req,res){
         res.render('p_signup');
})


foodapp.get('/user/custlogin',function(req,res){
    res.render("p_login");
 })

 
// foodapp.get('/check',function(req,res){
//     if(req.user.role=="user"){
//         res.redirect('/check1');
//     }
//     else if(req.user.role=="deliveryman"){
//         res.redirect('/check2');
//     }
//     else if(req.user.role=="chef"){
//         res.redirect('/check3');
//     }
// }) 
    
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
   res.send("An error occured"); 
});

//redirect to respective user pages
foodapp.get("/check1",function(req,res){
  res.redirect("/customer/"+req.user.username);
})

foodapp.get("/check2",function(req,res){
    res.redirect("/delivery/"+req.user.username);
})

foodapp.get("/check3",function(req,res){
    //console.log(req.user);
    res.redirect("/chef/"+req.user.username);
})
 

foodapp.get('/deliverylogin',function(req,res){
    res.render('p_delivery');
})


foodapp.get('/cheflogin',function(req,res){
	res.render('p_chef');
})

//logout of session
foodapp.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/home");
 });


foodapp.set('port',process.env.PORT||8085)
foodapp.listen(foodapp.get('port'),function(){
    console.log(8085);
});

