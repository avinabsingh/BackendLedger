const mongoose = require('mongoose')

function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Server is connected to the DataBase")
    })
    .catch((err)=>{
        console.log("Something went wrong will connecting to the DataBase")
        console.log(err)
        process.exit(1);
    })
}

module.exports = connectDB