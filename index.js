

// module.exports = {
//     isLoggedIn: function(req, res, next){
//        // console.log(req);
//         if(req.isAuthenticated()){
            
            // if(req.user.role=="user")
            // {
            //     res.redirect('/customer/'+req.user.username);
            // }
            // if(req.user.role=="chef")
            // {
            //     res.redirect('/chef/'+req.user.username);
            // }
            // if(req.user.role=="deliveryman")
            // {
            //     res.redirect('/delivery/'+req.user.username);
            // }
//             console.log("Inside");
//             return next();

        
//     }
//     else{
//         console.log("outside");
//         res.redirect('/home');
//     }
       
//     }
// }



const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  console.log(req.user);
  if (req.isAuthenticated()) { return next(); }
  //req.session.redirectTo = req.originalUrl;
  //("error", "You need to be logged in first"); // add a one-time message before redirect
  else{
  console.log("!!!!!!!!!!!!went");
  res.redirect("/home");
}
};
module.exports = middlewareObj;
