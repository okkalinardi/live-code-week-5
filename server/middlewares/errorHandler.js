module.exports = function(err, req, res, next) {
    let status = err.statusCode || 500
    let msg = err.message || 'Internal server error'
    // console.log(msg)
    res.status(status).json(msg)
}