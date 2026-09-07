const tokenBlackListModel = require('../models/blacklist.model');
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

async function authMiddleware(req,res,next){
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message : "Token was not found in the header and in the cookies"
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({token})

    if(isBlackListed){
        return res.status(401).json({
            message : "Unauthorized access, token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId)

        req.user = user
        return next()

    }catch(err){
        return res.status(401).json({
            message : "Unauthorized access, token is invalid",
            err
        })
    }

}


async function authSystemUserMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message : "Unauthorized access, token is missing"
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({token})

    if(isBlackListed){
        return res.status(401).json({
            message : "Unauthorized access, token is invalid"
        })
    }


    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")

        if(!user.systemUser){
            return res.status(413).json({
                message : "Forbidden Access to this Role"
            })
        }

        req.user = user

        return next()
    }
    catch(err){
        return res.status(401).json({
            message : "Unauthorized access, token is invalid"
        })
    }
}



module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}