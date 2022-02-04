const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
var expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const store = require('connect-mongo') //to be used inside the session setup

const Post = require('./models/post')
const postRouter = require('./routes/post')
const commentRouter = require('./routes/comment')
const userRouter = require('./routes/user')
//import middleware
const isLoggedIn = require('./middleware/guard')

// connection to mongodb
mongoose.connect('mongodb://localhost/blog')

// create and express app
const app = express()
// set the templating engin
app.set('view engine', 'ejs')
// enable ejs layouts in express
app.use(expressLayouts)
// middleware for getting the data passed from a form
app.use(express.urlencoded({ extended: false }))
// middle ware for using more http verbs in the html
app.use(methodOverride('_method'))
// tell express app about the public folder
app.use(express.static('public'))
//express session (middleware)- 'session' is from const session above, it's a f taking an object
app.use(
  session({
  //min.setup:
    secret: 'hello', //it would be randomly generated normally 
    resave: true,
    saveUninitialized: true,
    cookie: {
     httpOnly: true,
     maxAge: 1200000 //ms --> after 1 minute each session will be expired and gets deleted
    },
    //setup for storing the sessions 
    store: store.create({ //store is the const store from above
      mongoUrl: 'mongodb://localhost/blog',
    }) 
  })
) 


// root route
app.get('/', isLoggedIn, async (req, res) => {
  const posts = await Post.find().populate('comments')
  res.render('allPosts', { posts })
})

//MIDDLEWARES
// post routes
app.use('/posts', postRouter)

// comment routes
app.use('/comments', commentRouter)

//hooking the user routes
app.use('/user', userRouter)

// listening to requests
app.listen(3008)
