const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")

async function createTransaction(req,res){

    const {fromAccount,toAccount,amount,idempotencyKey} = req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "FromAccount, toAccount, amount, idempotencyKey is very much compulsory"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
        _id : toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message : "invalid entries"
        })
    }

    const existingTransaction = await transactionModel.findOne({
        idempotencyKey : idempotencyKey
    })

    if(existingTransaction){
        if(existingTransaction.status === "COMPLETED"){
            return res.status(200).json({
                message : "Transaction already processed",
                transaction: existingTransaction
            })
        }

        if(existingTransaction.status === "PENDING"){
            return res.status(200).json({
                message : "Transaction is still processing",
            })
        }

        if(existingTransaction.status === "FAILED"){
            return res.status(500).json({
                message : "Transaction processing failed, please retry"
            })
        }

        if(existingTransaction.status === "REVERSED"){
            return res.status({
                message : "Transaction was reversed, please retry"
            })
        }
    }


    if(fromUserAccount !== "ACTIVE" || toUserAccount !== "ACTIVE"){
         return res.status(400).json({
            message : "Both fromAccount and toAccount must be active to process the made transaction"
         })
    }


    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        return res.status(400).json({
            message : `Insufficient balance. Current balance is ${balance}. Requested amount is {amount}`
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status : "PENDING"
    }, { 
        session
    })

    const debitLedgerEntry = await ledgerModel.create({
        account : fromAccount,
        amount: amount,
        transaction : transaction._id,
        type : "DEBIT"
    },{
        session
    })

    const creditLedgerEntry = await ledgerModel.create({
        account : toAccount,
        amount: amount,
        transaction : transaction._id,
        type : "DEBIT"
    },{
        session
    })

    transaction.status = "COMPLETED"
    await transaction.save({
        session
    })

    await session.commitTransaction()
    session.endSession()


    await emailService.sendTransactionEmail(
        req.user.email,req.user.name,amount,toAccount
    )

    return res.status(201).json({
        message : "Transaction completed successfully",
        transaction : transaction
    })
}

module.exports = {
    createTransaction
}