const express = require("express");
const { PORT, mongoDBURL } = require("./models/config.js");
const { checkConnection } = require("./models/connection.js");
const personRouter = require("./routes/personRoute.js")
const postRouter = require("./routes/postRoute.js")


const app = express();

//---- Middleware for parsing request body ---- 
app.use(express.json());


app.use('/person', personRouter);
app.use('/post', postRouter);



//----------------MongoDB Connection-------------------
checkConnection(app, PORT, mongoDBURL);