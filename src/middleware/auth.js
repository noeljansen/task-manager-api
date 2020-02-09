const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token           //this adds a token property/object to the request
        req.user = user             //this adds a user object to the request. These can be accessed in the route
        next()
    } catch (e) {
        res.status(401).send({ error: ' Please autheticate.' })
    }
}

module.exports = auth