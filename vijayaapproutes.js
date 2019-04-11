
//===============================================================================================vijaya

function check_time_eligibilty(){
    var now = new Date();                      //current time in utc Date Format 
    var hour = now.getHours();                 //to get hours
    var min=now.getMinutes();                  //to get minutes
                                              //to check whether time>5:30 am or not
    return(hour>5||hour==5&&min>=30);         //11:00 am in itc is equal to 5:30 in utc
}

/* shows chef's home page, where after 11'O clock all the orders for today are present whereas 
everyday before 11'O clock there will be no orders available*/ 
foodapp.get('/chef/:username',function(req, res) {
    var username=req.params.username;
    is11=check_time_eligibilty();                //is11 is true if time is after 11:00 am or else it is false
                                                //Find all the items in orders database and see the items which are not taken by any chefs
    check.find({status:0},function(err,checkresult){
        if(!err)
        {
            menu.find({},function(err, menuresult) { 
                if(!err){
                //to get details like Picture,Name of the items 
                    res.render("chef_home",{username:username,menuresult:menuresult,checkresult:checkresult,is11:is11});
                }
                else{
                    console.log(err);
                }
            })
        }
        else
        {
            console.log(err);
        }
    })
})

//chef myorders page which contains the items that chef is cooking for today
foodapp.get('/chef/myorders/:username',function(req, res) {
    var username=req.params.username;
    check.find({status:1,chef:username},function(err,myresult){     //to get the items that are currently cooked by the chef
        if(!err)
        {
            menu.find({},function(err, menuresult) {
                if(!err)
                {
                    is11=check_time_eligibilty();                           //to check whether the time is > 11:00Am or not
                    res.render("chef_myorders",{username:username,menuresult:menuresult,myresult:myresult,is11:is11});  
                }
                else
                {
                    console.log(err);
                }
            })
        }
        else
        {
            console.log(err);
        }
    })
})

//when chef chooses the item to cook
foodapp.post('/cheforder/:username/:itemid',function(req, res) {
    var username=req.params.username,
        itemid=req.params.itemid;
    check.findOne({_id:itemid},function(err, checkres) {//To check for Race Condition 
        if(!err)
        {
            if(checkres.status==0)
            {
                check.updateOne({_id:itemid},{$set:{status:1,chef:username}},{},function(){});
                    res.redirect('/chef/'+username);
            }
            else  //In race Condition, Suppose the Item is already taken
            { 
                res.send("This order is already taken");
            }
        }
        else{
            console.log(err);
        }
    })
    
})
/*  when chef cooked the item change the item status to 2
    if all the items in the order are cooked then change the order status to 1
*/
foodapp.post('/chefconfirm/:username/:itemid',function(req, res) {
    var username=req.params.username,
        itemid=req.params.itemid,
        f=1;
    check.updateOne({_id:itemid},{$set:{status:2}},function(){   //update the item status to 2
       check.findOne({_id:itemid},function(err, res_item) {
           console.log("hello")
           if(!err)
           {
                var temp=res_item.o_id//order id of the item
                console.log("item", res_item.status);
                check.find({o_id:temp},function(err,res_order ) {      //all items in the order
                    if(!err)
                    {
                        check.find({o_id:temp,status:2},function(err,res_cooked) { //get cooked items in the orders
                            if(!err)
                            {   console.log("res_order",res_order);
                              console.log("res_cooked",res_cooked);
                                if(res_order.length==res_cooked.length)     //check if all items are cooked
                                {
                                    order.updateOne({o_id:temp},{status:"1"},function(){ 
                                        res.redirect('/chef/myorders/'+username); //go back to my_orders page
                                    });    
                                }
                                else
                                {
                                    res.redirect('/chef/myorders/'+username); //go back to the my_orders page
                                }
                            }
                            else{
                                console.log(err);
                            }
                        });
                    }
                    else{
                        console.log(err);
                    }
                });
           }
           else{
               console.log(err);
           }
        }); 
    });
});
var schedule = require('node-schedule');
 /*This function is to check whether there are items which are not taken by any chef
 Basically it runs on 11:45am daily*/
var j = schedule.scheduleJob('15 6 * * *', function(){
  //console.log('Time is 11:45am');
  check.find({status:0},function(err,check_result){   //to check if any items aren't chosen by any chef
      if(!err && check_result.length!=0){
          chef.find({},function(err,chefs){             //finds all the chefs available
              var sub_chefs =chefs;                     
              check_result.forEach(function(item){      //iterates through each item
                var ran = Math.floor((Math.random() * chefs.length)); //generates a random number
                var temp_chef = chefs[ran]                            //choses  that chef
                chefs.splice(ran,1);                                  //remove that chef so that he will not get any extra orders again
                check.updateOne({_id:item._id},{chef:temp_chef.c_uname,status:1},function(err,u) {
                    //console.log("done"); //update status of that item to 1 and assign a chef to that item
                })
                if(chefs.length ==0) chefs = sub_chefs;  //if there are more orders and all chefs are assigned with an extra order then the process reiterates
              })
          })
          
      }
  })
});
