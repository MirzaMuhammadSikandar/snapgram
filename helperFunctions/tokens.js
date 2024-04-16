require('dotenv').config()
const jwt = require('jsonwebtoken')


function generateAccessToken(id, email){
    return jwt.sign({id, email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d'})
}

function generateRefreshToken(id, email) {
    return jwt.sign({ id, email }, process.env.REFRESH_TOKEN_SECRET)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}