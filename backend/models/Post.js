const mongo = require('mongoose')

const PostSchema = new mongo.Schema({
    description : {
        type : String,
        required: [true,'Please provide description'],
        minlength:2,
    },
    title : {
        type : String,
        required: [true,'Please provide title'],
        minlength:2,
    }
    ,
    dateCreated : {
        type : Date,
        default : Date.now
    },
    multimediaContent : {
        type:Buffer
    }
    ,
    multimediContentType : {
        type : String,
        required: [true,'Please provide content type']
    },
    comments : {
        type : Array,
        default : []
    },
    score : {
        type : Number,
        default : 0
    },
    creatorUsername: {
        type : String,
        required: [true,'Please provide creator username']
    },
    upVoters : {
        type : Array,
        default : []
    },
    downVoters : {
        type:Array,
        default : []
    }
})


module.exports = mongo.model("Posts",PostSchema)