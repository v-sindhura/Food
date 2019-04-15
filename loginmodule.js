//import statements
var express = require("express"),
    foodapp = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport  =require("passport"),
    LocalStrategy  = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    session = require("express-session");


//extensions
foodapp.use(bodyParser.urlencoded({ extended: true }));
foodapp.use(bodyParser.json());
foodapp.use(express.static(__dirname+''))
foodapp.set('view engine','ejs');


//The following schemas are used to enter details of respective users into db
//sesionschema is used to enter details of users who are logged in
var sesionschema= new mongoose.Schema({
    username:String,
    password:String,
    role:String
});
sesionschema.plugin(passportLocalMongoose);
const sesion=mongoose.model("sesion",sesionschema);


//user schema
var userschema = new mongoose.Schema({
	name:String,
	uname:String,
	email:String,
	mobno:Number,
	pwd:String,
	location:String
});
const user= mongoose.model("user",userschema);

//chefschema
//chef schema
var chefschema = new mongoose.Schema({
	c_name:String,
	c_uname:String,
	c_pwd:String
});
const chef= mongoose.model("chef",chefschema);


//deliveryschema
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


//cart schema
var cartschema = new mongoose.Schema({
    username:String,
    item_id:Number,
    quantity:Number
})
const cart= mongoose.model("cart",cartschema);


//Code contains scripting language for providing the routes and actions


//data bases 
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost:27017/foodApp",{useNewURLParser:true});

//passport
//This module is required for enabling sessions fr users , as well as for validation
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

//gives the current users details
foodapp.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
})

/*function to check if current user is logged in 
in order to allow access*/
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/check");
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


/*The following lines are used to manually enters values to the session
collection , when the js file is run. Here, we have been given that the kitchen has 3 deliverymen and chef fixed.
So we assume their accounts to be existing from the beginning and hence enter them into the session once.
After that the lines remain as comments until the sesion collection is dropped , or user logs out*/
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



//render the signup page for customer
foodapp.get('/user/signup',function(req,res){
         res.render('p_signup');
})

//render customer login page
foodapp.get('/user/custlogin',function(req,res){
    res.render("p_login");
 })

//render deliveryman login page
foodapp.get('/deliverylogin',function(req,res){
    res.render('p_delivery');
})

//render chef login page
foodapp.get('/cheflogin',function(req,res){
	res.render('p_chef');
})
    

//customer will be logged into his account if login is successful
foodapp.post("/user/loginSubmit",passport.authenticate("local",{
    successRedirect : "/check1",
    failureRedirect : "/error",
}),function(req,res){
    console.log("loggedin");
});


//deliveryman will be logged into to his account if login successful
foodapp.post("/delivery/deliverysubmit",passport.authenticate("local",{
    successRedirect : "/check2",
    failureRedirect : "/error",
}),function(req,res){
    console.log("loggedin");
});


//chef will be logged into his account after successful login
foodapp.post("/chef/chefsubmit",passport.authenticate("local",{
    successRedirect : "/check3",
    failureRedirect : "/error",
}),function(req,res){
    console.log("loggedin");
});


foodapp.get("/error",function(req,res){
   res.send("error"); 
});

//after logging in, redirect to respective pages
/*the format of /check function has to be checked and 
debugged . As of now we have directed the pages separately*/
foodapp.get("/check",function(req,res){
	var checking= req.user.role;
	if(checking=="user")
	{
		res.redirect("/check1");
	}
	if(checking=="deliveryman")
	{
		res.redirect("/check2");
	}
	if(checking=="chef")
	{
		res.redirect("/check3");
	}
})

//redirect to respective user pages
foodapp.get("/check1",function(req,res){
    res.redirect("/customer/"+req.user.username);
})

foodapp.get("/check2",function(req,res){
    res.redirect("/delivery/"+req.user.username);
})

foodapp.get("/check3",function(req,res){
    res.redirect("/chef/"+req.user.username);
})
 

//logs out of users account when he clicks logout button
app.get("/logout",function(req, res) {
   req.logout();
   res.redirect("/home");
});


//set port for localhost
foodapp.set('port',process.env.PORT||8085)
foodapp.listen(foodapp.get('port'),function(){
    console.log(8085);
});


/*The isLoggedIn function and Logout function for session
management will be included in the rendering function for the cart , menu ,
delivery and orders pages */

/*When the user logs out of his account (code written in others parts) , 
the logout function for sesion will be called */
   





