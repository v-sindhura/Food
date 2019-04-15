
//===============================================================================================vijaya
/*to check whether time is greater than 11 or not*/
function check_time_eligibilty(){
    //current time in utc Date Format
    var now = new Date()
    //to get hours
    var hour = now.getHours();
    //to get minutes;                      
    var min = now.getMinutes();                  
    //to check whether time>5:30 am or not 11:00 am in itc is equal to 5:30 in utc
    return(hour>5 || hour==5 && min>=30);         
}

/* shows chef's home page, where after 11'O clock all the orders for today are present whereas 
everyday before 11'O clock there will be no orders available*/

foodapp.get('/chef/:username',function(req, res) {
    var username = req.params.username;
    //is11 is true if time is after 11:00 am or else it is false
    var istime11 = check_time_eligibilty();                
    //Find all the items in orders database and see the items which are not taken by any chefs                                            
    check.find({status:0},function(err,checkresult){
        if(!err){
            menu.find({},function(err, menuresult) { 
                if(!err){
                    //to get details like Picture,Name of the items 
                    res.render("chef_home",{username:username,menuresult:menuresult,checkresult:checkresult,istime11:istime11});
                }
            })
        }
    })
})

//chef myorders page which contains the items that chef is cooking for today

foodapp.get('/chef/myorders/:username',function(req, res) {
    var username = req.params.username;
    //to get the items that are currently cooked by the chef
    check.find({status:1,chef:username},function(err, myresult){    
        if(!err){
            menu.find({},function(err, menuresult) {
                if(!err){
                   //to check whether the time is > 11:00Am or not
                    var istime11=check_time_eligibilty();                        
                    res.render("chef_myorders",{username:username,menuresult:menuresult,myresult:myresult,istime11:istime11});  
                }
            })
        }
    })
})

//when chef chooses the item to cook
foodapp.post('/chef/order/:username/:itemid',function(req, res) {
    var username = req.params.username,
        itemid = req.params.itemid;
    check.findOne({_id:itemid},function(err, checkres) {
        //To check for Race Condition 
        if(!err){
            if(checkres.status == 0){
                check.updateOne({_id:itemid},{$set:{status:1,chef:username}},{},function(){
                    res.redirect('/chef/' + username);
                });
            }
            else{  
                //In race Condition, Suppose the Item is already taken
                res.send("This order is already taken");
            }
        }
    })
    
})
/*  when chef cooked the item change the item status to 2
    if all the items in the order are cooked then change the order status to 1
*/
foodapp.post('/chef/confirm/:username/:itemid',function(req, res) {
    var username = req.params.username,
        itemid = req.params.itemid;
    check.updateOne({_id:itemid},{$set:{status:2}},function(){   //update the item status to 2
       check.findOne({_id:itemid},function(err, res_item) {
           if(!err){    
                //order id of the item
                var temp = res_item.o_id;
                //all items in the order
                check.find({o_id:temp},function(err,res_order ) {      
                    if(!err){   
                        //get cooked items in the orders
                        check.find({o_id:temp,status:2},function(err,res_cooked) { 
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
/*This function runs daily at 11:45am to check whether there are any items left out
  If there are items left out then it assigns those items to chefs randomly*/ 
var job = schedule.scheduleJob('42 10 * * *', function(){
  check.find({status:0},function(err,check_result){
        if(!err && check_result.length!=0){
            chef.find({},function(err,chefs){
                var sub_chefs =chefs;
                check_result.forEach(function(item){
                    var random = Math.floor((Math.random() * chefs.length));
                    var temp_chef = chefs[random]
                    chefs.splice(random,1);
                    check.updateOne({_id:item._id},{chef:temp_chef.c_uname,status:1},function(err,u) {
                        if(chefs.length == 0) chefs = sub_chefs;
                    })
                })
            })
        }
    })
});
