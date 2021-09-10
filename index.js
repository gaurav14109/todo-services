var express = require('express');
var app = express();
const cors = require('cors')

const bodyParser = require('body-parser')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const todoRouter = require('./routes/todo')

app.use(bodyParser.json())
app.use(cors({origin: true, credentials: true}))
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/todo', todoRouter)

app.listen(5000, function () {
    console.log('Server is running..');
});
