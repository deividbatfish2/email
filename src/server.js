const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, `./profile/${process.env.ENVIRONMENT}.env`)})
const app = require('./app/app')

app.listen(process.env.APP_PORT, () => {console.log(`UP in port ${process.env.APP_PORT}`)})