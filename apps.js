var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
// const querystring = require('querystring'); 
 const express=require('express');
 const app=express();

 app.set('view engine','ejs')

 app.use(express.static('public'))
 app.set('port',process.env.PORT||3000)

//  app.use(bodyParser.urlencoded({ extended: false }));  
// app.use(bodyParser.json());



MongoClient.connect(url,function(err,db){
	if (err) throw err;

	 var dbo = db.db("sample");


	 dbo.createCollection("order",function(err,res){
		if(err) throw err;

	})
    
app.get('/deliveredorders/:dname',function(req,res){
    var dname=req.params.dname;
    var o=[];
    dbo.collection("order").find({}).toArray(function(err,result){
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



 app.get('/delivery/:dname',function(req,res){
   var dname=req.params.dname;
     var c=0;
     var a=0;
     dbo.collection("order").find({}).toArray(function(err, result) {
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
            var a1=[];
            var a2=[];
            var a3=[];
            for(var j=0;j<result.length;j++){
                var a=result[j].o_id;
                if(a%3==0){
                    a1.push(result[j]);
                    var myquery={o_id:a};
                    var values={$set:{dname:"mounika"}};
                    dbo.collection("order").updateOne(myquery,values,function(err,res){
                        if(err)throw err;
                    })
                }
                else if(a%3==1){
                    a2.push(result[j]);
                    var myquery={o_id:a};
                    var values={$set:{dname:"sindhura"}};
                    dbo.collection("order").updateOne(myquery,values,function(err,res){
                        if(err)throw err;
                    })
                }
                else{
                    a3.push(result[j]);
                    var myquery={o_id:a};
                    var values={$set:{dname:"pranita"}};
                    dbo.collection("order").updateOne(myquery,values,function(err,res){
                        if(err)throw err;
                    })
                }
            }
            if(dname=="mounika"){
                //console.log(a);
                res.render("s_list",{dname:dname,a:a1});
            }
            else if(dname=="sindhura"){
                  //console.log(a2);
               res.render("s_list",{dname:dname,a:a2}); 
            }
            else{
                res.render("s_list",{dname:dname,a:a3});
            }                 
                }
        else{
                res.render("s_main",{dname:dname});
            
        }    

	//db.close();
})
})
app.get('/delconfirm/:dname/:id',function(req,res){
    var dname=req.params.dname;
    var id=Number(req.params.id);
    //console.log(dname);
    //console.log(id);
    var query={o_id:id};
    var values={$set:{status:"2"}};   dbo.collection("order").updateOne(query,values,{upsert:true},function(err,res){
        if(err) throw err;
    })
    res.redirect('/delivery/'+dname);
     
})
})



app.listen(3000,function(){
	console.log('Port 3000')
})