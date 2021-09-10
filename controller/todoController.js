const {pool, poolConnect} = require('../config/mssql');
const {v4: uuidv4} = require('uuid');
exports.addTodo = async (req, res) => {
    const todo_id = uuidv4()

    await poolConnect
    try {

        const transaction = pool.transaction()

        transaction.begin(async err => {

            const request = transaction.request()

            try {
                await request
                    .query `insert into todo_items (todo_id, todo_name, todo_description) values(${todo_id},${req
                    .body
                    .name},${req
                    .body
                    .description})`

                    transaction
                    .commit()
                res
                    .status(200)
                    .json({msg: "todo added successfully"})
            } catch (err) {
                console.log(err)
                return res.json(err)
            }

        })

    } catch (err) {
        console.log(err)
        res.json(err)
    }

}

//get todos by id

exports.getTodo = async (req, res) => {

    const todo_id = req.params.id
    await poolConnect
    try {
        const transaction = pool.transaction()
        transaction.begin(async err => {

            if (err) {
                console.log(err)
                return
            }
            const request = transaction.request()
            try {
                const todo_list = await request
                    .query `select * from todo_items where todo_id = ${todo_id}`

                    res
                    .json(todo_list.recordset[0])
            } catch (err) {
                console.log(err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

//get all todos
exports.getTodos = async (req, res) => {

    await poolConnect
    try {
        const transaction = pool.transaction()
        transaction.begin(async err => {

            if (err) {
                console.log(err)
                return
            }
            const request = transaction.request()
            try {
                const todo_list = await request.query('select * from todo_items')
                transaction.commit()
                res.json(todo_list.recordset)
            } catch (err) {
                console.log(err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

//update todo todo_list
exports.updateTodo = async (req, res) => {
    const todo_id = req.params.id
    await poolConnect
    try {
        const transaction = pool.transaction()
        transaction.begin(async err => {

            if (err) {
                console.log(err)
                return
            }
            const request = transaction.request()
            try {
                const todo = await request
                    .query `update  todo_items set todo_name = ${req
                    .body
                    .todo_name}, todo_description = ${req
                    .body
                    .todo_description} where todo_id = ${todo_id}`

                    transaction
                    .commit()
                res.json({msg: 'Todo updated successfully'})
            } catch (err) {
                console.log(err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

//delete todo todo_list
exports.deleteTodo = async (req, res) => {
    const todo_id = req.params.id
    
    await poolConnect
    try {
        const transaction = pool.transaction()
        transaction.begin(async err => {

            if (err) {
                console.log(err)
                return
            }
            const request = transaction.request()
            try {
                const todo = await request
                    .query `delete todo_items where todo_id = ${todo_id}`
                    
                    if (todo.rowsAffected.toString()=="0") 
                        return res.json({msg: "No such todo in the list"})
                    transaction
                    .commit()
                res.json({msg: 'Todo deleted successfully'})
            } catch (err) {
                console.log(err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}
