const express = require('express')
const app = express()
const cookieparser = require('cookie-parser')

const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/account.routes')



app.use(express.json())
app.use(cookieparser())

app.use("/api/auth",authRouter)
app.use("/apit/accounts",accountRouter)


module.exports = app