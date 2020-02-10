const bcrypt = require('bcrypt')
const saltRounds = 10

function hash(password){
    return new Promise((res, rej) => {
        bcrypt.genSalt(saltRounds, function(err, salt){
            bcrypt.hash(password, salt, function(err, hashed){
                if(err){
                    rej(err)
                } else {
                    res(hashed)
                }
            })
        })
    })
}

function compare(password, hashedPassword) {
    return new Promise ((res, rej) => {
        bcrypt.compare(password, hashedPassword, function(err, hasil) {
            if(err){
                rej(err)
            } else {
                res(hasil)
            }
        })
    })
} 

module.exports = {
    hash,
    compare
}