const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware')





transactionRoutes.post("/",authMiddleware.authMiddleware);



module.exports = transactionRoutes;