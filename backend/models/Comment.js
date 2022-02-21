const mongo = require('mongoose')

const CommentSchema = new mongo.Schema({
    creatorUsername : {
        type:String,
        required : [true,'Please provide creator']
    },
    text : {
        type:String,
        maxlength:500,
        required : [true,'Please provide text']
    },
    dateCreated : {
        type : Date,
        default : Date.now
    },
    score : {
        type : Number,
        default : 0
    },
    upVoters : {
        type : Array,
        default : []
    },
    downVoters : {
        type:Array,
        default : []
    },
    onPost : {
        type: mongo.Schema.Types.ObjectId,
        ref:"Posts",
        default : null   
    },
    onComment : {
        type: mongo.Schema.Types.ObjectId,
        ref:"Comments",
        default : null 
    }
})

module.exports = mongo.model("Comments",CommentSchema)