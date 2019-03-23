const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, `./profile/${process.env.ENVIRONMENT}.env`)})
const Email = require('./email/Email')
const sendEmail = require('./email/sendEmail')
const express = require('express')
const bodyparser = require('body-parser')

const app = express()

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.post('/email', async (req, res) => {
    const email = new Email(req.body)
    const emailSent = await sendEmail(email).catch(console.error);
    res.send({emailSent})
})

app.listen(process.env.APP_PORT, () => {console.log(`UP in port ${process.env.APP_PORT}`)})
