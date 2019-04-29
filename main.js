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
    MinHeap=require('./heaps');
var is11=false;
var before11=false;
var path = require("path");
var schedule = require('node-schedule');
var locations=["Accenture","Wipro","TCS","IBM","Cognizant","Capgemini","Oracle","Cisco","Mindtree","HCL","Mu Sigma","Amazon","Dell","HP","TechMahindra","Sap","Samsung","Honeywell","Robert Bosch","Thomson Reuters","CGI","Mphasis","EY","Deloitte","Nokia","Intel","Huwaei","Goldman Sachs","Flipkart","Infosys"];

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
	uname:String,
	email:String,
	mobno:Number,
	pwd:String,
	location:String
});
const user= mongoose.model("user",userschema);




//chef schema
var chefschema = new mongoose.Schema({
	c_uname:String,
	c_pwd:String
});
const chef= mongoose.model("chef",chefschema);




//delivery schema
var deliveryschema = new mongoose.Schema({
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
	item_url:String,
	time_prepare:Number
});
const menu= mongoose.model("menu",menuschema);





//orders schema
var orderschema = new mongoose.Schema({
	u_name:{
           type : mongoose.Schema.Types.ObjectId,
           ref : "user"
       },
    uname:String,
	o_id:Number,
	o_date:String,
	status:String,
	remarks:String,
	tot_cost:Number,
    d_uname:{type:String, default:null}
});
const order= mongoose.model("order",orderschema);




//check schema
var checkschema = new mongoose.Schema({
    uname:String,
    o_id:Number,
    item:Number,
    status:String,
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

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/home");
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
    var no = new Date();
    var hours = no.getHours();
    var mins=no.getMinutes();
    if(hours<24)
        before11=true;
    else
        before11=false;
    if(before11){
        cart.find({username:u},function(err, cartr) {
            menu.find({},function(err,menur){
                res.render("v_cart",{u:u, cartr:cartr, menur:menur});  
            }).distinct('item_id');

        })
    }
    else{
        res.redirect('/customer/'+u);
    }
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
	user.find({uname:u},function(err,currentuser){
                var o=new order({
                    u_name:currentuser[0],
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


        })
    }
}
});
            
//Displays all past orders and cancelled orders
foodapp.get('/customer/:u/pastorders',function(req,res){
    var u=req.params.u;
    var now=new Date();
    order.find({uname:u,$or:[{ status: { $eq: 3 }},{ status: { $eq: -1 }}]},function(err,orderr){
        res.render("v_orders",{u:u,orderr:orderr});
    })
})

//Displays all upcoming orders
foodapp.get('/customer/:u/uporders',function(req,res){
    var u=req.params.u;
    var now=new Date();
    order.find({uname:u,$or:[{ status: { $eq: 0 }},{ status: { $eq: 1 }},{ status: { $eq: 2 }}]},function(err,orderr){
        res.render("v_orders",{u:u,orderr:orderr});
    })
})

//Displays the profile of the user
foodapp.get('/customer/:u/profile',function(req,res){
    var u=req.params.u;
    user.find({uname:u},function(err,userr){
        res.render("customer_profile",{u:u,userr:userr,locations:locations});
    })
})

var arr=[];
//Implements the KMP algorithm and compares search text with menu items
foodapp.post('/customer/:u/search',function(req,res){
    arr=[];
    var u=req.params.u;
    var pat=req.body.search;
    pat=pat.toLowerCase();
    var m=pat.length;
    var txt;
    var lps=[0];
    var j=0;
    var found=0;
    function computeLPS(pat,m,lps){
        var len=0;
        var i=1;
        lps[0]=0;
        while(i<m){
            if(pat.charAt(i)==pat.charAt(len)){
                len++;
                lps[i]=len;
                i++;
            }
            else{
                if(len!=0){
                    len=lps[len-1];
                }
                else{
                    lps[i]=len;
                    i++;
                }
            }
        }
    }

    computeLPS(pat,m,lps);
    function computeKMP(pat,txt){
        var n=txt.length;
        var i = 0;
        while (i < n) { 
            if (pat.charAt(j) == txt.charAt(i)) { 
                j++; 
                i++; 
            } 
            if (j == m) { 
                found=1;
                j = lps[j-1]; 
            }  
            else if (i<n && pat.charAt(j)!=txt.charAt(i)) { 
                if (j != 0) 
                    j = lps[j - 1]; 
                else
                    i = i + 1; 
            } 
        } 
    }


    menu.find({},function(err,menur){
        for(var k=0;k<menur.length;k++){
            found=0;
            txt=menur[k].item_name;
            txt=txt.toLowerCase();
            computeKMP(pat,txt);
            if(found==1){
                arr.push(k);
            }

        }
        res.redirect('/customer/'+u+'/searchresults');
    })
})

//page showing the results of the search
foodapp.get('/customer/:u/searchresults',function(req,res){
    console.log(arr);
    var u=req.params.u;
    menu.find({},function(err,menur){
        cart.find({username:u},function(err,cartr){
            res.render("searchresults",{arr:arr,u:u,menur:menur,cartr:cartr});
        })
    })
})

//Page to cancel the orders
foodapp.post('/customer/:u/cancelorder/:orderid',function(req,res){
    var u=req.params.u;
    var oid=req.params.orderid;
    console.log(oid);
    order.updateOne({o_id:oid},{$set:{status:"-1"}},function(err,orderr){
        check.update({o_id:oid},{$set:{status:"-1"}});
        res.redirect('/customer/'+u+'/uporders');
    })
    
})




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
    failureRedirect : "/user/signup",
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
//======================================================================================================chef part
/*to check whether time is greater than 11 or not*/
function check_time_eligibilty(){
    //current time in utc Date Format
    var now = new Date()
    //to get hours
    var hour = now.getHours();
    //to get minutes;                      
    var min = now.getMinutes();                  
    //to check whether time>5:30 am or not 11:00 am in itc is equal to 5:30 in utc
    return(hour>time[0] || hour==time[0] && min>=time[1]);         
}

/* shows chef's home page, where after 11'O clock all the orders for today are present whereas 
everyday before 11'O clock there will be no orders available*/
var order_success_msg=0;
foodapp.get('/chef/:username',isLoggedIn,function(req, res) {
    var username = req.params.username;
    //is11 is true if time is after 11:00 am or else it is false
    var istime11 = check_time_eligibilty();                
    //Find all the items in orders database and see the items which are not taken by any chefs                                            
    check.find({status:"0"},function(err,checkresult){
        if(!err){
            menu.find({},function(err, menuresult) { 
                if(!err){
                    //to get details like Picture,Name of the items 
                    res.render("chef_home",{username:username,menuresult:menuresult,checkresult:checkresult,istime11:true,msg:order_success_msg});
                    order_success_msg=0;
                }
            })
        }
    })
})

//chef myorders page which contains the items that chef is cooking for today
var cooked_msg=0
foodapp.get('/chef/myorders/:username',isLoggedIn,function(req, res) {
    var username = req.params.username;
    //to get the items that are currently cooked by the chef
    check.find({status:"1",chef:username},function(err, myresult){    
        if(!err){
            menu.find({},function(err, menuresult) {
                if(!err){
                   //to check whether the time is > 11:00Am or not
                    var istime11=check_time_eligibilty();                        
                    res.render("chef_myorders",{username:username,menuresult:menuresult,myresult:myresult,istime11:true,msg:cooked_msg}); 
                    cooked_msg=0;
                }
            })
        }
    })
})

//when chef chooses the item to cook
foodapp.post('/chef/order/:username/:itemid',isLoggedIn,function(req, res) {
    var username = req.params.username,
        itemid = req.params.itemid;
    check.findOne({_id:itemid},function(err, checkres) {
        //To check for Race Condition 
        if(!err){
            if(checkres.status == "0"){
                check.updateOne({_id:itemid},{$set:{status:"1",chef:username}},{},function(){
                    order_success_msg=1;
                    res.redirect('/chef/' + username);
                });
            }
            else{  
                //In race Condition, Suppose the Item is already taken
                order_success_msg=2;
                res.redirect('/chef/' + username);
            }
        }
    })
    
})
/*  when chef cooked the item change the item status to 2
    if all the items in the order are cooked then change the order status to 1
*/
foodapp.post('/chef/confirm/:username/:itemid',isLoggedIn,function(req, res) {
    var username = req.params.username,
        itemid = req.params.itemid;
    check.updateOne({_id:itemid},{$set:{status:"2"}},function(){   //update the item status to 2
       check.findOne({_id:itemid},function(err, res_item) {
           if(!err){    
                //order id of the item
                var temp = res_item.o_id;
                //all items in the order
                check.find({o_id:temp},function(err,res_order ) {      
                    if(!err){ 
                        cooked_msg=1;
                        //get cooked items in the orders
                        check.find({o_id:temp,status:"2"},function(err,res_cooked) { 
                            if(!err){   
                                //check if all items are cooked
                                if(res_order.length == res_cooked.length){
                                    order.updateOne({o_id:temp},{status:"1"},function(){ 
                                        res.redirect('/chef/myorders/' + username); //go back to my_orders page
                                    });    
                                }
                                else{
                                    res.redirect('/chef/myorders/' + username); //go back to the my_orders page
                                }
                            }
                        });
                    }
                });
           }
        }); 
    });
});
/*This function runs daily at 11:20am to check whether there are any items left out
  If there are items left out then it assigns those items to chefs randomly*/ 
var job = schedule.scheduleJob('34 4 * * *', function() {
    console.log("hello")
    check.find({status:"0"},function(err,left_orders) {
        if(!err && left_orders.length!=0){
                chef.find({},function(err, chefs) {
                    menu.find({},function(err, menu_result) {
                        check.find({status:"1"},function(err,cooking_items) {
                            var minHeap=new MinHeap();
                            chefs.forEach(function(current_chef){
                                var time_cooked=0;
                                cooking_items.forEach(function(current_item){
                                    if(current_chef.c_uname == current_item.chef) {
                                        time_cooked += menu_result[current_item.item].time_prepare * current_item.quantity;
                                    }    
                                })
                                minHeap.insert(time_cooked,current_chef.c_uname)
                            })
                            minHeap.display()
                            left_orders.forEach(function(present_item){
                                var currentchef=minHeap.extractMin();
                                var time_item=menu_result[present_item.item].time_prepare * Number(present_item.quantity);
                                //console.log("id is",present_item._id)
                                check.updateOne({_id:present_item._id},{status:'1',chef:currentchef[1]},function(){
                                });
                                console.log("c is",currentchef[0]+time_item,currentchef[1])
                                minHeap.insert(currentchef[0]+time_item,currentchef[1]);
                            })
                        })
                        
                        
                   })
                    
            })
            
            
        }
    })
    
            
});


class Graph{
    constructor(noOfVertices){
        this.noOfVertices=noOfVertices;
        this.AdjList=new Map();
    }
    addVertex(v){
        this.AdjList.set(v,[]);
    }
    addEdge(v,w,n){
        this.AdjList.get(v).push([w,n]); 
        this.AdjList.get(w).push([v,n]);
    }
    printGraph(){ 
        //console.log(this.AdjList);
        var get_keys = this.AdjList.keys(); 
        // iterate over the vertices 
        for (var i of get_keys){ 
                var get_values = this.AdjList.get(i); 
               
                var conc = ""; 
                for (var j of get_values) 
                    conc += j + " "; 
                // print the vertex and its adjacency list 
                //console.log(i + " -> " + conc); 
            } 
    }
    floydWarshallAlgorithm(){
       let dist = {};
       for (var [key, value] of this.AdjList){
        dist[key]={};
           var a=key;
        value.forEach(function(l){            
            dist[key][l[0]]=l[1];    
        });
       for(var [key, value] of this.AdjList){
            if(dist[a][key]==undefined){
                dist[a][key]=Infinity;
            }
            if(a==key){
                dist[key][key]=0;
            }
        }
       }
        for(var [key1,val1] of this.AdjList){
            for(var [key2,val2] of this.AdjList){
                for(var [key3,val3] of this.AdjList){
                    if(dist[key1][key3]+dist[key3][key2]<dist[key1][key2]){
                        dist[key1][key2]=dist[key1][key3]+dist[key3][key2];
                    }
                }
            }
        }
        console.log(dist);
        return dist;    
    }
}
var g = new Graph(30); 
var vertices = [ '0', '1','2', '3', '4' ,'5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];
for (var i = 0; i < vertices.length; i++){ 
    g.addVertex(vertices[i]); 
} 
// adding edges 
g.addEdge('0', '1',10); 
g.addEdge('0', '2',11);
g.addEdge('0', '3',12); 
g.addEdge('0', '4',13);
g.addEdge('0', '5',15);
g.addEdge('0', '6',7);
g.addEdge('0', '7',25);
g.addEdge('0', '8',8);
g.addEdge('0', '9',10);
g.addEdge('0', '10',13);
g.addEdge('0', '11',4);
g.addEdge('0', '12',8);
g.addEdge('0', '13',12);
g.addEdge('0', '14',20);
g.addEdge('0', '15',13);
g.addEdge('0', '16',13);
g.addEdge('0', '17',4);
g.addEdge('0', '18',14);
g.addEdge('0', '19',6);
g.addEdge('0', '20',10);
g.addEdge('0', '21',11);
g.addEdge('0', '22',9);
g.addEdge('0', '23',13);
g.addEdge('0', '24',25);
g.addEdge('0', '25',17);
g.addEdge('0', '26',19);
g.addEdge('0', '27',21);
g.addEdge('0', '28',25);
g.addEdge('0', '29',17);
g.addEdge('0', '30',16);

g.addEdge('1', '2',3); 
g.addEdge('3', '4',4); 
g.addEdge('4', '5',5); 
g.addEdge('4', '2',6); 
g.addEdge('2', '5',7); 

g.addEdge('6', '8',7);
g.addEdge('7', '10',12);
g.addEdge('8', '9',15);
g.addEdge('4', '9',3);
g.addEdge('3', '6',17);
g.addEdge('1', '8',23);

g.addEdge('10', '11',7);
g.addEdge('11', '14',4);
g.addEdge('12', '16',3);
g.addEdge('13', '19',1);
g.addEdge('14', '18',17);
g.addEdge('15', '12',13);
g.addEdge('16', '18',5);
g.addEdge('17', '12',15);
g.addEdge('18', '8',13);
g.addEdge('19', '10',7);
g.addEdge('1', '18',12);
g.addEdge('6', '15',4);
g.addEdge('3', '14',5);
g.addEdge('7', '20',12);
g.addEdge('2', '18',3);

g.addEdge('20', '22',3);
g.addEdge('21', '28',3);
g.addEdge('22', '26',3);
g.addEdge('23', '24',3);
g.addEdge('24', '29',3);
g.addEdge('25', '30',3);
g.addEdge('26', '7',3);
g.addEdge('27', '8',3);
g.addEdge('28', '12',3);
g.addEdge('29', '30',3);
g.addEdge('30', '18',3);
g.addEdge('12', '19',3);
g.addEdge('3', '25',3);
g.addEdge('7', '18',3);
g.addEdge('17', '22',3);
g.addEdge('11', '25',3);

g.printGraph();
floyd=g.floydWarshallAlgorithm();
//console.log(floyd);
kitchen=floyd['0'];

function calpath(floyd,loc){
    var node='0';
    var index=0;
    deliveryman1={}
    deliveryman2={}
    deliveryman3={}
    //console.log("locations ",loc);
    //console.log(floyd[node]);
    var finalpath={};
    var totaldist=0;
    var mindex;
    while(loc.length!=1){
        childlist=[]
        loc.splice(index,1);
        min=Infinity;
        for(var key in floyd[node]){
            //console.log("key is",key)
            //console.log("locations ",loc);             
            for ( var l in loc){                              
                if(loc[l]==key){
                    if (floyd[node][key]<min){
                        //console.log(floyd[node][key])
                        min=floyd[node][key];
                        mindex=key;
                        index=l;
                    }
                }
            }      
        }
        finalpath[node]=[mindex,floyd[node][mindex]];
        totaldist+=floyd[node][mindex];
        console.log(node,mindex,floyd[node][mindex]);
        node=mindex;    
    }
    //console.log(finalpath);
    //console.log(finalpath['0'][0]);
    console.log(totaldist);
    avg=totaldist/3+10;
    key='0';
    sum1=0;
    sum2=0;
    sum3=0;
    d1flag=0;
    d2flag=0;
    flag1=0;
    flag2=0;
    while(key in finalpath!=false ){
        if(sum1+finalpath[key][1]<=avg){
            if(d1flag==0){
                //console.log("sum1=",key);
                sum1=sum1+finalpath[key][1];
                deliveryman1[key]=[finalpath[key][0],finalpath[key][1]];
            }
        }
        else if (sum2+finalpath[key][1]<=avg){
            //console.log("sum 2",key);
            if(d2flag==0){
                if(flag1==0){
                   sum2=kitchen[key];
                    flag1=1;
                    d1flag=1;
                    deliveryman2['0']=[finalpath[key][0],finalpath[key][1]];
                }            
                
               else if(sum2<=avg){
                    sum2=sum2+finalpath[key][1];
                    deliveryman2[key]=[finalpath[key][0],finalpath[key][1]];
                } 
            }
        }
        else{
            //console.log("sum3",key);
            if(flag2==0){
               sum3=kitchen[key];
                flag2=1;
                d2flag=1;
                deliveryman3['0']=[key,kitchen[key]];
            }  
            sum3=sum3+finalpath[key][1];
            deliveryman3[key]=[finalpath[key][0],finalpath[key][1]];
            

        }
        key=finalpath[key][0];        
    }
    console.log("first delivery man ",deliveryman1,sum1);
    console.log("second delivery man ",deliveryman2,sum2);
    console.log("third delivery man ",deliveryman3,sum3);
    
    return [deliveryman1,deliveryman2,deliveryman3];
}

var dpath=[];

foodapp.get('/delivery/:dname',function(req,res){
     
var loc=['0'];
    
   var dname=req.params.dname;
     var c=0;     
     var a=0;
    var deliverymen=[];
     order.find({status:"0"},function(err, result) {
         //console.log(result);
	if(err) throw err;
         if(result.length!=0)
             {
                 res.render("s_main",{dname:dname});
             }
         
         else{
             order.find({status:"2"},function(err,stat){
                 if(stat.length==0){
                     order.find({status:"1"}).populate("u_name").exec(function(err,ordercust){
                    for(var i=0;i<ordercust.length;i++){
                        loc.push(ordercust[i].u_name.location)
                    }
                    var uniqueloc = new Set(loc);
                    loc = Array.from(uniqueloc);
                    //console.log("unique locations:",loc);
                    dpath = calpath(floyd,loc);
                         var current_flag=0;
                    delivery.find({},function(err,dnames){
                        for(var i=0;i<dnames.length;i++){
                                var key='0';
                                if(Object.keys(dpath[i]).length!=0){
                                    while(key in dpath[i]!=false){                                    
                                        var deliverylocation=dpath[i][key][0];
                                        //console.log("del is"+deliverylocation);
                                        for(var k=0;k<ordercust.length;k++){
                                                //order.update({_id:ordercust[k]},{$set:{status:"2",d_uname:dname}});
                                                if(ordercust[k].u_name.location==deliverylocation){
                                                    var orderid=ordercust[k].o_id;
                                                    order.update({_id:ordercust[k]._id},{$set:{status:"2",d_uname:dnames[i].d_uname}},{upsert:true},function(err,resu){});
                                                
                                                }
                                               
                                            
                                        }
                                       key=dpath[i][key][0]; 
                                    }
                                }
                                if(dname==dnames[i].d_uname)
                                    current_flag=i;
                        
                        }
                           res.render("s_list",{dname:dname,a:dpath[current_flag],o:ordercust,locations:locations}); 
                        
                    })
                    
                })
                 }
                 else{
                    order.find({status:"2"}).populate("u_name").exec(function(err,ordercust){
                    delivery.find({},function(err,dnames){
                        for(var i=0;i<dnames.length;i++){
                            if(dname == dnames[i].d_uname){
                                //console.log("in else",dpath[i]);
                                res.render("s_list",{dname:dname,a:dpath[i],o:ordercust,locations:locations});
                                
                            }
                        }
                        //console.log("dnames:",deliverymen);
                    })
                     
                 })
                   
                                                                    
                }
             })
             
                
                //calpath(floyd,loc);
         }

	//db.close();
})
})

foodapp.get('/deliveredorders/:dname',function(req,res){
    var dname=req.params.dname;
    var o=[];
   /* order.find({},function(err,result){
        if(err)throw err;
        //console.log(res);
        for(var i=0;i<result.length;i++){
            if(result[i].status=='2' && result[i].d_uname==dname){
                o.push(result[i]);
            }
        }
        console.log(o.length);
         res.render("s_orders",{dname:dname,o:o});
    })*/
    order.find({status:"3"}).populate("u_name").exec(function(err,ordercust){
                    delivery.find({},function(err,dnames){
                        for(var i=0;i<dnames.length;i++){
                            if(dname == dnames[i].d_uname){
                                console.log("length is",ordercust.length);
                                res.render("s_orders",{dname:dname,o:ordercust,locations:locations});
                                
                            }
                        }
                        //console.log("dnames:",deliverymen);
                    })
                     
                 })
    //console.log(o);
   
   
})
 
foodapp.post('/delconfirm/:dname/:id',function(req,res){
    var dname=req.params.dname;
    var id=Number(req.params.id);
    //console.log(dname);
    //console.log(id);
    var query={o_id:id};
    var values={$set:{status:"3",d_uname:dname}};
    order.updateOne(query,values,{upsert:true},function(err,result){
        if(err) throw err;
        res.redirect('/delivery/'+dname);
    })
    
     
})
foodapp.get('/sos/:dname',function(req,res){
    var dname=req.params.dname;
    order.updateMany({d_uname:dname,status:"2"},{$set:{status:"-1"}},{upsert:true},function(err,result){
    
    })
    res.render('s_sos',{dname:dname});
})
foodapp.get("/logout", function(req, res){
   req.logout();
   res.redirect("/home");
});

foodapp.post('/chef/cancel/:u/:id',function(req, res) {
     check.updateMany({o_id:req.params.id},{status:"-1"},function(err,check_result) {
         console.log(check_result)
         order.updateMany({o_id:req.params.id},{status:"-1"},function(err,order_res){
                 console.log(order_res);
                res.redirect('/chef/myorders/'+req.params.u);  
             })
         })    
 })
foodapp.set('port',process.env.PORT||8085)
foodapp.listen(foodapp.get('port'),function(){
    console.log(8085);
});

