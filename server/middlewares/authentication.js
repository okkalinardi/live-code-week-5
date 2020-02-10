const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    if(!req.headers.hasOwnProperty('token')) {
        next({
            statusCode: 401,
            message: 'You have to login to see this page!'
        })
    } else {
        try {
            require('dotenv').config()
            req.loggedUser = jwt.sign(req.headers.token, process.env.JWT_SECRET)
            next()
        }
        catch(err) {
            next({
                statusCode: 403,
                message: 'Invalid Token'
            })
        }
    }
}