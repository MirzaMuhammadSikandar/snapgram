require('dotenv').config()
const jwt = require('jsonwebtoken')

// -------- Middleware for auth Token --------
function authenticateToken(request, response, next){
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null)
    {
        return response.status(400).send({ status: false, message: "NO Token Found" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {

        if(error)
        {
            return response.status(400).send({ status: false, message: "Token Invalid!!!" });
        }
        //decoded object user after verification is assigned to request.user
        // console.log("request in auth token---------------", request);
        request.user = user
        next()
    })
}

// -------- Logged In --------
function isLoggedIn(request, response, next){
    if(request.user)
    {
        next();
    }
    else
    {
        response.status(400).send({ status: false, message: "LogIn Error" });
    }
}

module.exports = {
    authenticateToken,
    isLoggedIn
}