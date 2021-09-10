const express = require('express')
const router = express.Router()
const {auth, isAdmin} = require('../controller/auth')
const {addTodo,getTodo,getTodos,updateTodo,deleteTodo} = require('../controller/todoController')

//get todo item
router.post('/post', auth, isAdmin, addTodo);
router.put('/put/:id',auth,isAdmin,updateTodo)
router.get('/get/:id',auth,getTodo)
router.get('/getall',auth,getTodos)
router.delete('/delete/:id',auth,isAdmin,deleteTodo)
module.exports = router