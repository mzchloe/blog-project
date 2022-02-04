const express = require('express')
//require bcrypt
const bcrypt = require('bcrypt')
//getting our user model
const User = require('../models/user')
const user = require('../models/user')



// new router for the post feature
const router = express.Router()

// form for creating a user - display the form 
router.get('/create', (req, res) => {
    const user = new User()
    res.render('register', { user })
})

//the action of creating: handling the data from the form and displaying it 
router.post('/create', async (req, res) => {
    const user = new User()
    //hash the password before saving:
    const hash = await bcrypt.hash(req.body.password, 10) //recommended to use async/await
    user.email = req.body.email
    user.password = hash 
    try{
        await user.save()
        res.redirect('/')
    } 
    catch (error){
        res.redirect('/user/create')
    }
})

//form to login user
router.get('/login', (req, res) => {
    res.render('login', {message: ''})
})

//the action of the login - handling the submission of the form (authentication of user)
router.post('/login', async (req, res) => {
    //verification of the user by email
    //1st check 
    const user = await User.findOne({email: req.body.email})
    if (user) {
        //2nd check 
        const isPwCorrect = await bcrypt.compare(req.body.password, user.password) // we compare the PW from form (req.body.password) vs. db (user.password)
        if(isPwCorrect){
            //setup the current user on the session, so we know which user is using which session. One user can have multiple sessions
            req.session.currentUser = user  //sessions will created automatically
            //console.log(req.session)
            res.redirect('/user/profile')
        } else {
            res.redirect('/user/login')
        }
    } else {
        res.redirect('/user/login')
    }
})


//route for user profile page
router.get('/profile', (req, res) => {
    //user for the profile, the user that is connected to the session:
    const user = req.session.currentUser //and then pass this to the {user}
    res.render('profile', { user }) 
})

//route for handling the logout
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/user/login')
})


// export the router to be used externaly
module.exports = router
