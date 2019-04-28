var express = require("express");
var bodyParser = require("body-parser");
var app = express.Router();
var path = require("path");
var user=require("../models/user.js");
var order=require("../models/order.js");
var multer=require("multer");
var middleware=require("../middleware");
var {isLoggedIn}= middleware;

//Here we are configuring express to use body-parser as middle-ware.

// app.use(express.static(__dirname+''))

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect("/home");
// }

app.get('/deliveredorders/:dname',isLoggedIn,function(req,res){
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
    order.find({status:"3"}).populate("uname").exec(function(err,ordercust){
                    delivery.find({},function(err,dnames){
                        for(var i=0;i<dnames.length;i++){
                            if(dname == dnames[i].d_uname){
                                res.render("s_orders",{dname:dname,o:ordercust});
                                
                            }
                        }
                        //console.log("dnames:",deliverymen);
                    })
                     
                 })
    //console.log(o);
   
   
})


 
app.post('/delconfirm/:dname/:id',function(req,res){
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
        //console.log(dist);
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
console.log(floyd);
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
app.get('/:dname',isLoggedIn,function(req,res){
  console.log("hello");   
var loc=['0'];
   var dname=req.params.dname;
     var c=0;     
     var a=0;
    var deliverymen=[];
    order.find({o_date:Date.now()},function(err,ord){
        if(ord.length==0)
             {
                 res.render("s_main",{dname:dname});
             }
             else{
    
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
                     order.find({status:"1"}).populate("uname").exec(function(err,ordercust){
                    for(var i=0;i<ordercust.length;i++){
                        loc.push(ordercust[i].uname.location)
                    }
                    var uniqueloc = new Set(loc);
                    loc = Array.from(uniqueloc);
                    //console.log("unique locations:",loc);
                    dpath = calpath(floyd,loc);
                    delivery.find({},function(err,dnames){
                        for(var i=0;i<dnames.length;i++){
                                var key='0';
                                if(Object.keys(dpath[i]).length!=0){
                                    while(key in dpath[i]!=false){                                    
                                        var deliverylocation=dpath[i][key][0];
                                        //console.log("del is"+deliverylocation);
                                        for(var k=0;k<ordercust.length;k++){
                                                //order.update({_id:ordercust[k]},{$set:{status:"2",d_uname:dname}});
                                                order.updateOne({_id:ordercust[k]},{$set:{status:"2"}},{upsert:true},function(err,result){
                                                    if(err) throw err;
                                                })
                                               ordercust[k].status="2";
                                            
                                        }
                                       key=dpath[i][key][0]; 
                                    }
                                }
                                
                           res.render("s_list",{dname:dname,a:dpath[i],o:ordercust}); 
                        }
                        
                    })
                    
                })
                 }
                 else{
                    order.find({status:"2"}).populate("uname").exec(function(err,ordercust){
                    delivery.find({},function(err,dnames){
                        for(var i=0;i<dnames.length;i++){
                            if(dname == dnames[i].d_uname){
                                //console.log("in else",dpath[i]);
                                res.render("s_list",{dname:dname,a:dpath[i],o:ordercust});
                                
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
             }
            })
})
module.exports = app;
