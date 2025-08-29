require("dotenv/config")
const app = require('./app')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL_LOCAL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:"FuckAll"
}).then(()=>{
    console.log("connection established to DBS!!!!")
}).catch(err=>{
    console.log(err)
})

const port = process.env.PORT || 5000

const server = app.listen(port,()=>{
    console.log(`Server hosted successfully at ${port}`)
})
