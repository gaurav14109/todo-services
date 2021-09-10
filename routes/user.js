const express = require('express')
const router = express.Router()
const {check} = require('express-validator')
const {register} = require('../controller/users')

router.post('/registeration', [
    check('name')
        .not()
        .isEmpty(),
    check('email').isEmail(),
    check('password')
        .isLength({min: 5})
        .not()
        .isEmpty()
],register)

module.exports = router