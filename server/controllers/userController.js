const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('../helpers/bcrypt')

class UserController {

    static login(req, res, next){
        let userInfo
        User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(userData => {
            if(!userData) {
                next({
                    statusCode: 404,
                    message: 'Invalid email / password'
                })
            } 
            userInfo = userData
            return bcrypt.compare(req.body.password, userData.password)
        })
        .then(compareResult => {
            if (!compareResult) {
                next({
                    statusCode: 404,
                    message: 'Invalid email / password'
                })
            } else {
                require('dotenv').config()
                let payload = {
                    id: userData.id,
                    email: userData.email
                }
                let token = jwt.sign(payload, process.env.JWT_SECRET)
                res.status(200).json(token)
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static register(req, res, next) {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        .then(createdUser => {
            require('dotenv').config()
            let payload = {
                id: createdUser.id,
                email: createdUser.email
            }
            let token = jwt.sign(payload, process.env.JWT_SECRET)
            res.status(201).json(token)
        })
        .catch(err => {
            next(err)
        })
    }

}

module.exports = UserController