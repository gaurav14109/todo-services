const express = require('express')
const router = express.Router()
const {check} = require('express-validator')
const {login} = require('../controller/auth')
const {auth} = require('../controller/auth')

router.post('/',auth, (req, res) => {
    
    res.json(req.user)
})

router.post('/login', [
    check('email').isEmail(),
    check('password')
        .isLength({min: 5})
        .not()
        .isEmpty()
], login)

module.exports = router