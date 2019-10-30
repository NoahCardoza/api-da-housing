const { Strategy, ExtractJwt } = require('passport-jwt'); 
const { userModel } = require('../models/User');

module.exports = (passport) => {
    passport.use(new Strategy({
        secretOrKey: process.env.SECRET, 
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }), )
}