const express = require("express")
const session = require('express-session')
const morgan = require("morgan")
const cors = require('cors')
const { PORT, mongoDBURL } = require("./models/config.js")
const { checkConnection } = require("./models/connection.js")
const personRouter = require("./routes/personRoute.js")
const postRouter = require("./routes/postRoute.js")


const app = express();

//---- Middleware for parsing request body ---- 
app.use(express.json());
app.use(morgan('dev'))
app.use(cors());
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));


app.use('/person', personRouter);
app.use('/post', postRouter);



//----------------MongoDB Connection-------------------
checkConnection(app, PORT, mongoDBURL);



//imageurl
//populate
//index in route and models
//middleware like json to check request object
//if else refactor
//use comments
//login, forgetpassword, googlelogin, should be in Auth
//generic names like data for returning arrays and objects