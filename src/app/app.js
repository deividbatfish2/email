const Email = require('../email/Email')
const publisher = require('../publisher/publisher')
const express = require('express')
const bodyparser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
process.env.ENVIRONMENT != 'test'? require('appmetrics-dash').attach(): null

const passport = require('passport')
const {Strategy} = require('passport-http-bearer')
const bearerStrategy = require('../authentication/bearerStrategy')

const app = express()

passport.use(new Strategy(bearerStrategy))

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.post('/email', passport.authenticate('bearer', {session: false}), [
    check('to').isEmail(),
    check('subject').exists(),
    check('text').exists().isLength({max: 500, min:0}),
    check('html').exists().isLength({max: 500, min:0})
], (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(422).send({errors: errors.array()})
    }
    else {
        const email = new Email(req.body)
        try {
            publisher(email)
            res.send({mensagem: 'email salvo para envio'})
        }
        catch(e) {
            console.error(e)
            res.status(500).send({erro: "Unespected error"})
        }
    }
})

module.exports = app
