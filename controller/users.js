const {pool, poolConnect} = require('../config/mssql');
const {validationResult} = require('express-validator')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid');
const {generateToken} = require('../utils/generateToken')
exports.register =  async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {

        return res
            .status(400)
            .json({errors: errors.array()})
    }

    await poolConnect; // ensures that the pool has been created
    try {
        const request = pool.request();
        const checkemail = await request.query `select * from users where email= ${req.body.email}`
        if (checkemail.recordset.length > 0) {
            return res.status(400).json({msg: 'user already exists with the same email'})
        }

        const hashedPassword = crypto
            .createHash('md5')
            .update(req.body.password)
            .digest('hex');
        const transaction = pool.transaction()

        transaction.begin(async err => {
            const user_id = uuidv4();
            const request = transaction.request()

            try {
                await request
                    .query `insert into users (user_id, FirstName, Email,Password) values(${user_id},${req.body.name},${req
                    .body
                    .email},${hashedPassword})`
                    await transaction
                    .commit()
                const token = generateToken({FirstName: req.body.name, Email: req.body.email})
                res.cookie('token', token, { expire: new Date() + 9999})        
                res
                    .status(200)
                    .json({msg: 'Registration Successful', token})
            } catch (err) {
                console.log(err)
                return res.json(err)
            }
        })

    } catch (err) {
        res.json(err)
    }

}

