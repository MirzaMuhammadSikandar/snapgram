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


