const express = require('express')
const app = express()
const cookieparser = require('cookie-parser')

const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/account.routes')
const transactionRoutes = require('./routes/transaction.routes')



app.use(express.json())
app.use(cookieparser())

app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRoutes)


module.exports = app