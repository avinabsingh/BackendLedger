const mongoose = require('mongoose')

const ledgerSchema = new mongose.Schema({
    account : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : [true, "Ledger must be having an account"],
        index : true,
        immutable : true
    },
    amount : {
        type : Number,
        required : [true, "Amount must be present"],
        immutable : true
    },
    transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "transaction",
        required : [true, "Ledger must be having an transaction"],
        index : true,
        immutable : true
    },
    type : {
        type : String,
        enum : {
            values : ["CREDIT","DEBIT"],
            message : "Type can be either CREDIT OR DEBIT"
        },
        required : true,
        immutable : true
    }
})



function preventLedgerMod(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}



ledgerSchema.pre('findOneAndUpdate',preventLedgerMod);
ledgerSchema.pre('updateOne',preventLedgerMod);
ledgerSchema.pre('deleteOne',preventLedgerMod);
ledgerSchema.pre('remove',preventLedgerMod);
ledgerSchema.pre('deleteMany',preventLedgerMod);
ledgerSchema.pre('updateMany',preventLedgerMod);
ledgerSchema.pre('findOneAndDelete',preventLedgerMod)
ledgerSchema.pre('findOneAndReplace',preventLedgerMod);



const ledgerModel = mongoose.model('ledger',ledgerSchema);

module.exports = ledgerModel;