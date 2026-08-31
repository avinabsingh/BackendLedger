const express = require('express')
const app = express()
const cookieparser = require('cookie-parser')

const authRouter = require('./routes/auth.routes')




app.use(express.json())
app.use(cookieparser())

app.use("/api/auth",authRouter)


module.exports = app