require('dotenv').config()

const app = require('./src/app')


const connectDB = require('./src/config/config.js')

connectDB()


app.listen(3000,()=>{
    console.log("server running on the port 3000")
})
