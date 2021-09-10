const jwt = require('jsonwebtoken')
const {pool, poolConnect} = require('../config/mssql');
const {validationResult} = require('express-validator')
const crypto = require('crypto')
const {generateToken} = require('../utils/generateToken')
exports.auth = (req, res, next) => {
    
    if (req.headers['x-auth-token']) {
        const token = req.headers['x-auth-token']
        jwt.verify(token, 'Zocket', function (err, decoded) {
            if (err) {
                console.log(err)
                return res
                    .status(401)
                    .json({msg: 'access not Allowed Kindly login first'})
            }
            const user = decoded
            
            req.user = {id:user.user_id, roles: user.roles, email:user.email};
            
        });
        next();
    } else {
        return res
            .status(401)
            .json({msg: 'access not Allowed Kindly login first'})
    }

}
exports.isAdmin = (req, res, next) => {
    
    if (req.user.roles != 'admin'){
        return res
        .status(401)
        .json({msg: 'Unthorized Access'})
    }else{
        next()
    }

}

exports.login = async (req, res) => {
   
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        
        return res
            .status(400)
            .json({errors: errors.array()})
    }

    await poolConnect; // ensures that the pool has been created
    try {
        const request = pool.request();
        const user = await request.query `select user_id ,firstname, lastname, isActive,roles, email, password from users where email= ${req.body.email}`

        if (user.recordset.length == 1 && user.recordset[0].email) {

            const hashedPassword = crypto
                .createHash('md5')
                .update(req.body.password)
                .digest('hex');
            if (user.recordset[0].password === hashedPassword) {
                const userpayload = {
                    user_id: user
                        .recordset[0]
                        .user_id,
                    firstname: user
                        .recordset[0]
                        .firstname,
                    lastname: user
                        .recordset[0]
                        .lastname,
                    roles: user
                        .recordset[0]
                        .roles,
                    isActive: user
                        .recordset[0]
                        .isActive,
                    email: user
                        .recordset[0]
                        .email
                }

                const token = generateToken(userpayload)
                res.cookie('token', token, {
                    expire: new Date() + 9999
                })
                res
                    .status(200)
                    .json({msg: "User Authenticated", token: token})
            } else {
                return res
                    .status(401)
                    .json({errors:[{msg: 'access not Allowed Kindly login with correct password'}]})
            }
        } else {
            return res
                .status(401)
                .json({errors:[{msg: 'access not Allowed Kindly login first'}]})
        }

    } catch (err) {

        res.json(err)
    }

}