const { Comic } = require('../models')

class ComicController { 
    static findAllComics(req, res, next) {
        Comic.findAll({})
        .then(comicDatas => {
            res.status(200).json(comicDatas)
        })
        .catch(err => {
            next(err)
        })
    }

    static updateComic(req, res, next) {
        Comic.update({
            "title": req.body.title, 
            "author": req.body.author, 
            "imageURL": req.body.imageUrl
        },{
            where: {
                id: req.params.id
            },
            returning: true
        })
        .then(updatedComic => {
            res.status(200).json(updatedComic)
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = ComicController