const jwtoken = require('jsonwebtoken')
const User = require('../models/user')


//this is a very important function as it returns a authorized user based upon token verification


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') //this is the header token which we get from request after token is generated upon user creation and login
        const decoded = jwtoken.verify(token, process.env.JWT_TOKEN) //this returns {id based upon the tokens as tokens are created using ids}

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //now using the id and token to find the corresponding user
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: e })
    }

}

module.exports = auth