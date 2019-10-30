const jwt = require('jsonwebtoken');
const {
    userModel
} = require('../models/User');

module.exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.SECRET);
        const user = await userModel.findOne({
            _id: data._id,
            'tokens.token': token
        });
        if (!user) throw new Error('Auth failed!');
        req.user = user;
        req.token = token;
        return next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong with the Auth layerer!!');
    }
}