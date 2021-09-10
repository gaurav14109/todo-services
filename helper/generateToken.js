const jwt = require('jsonwebtoken');
exports.generateToken= (payload)=>{
    return jwt.sign(payload, 'Zocket')

}