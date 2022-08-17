const { ExtractJwt, Strategy } = require('passport-jwt')
const User = require('../models/User')

module.exports = passport => {
    passport.use(
        new Strategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET
        }, (jwt_payload, done) => {
            User.findById(jwt_payload._id)
                .then(user => {
                    if(user) return done(null, user)
                    return done(null, false)
                })
                .catch(err => {
                    console.log(err)
                })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}