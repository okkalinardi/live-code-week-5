const router = require('express').Router()
const user = require('./user')
const comic = require('./comic')

router.use('/', user)

router.use('/comics', comic)

module.exports = router