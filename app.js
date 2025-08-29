const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require('body-parser')

const testRouter = require('./routes/test')

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['*'],
    exposedHeaders: ['Content-Type']
}))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/test',testRouter)


module.exports = app