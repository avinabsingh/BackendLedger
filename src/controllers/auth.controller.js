const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function userRegisterController(req,res){
    const {name,email,password} = req.body
    const isExists = await userModel.findOne({email : email})
    if(isExists){
        res.status(422).json({
            message : "User already registered",
            status : "failed"
        })
    }

    const  user = await userModel.create({
        email,name,password
    })

    const token = jwt.sign({userId : user._id},
        process.env.JWT_SECRET
    ,{expiresIn : "3d"})

    res.cookie("token",token)

    res.status(201).json({
        user : {
            _id : user._id,
            email : user.email,
            name : user.name
        },token
    })
}

module.exports = {userRegisterController}