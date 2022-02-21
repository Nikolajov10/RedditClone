const mongo = require('mongoose')

const connectMongoDB = (url) => {
    return mongo.connect(url,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
}

module.exports = connectMongoDB