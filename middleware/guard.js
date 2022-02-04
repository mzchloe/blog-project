const session = require('express-session')

// this is how a middleware should be created, always these three req, res, next
function isLoggedIn(req, res, next){
    //if not logged in
    if(!req.session.currentUser) {
        //res.redirect('/user/login') 
    return res.render('login', { message: 'you are not logged in'})
}  
//else we go to next step, if there is a user
next()
}


module.exports = isLoggedIn