//This code is script language for providing the routes and actions to be performed in a page


var MongoClient= require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"; 
const express= require('express');
var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended:true});


const app= express();


app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.set('port',process.env.PORT||3005);


/*The following code contains the get and post methods for the different pages to be rendered , 
and what actions are to be performed in each of them*/
MongoClient.connect(url,function(err,db){
    if(err)throw err;

    //create an instance of the database to use it for inserting data
    var dbo= db.db("foodAppdb");

    /*create a collection to enter the user details from front end.*/
    dbo.createCollection("users",function(err,res){
      	if(err) throw err;
    })


    //Render the home page to the user 
    app.get('/home',function(req,res){
    	res.render('home');
    })

    /*Once the user signsup , his details are entered into the database through this route
    and the next page is then rendered*/
    app.post('/signupsubmit',urlencodedparser,function(req,res){

        var username = req.body.username;               
        var email = req.body.email;    
        var mobno = req.body.mobno;  
        var password_1 =  req.body.password_1;  
        var password_2 = req.body.password_2; 
        var location = req.body.location;


        //checks if the user already exists , if not , creates a new user
        var record =  dbo.collection("users");
        record.find().toArray({'username':req.body.uname,'password':req.body.pass},function(err,result){
                    if(err)throw err;

                
                    if(result.length!=0)
                    {
                        window.alert("The username already exists , please choose another one");
                    }
                    else
                    {
                        var a ={'username': req.body.username,
                                'email': req.body.email,
                                'mobno': req.body.mobno,
                                'password':req.body.password_2,
                                'location':req.body.location
                                };
            
                        // console.log(username);
                        // console.log(email);
                        // console.log(mobno);
                        // console.log(password_1);
                        // console.log(password_2);
                        // console.log(location);

                        dbo.collection("users").insertOne(a, function(err, res) {
                            if (err) throw err;
                            console.log("1 document inserted");
                            
                        })


                         res.redirect('/custlogin');
                    }
        })   
      
    })


    app.get('/signup',function(req,res){
         res.render('signup');
    })
    

    app.get('/custlogin',function(req,res){
        res.render("login");
    })
    
    

    app.post('/loginSubmit',urlencodedparser,function(req,res){

        var record =  dbo.collection("users");
        record.find().toArray({'username':req.body.uname,'password':req.body.pass},function(err,result){
                if(err)throw err;
               
                if(result.length!=0) 
                {
                    for(var i=0; i<result.length;i++)
                    {
                       var a = result[i].username;
                       var b = result[i].password; 
                    }
                    res.render('custlogin');

                }              
                
        })
    })

    
	app.get('/deliverylogin',function(req,res){
        res.render('delivery');
	})


    app.post('/deliverysubmit',urlencodedparser,function(req,res){
        var record =  dbo.collection("deliverymen");
        record.find({'username':req.body.uname,'password':req.body.pwd},function(err,result){
                if(err)throw err;
               
                        console.log("User account exists");
                        res.render('deliverlogin');
        })
    })



	app.get('/cheflogin',function(req,res){
    	res.render('chef');
	})


    app.post('/chefsubmit',urlencodedparser,function(req,res){
        var record =  dbo.collection("chefs");
        record.find({'username':req.body.uname,'password':req.body.pass},function(err,result){
                if(err)throw err;
               
                            console.log("User account exists");
                            res.render('cheflogin');
        })

    })

})
	


app.listen(3005,function(){
    console.log('Port 3005')
})


