const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, `./profile/${process.env.ENVIRONMENT}.env`)})
const Email = require('./email/Email')
const sendEmail = require('./email/sendEmail')
const express = require('express')
const bodyparser = require('body-parser')

const passport = require('passport')
const {Strategy} = require('passport-http-bearer')
const bearerStrategy = require('./authentication/bearerStrategy')

const app = express()

passport.use(new Strategy(bearerStrategy))

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.post('/email', passport.authenticate('bearer', {session: false}), async (req, res) => {
    const email = new Email(req.body)
    const emailSent = await sendEmail(email).catch(console.error);
    res.send({emailSent})
})

app.listen(process.env.APP_PORT, () => {console.log(`UP in port ${process.env.APP_PORT}`)})
