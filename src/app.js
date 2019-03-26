const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, `./profile/${process.env.ENVIRONMENT}.env`)})
const Email = require('./email/Email')
const sendEmail = require('./email/sendEmail')
const express = require('express')
const bodyparser = require('body-parser')
const { check, validationResult } = require('express-validator/check');
const dash = require('appmetrics-dash').attach()

const passport = require('passport')
const {Strategy} = require('passport-http-bearer')
const bearerStrategy = require('./authentication/bearerStrategy')

const app = express()

passport.use(new Strategy(bearerStrategy))

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.post('/email', passport.authenticate('bearer', {session: false}), [
    check('to').isEmail(),
    check('subject').exists(),
    check('text').isLength({max: 500, min:0}),
    check('html').exists().isLength({max: 500, min:0})
], async (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(422).send({errors: errors.array()})
    }
    else {
        const email = new Email(req.body)
        try {
            const emailSent = await sendEmail(email)
            res.send({emailSent})
        }
        catch(e) {
            console.error(e)
            res.status(500).send({erro: "Unespected error"})
        }
    }
})

app.listen(process.env.APP_PORT, () => {console.log(`UP in port ${process.env.APP_PORT}`)})
