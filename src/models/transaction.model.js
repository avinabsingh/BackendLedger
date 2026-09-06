const mongoose = require('mongoose')


const transactionSchema = new mongoose.Schema({
    fromAccount : { 
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : [true, "Transaction must be having a from account"],
        index : true
    },
    toAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : [true, "Transaction must be having a to account"],
        index : true
    },
    status : {
        type : String,
        enum : {
            values : ["PENDING","COMPLETED","FAILED","REVERSED"],
            message : "status can be either PENDING, COMPLETED, FAILED OR REVERSED",
        },
        default : "PENDING"
    },
    amount : {
        type : Number,
        required : [true, "Amount is required for creating a transaction"],
        min : [0, "Amount must be minimum of 0"]
    },
    idempotencyKey : {
        type : String,
        required : [true, "Idempotency Key is required for creating a transaction"],
        index : true,
        unique : true
    }
},{
    timestamps : true
}
)


const transactionModel = mongoose.model("transaction",transactionSchema);

module.exports = transactionModel;