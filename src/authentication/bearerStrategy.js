const bearerStrategy = function bearerStrategy(token, done) {
    if(token === process.env.TOKEN_AUTHORIZATION) {
        return done(null, true)
    }
    return done(null, false)
}

module.exports = bearerStrategy