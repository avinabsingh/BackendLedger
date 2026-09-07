const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")

const createAccountController = require('../controllers/account.controller')


const router = express.Router()

router.post("/",authMiddleware.authMiddleware,createAccountController.createAccountController

)

router.get("/",authMiddleware.authMiddleware, createAccountController.getUserAccountsController)

router.get("/balance/:accountId",authMiddleware.authMiddleware,createAccountController.getAccountBalanceController)

module.exports = router