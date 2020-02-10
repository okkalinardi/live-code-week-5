const router = require('express').Router()
const controller = require('../controllers/comicController')
const authentication = require('../middlewares/authentication')

router.use(authentication)

router.get('/', controller.findAllComics)

router.put('/:id', controller.updateComic)

module.exports = router