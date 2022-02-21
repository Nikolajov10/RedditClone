require('dotenv').config()
require('express-async-errors')

const connectMongo = require('./db/connect')
const authUser = require('./middleware/authentications')
//error handlers
const notFoundMidd = require('./middleware/not-found')
const errorHandlerMidd = require('./middleware/error-handler')

const express = require('express');
const app = express();
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const commentRouter = require('./routes/comment')
const searchRouter = require('./routes/search')

const bodyParser = require('body-parser')

//app.use(bodyParser.json())
app.use(express.json());

app.use('/api/v1/auth',authRouter)

app.use('/api/v1/post',postRouter)

app.use('/api/v1/comment',commentRouter)

app.use('/api/v1/search',searchRouter)

app.use(notFoundMidd)
app.use(errorHandlerMidd)

const PORT = process.env.PORT || 5555

const start = async () => {
    try {
        await connectMongo(process.env.MONGO_URI)
        app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}...`);
    });
    } catch (error) {
        console.log(error);
    }
};

start();