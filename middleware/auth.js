const jwt = require('jsonwebtoken');
const {
    userModel
} = require('../models/User');
const ListingModel = require('../models/Listing');


module.exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.SECRET);
        const user = await userModel.findOne({
            _id: data._id,
            'tokens.token': token
        });
        if (!user) throw new Error('Credentials failed.');
        req.user = user;
        req.token = token;
        return next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Your credentials have failed the auth layer.');
    }
}

// todo: Make middleware to check for ownership.
// module.exports.isOwner = async (req, res, next) => {
//     try{ 

//     }
//     catch(err){
//         console.error(err);
//     }
// }